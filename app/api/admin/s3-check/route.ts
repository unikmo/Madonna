import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { verifyToken } from '@/lib/auth';
import {
  buildPublicUrlForKey,
  createPresignedPutUrl,
  getS3Client,
  getS3Config,
  requireS3Config,
} from '@/lib/s3';

export const runtime = 'nodejs';

type CheckRow = {
  id: string;
  label: string;
  ok: boolean;
  detail?: string;
  durationMs?: number;
};

function awsErr(e: unknown): string {
  if (e && typeof e === 'object') {
    const o = e as Record<string, unknown>;
    const name = typeof o.name === 'string' ? o.name : 'Error';
    const msg = typeof o.message === 'string' ? o.message : String(e);
    const meta = o.$metadata as { httpStatusCode?: number } | undefined;
    const code = meta?.httpStatusCode;
    return code ? `${name}: ${msg} (HTTP ${code})` : `${name}: ${msg}`;
  }
  return String(e);
}

async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload?.roles?.includes('admin')) return null;
  return payload;
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const checks: CheckRow[] = [];
  const t0 = Date.now();

  const cfg = getS3Config();
  const hasAccessKey = !!process.env.AWS_ACCESS_KEY_ID;
  const hasSecret = !!process.env.AWS_SECRET_ACCESS_KEY;

  checks.push({
    id: 'env',
    label: 'Environment (AWS_REGION, AWS_S3_BUCKET)',
    ok: !!cfg,
    detail: cfg
      ? `bucket=${cfg.bucket}, region=${cfg.region}, accessKeyId=${hasAccessKey ? 'set' : 'missing'}, secretAccessKey=${hasSecret ? 'set' : 'missing'}`
      : 'Set AWS_REGION and AWS_S3_BUCKET. For local/dev, set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY (or use an IAM role on the host).',
  });

  if (!cfg) {
    return NextResponse.json({
      ok: false,
      summary: 'S3 environment variables are incomplete.',
      checks,
      durationMs: Date.now() - t0,
    });
  }

  let client;
  try {
    client = getS3Client();
  } catch (e) {
    checks.push({
      id: 'client',
      label: 'S3 client',
      ok: false,
      detail: awsErr(e),
    });
    return NextResponse.json({
      ok: false,
      summary: 'Could not initialize S3 client.',
      checks,
      durationMs: Date.now() - t0,
    });
  }

  const { bucket, region } = requireS3Config();
  const publicBase =
    process.env.AWS_S3_PUBLIC_BASE_URL?.replace(/\/+$/, '') ??
    `https://${bucket}.s3.${region}.amazonaws.com`;

  const run = async (id: string, label: string, fn: () => Promise<string | void>): Promise<boolean> => {
    const start = Date.now();
    try {
      const extra = await fn();
      checks.push({
        id,
        label,
        ok: true,
        detail: typeof extra === 'string' ? extra : undefined,
        durationMs: Date.now() - start,
      });
      return true;
    } catch (e) {
      checks.push({
        id,
        label,
        ok: false,
        detail: awsErr(e),
        durationMs: Date.now() - start,
      });
      return false;
    }
  };

  await run('list', 'ListBucket (prefix unikmo-moments/)', async () => {
    const out = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: 'unikmo-moments/',
        MaxKeys: 5,
      })
    );
    const n = out.KeyCount ?? 0;
    return `Listed OK (sample keyCount=${n})`;
  });

  const probeId = randomUUID();
  const keySdk = `unikmo-moments/_admin_healthcheck/sdk-${probeId}.txt`;
  const keyPresign = `unikmo-moments/_admin_healthcheck/presign-${probeId}.txt`;
  const payload = `unikmo-admin-check ${probeId}`;
  const bodyBuf = Buffer.from(payload, 'utf8');

  const putOk = await run('put-sdk', 'PutObject (server SDK)', async () => {
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: keySdk,
        Body: bodyBuf,
        ContentType: 'text/plain; charset=utf-8',
      })
    );
    return 'Uploaded probe file';
  });

  let getOk = false;
  if (putOk) {
    const headOk = await run('head', 'HeadObject (metadata)', async () => {
      const h = await client.send(
        new HeadObjectCommand({ Bucket: bucket, Key: keySdk })
      );
      const len = h.ContentLength;
      return typeof len === 'number' ? `contentLength=${len}` : 'OK';
    });

    if (headOk) {
      getOk = await run('get', 'GetObject (read back)', async () => {
        const g = await client.send(
          new GetObjectCommand({ Bucket: bucket, Key: keySdk })
        );
        const text = await g.Body?.transformToString();
        if (text !== payload) {
          throw new Error(`Body mismatch`);
        }
        return `Read ${text?.length ?? 0} bytes`;
      });
    } else {
      checks.push({
        id: 'get',
        label: 'GetObject (read back)',
        ok: false,
        detail: 'Skipped (HeadObject failed)',
      });
    }

    if (getOk) {
      await run('public-url', 'Public GET (anonymous, for <video>/<img> URLs)', async () => {
        const url = buildPublicUrlForKey(keySdk);
        const res = await fetch(url, { method: 'GET', cache: 'no-store' });
        if (!res.ok) {
          throw new Error(
            `HTTP ${res.status} — check bucket policy for unikmo-moments/* and Block Public Access`
          );
        }
        const text = await res.text();
        if (text !== payload) {
          throw new Error('Public URL body did not match upload');
        }
        return 'Object readable without signing';
      });
    } else {
      checks.push({
        id: 'public-url',
        label: 'Public GET (anonymous, for <video>/<img> URLs)',
        ok: false,
        detail: headOk ? 'Skipped (GetObject failed)' : 'Skipped (HeadObject failed)',
      });
    }
  } else {
    checks.push({
      id: 'head',
      label: 'HeadObject (metadata)',
      ok: false,
      detail: 'Skipped (PutObject failed)',
    });
    checks.push({
      id: 'get',
      label: 'GetObject (read back)',
      ok: false,
      detail: 'Skipped (PutObject failed)',
    });
    checks.push({
      id: 'public-url',
      label: 'Public GET (anonymous, for <video>/<img> URLs)',
      ok: false,
      detail: 'Skipped (PutObject failed)',
    });
  }

  let presignOk = false;
  if (putOk && getOk) {
    presignOk = await run(
      'presign',
      'Presigned PutObject + HTTP PUT (browser upload)',
      async () => {
        const presignBody = `presign-${probeId}`;
        const buf = Buffer.from(presignBody, 'utf8');
        const { uploadUrl } = await createPresignedPutUrl({
          key: keyPresign,
          contentType: 'text/plain; charset=utf-8',
          contentLength: buf.length,
        });
        const putRes = await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          body: buf,
        });
        if (!putRes.ok) {
          const snippet = (await putRes.text()).slice(0, 200);
          throw new Error(`Presigned PUT HTTP ${putRes.status} ${snippet}`);
        }
        const g = await client.send(
          new GetObjectCommand({ Bucket: bucket, Key: keyPresign })
        );
        const text = await g.Body?.transformToString();
        if (text !== presignBody) {
          throw new Error('Verify after presigned PUT failed');
        }
        return 'Presign + PUT + GetObject OK';
      }
    );
  } else {
    checks.push({
      id: 'presign',
      label: 'Presigned PutObject + HTTP PUT (browser upload)',
      ok: false,
      detail: putOk ? 'Skipped (GetObject must succeed first)' : 'Skipped (PutObject failed)',
    });
  }

  await run('delete-sdk', 'DeleteObject (SDK probe)', async () => {
    if (!putOk) return 'Skipped (no upload)';
    await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: keySdk }));
    return 'Removed sdk probe';
  });

  await run('delete-presign', 'DeleteObject (presign probe)', async () => {
    if (!presignOk) {
      try {
        await client.send(
          new DeleteObjectCommand({ Bucket: bucket, Key: keyPresign })
        );
        return 'Removed stray presign key (if any)';
      } catch {
        return 'Skipped';
      }
    }
    await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: keyPresign }));
    return 'Removed presign probe';
  });

  const mustPass = ['env', 'put-sdk', 'head', 'get', 'presign', 'delete-sdk'];
  const failedMust = checks.filter((c) => mustPass.includes(c.id) && !c.ok);
  const publicRow = checks.find((c) => c.id === 'public-url');
  const ok = failedMust.length === 0;
  const publicRanButBlocked =
    !!publicRow &&
    !publicRow.ok &&
    !!publicRow.detail &&
    !publicRow.detail.startsWith('Skipped');

  let summary: string;
  if (failedMust.length) {
    summary = `Failed: ${failedMust.map((f) => f.label).join('; ')}`;
  } else if (publicRanButBlocked) {
    summary =
      'Core S3 API works, but anonymous public read failed — media URLs may not load in the browser until the bucket allows GetObject for your prefix.';
  } else {
    summary = 'All checks passed.';
  }

  return NextResponse.json({
    ok,
    summary,
    checks,
    bucket,
    region,
    publicBaseUrl: publicBase,
    durationMs: Date.now() - t0,
  });
}
