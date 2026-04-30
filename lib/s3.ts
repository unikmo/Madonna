import { randomUUID } from 'crypto';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

let cachedClient: S3Client | null = null;

export function getS3Config(): { bucket: string; region: string } | null {
  const bucket = process.env.AWS_S3_BUCKET;
  const region = process.env.AWS_REGION;
  if (!bucket || !region) return null;
  return { bucket, region };
}

export function requireS3Config(): { bucket: string; region: string } {
  const cfg = getS3Config();
  if (!cfg) {
    throw new Error('AWS_S3_BUCKET and AWS_REGION are required');
  }
  return cfg;
}

export function getS3Client(): S3Client {
  if (!cachedClient) {
    cachedClient = new S3Client({ region: process.env.AWS_REGION });
  }
  return cachedClient;
}

export function buildPublicUrlForKey(key: string): string {
  const { bucket, region } = requireS3Config();
  const custom = process.env.AWS_S3_PUBLIC_BASE_URL?.replace(/\/+$/, '');
  const base = custom ?? `https://${bucket}.s3.${region}.amazonaws.com`;
  const encodedKey = key.split('/').map(encodeURIComponent).join('/');
  return `${base}/${encodedKey}`;
}

function publicUrlPrefixes(): string[] {
  const cfg = getS3Config();
  if (!cfg) return [];
  const { bucket, region } = cfg;
  const list: string[] = [];
  const custom = process.env.AWS_S3_PUBLIC_BASE_URL?.replace(/\/+$/, '');
  if (custom) list.push(custom);
  list.push(`https://${bucket}.s3.${region}.amazonaws.com`);
  list.push(`https://s3.${region}.amazonaws.com/${bucket}`);
  return list;
}

/** Reverse of buildPublicUrlForKey for delete; supports virtual-hosted and path-style URLs. */
export function extractS3ObjectKeyFromMediaUrl(mediaUrl: string): string | null {
  for (const prefix of publicUrlPrefixes()) {
    if (mediaUrl === prefix) return '';
    if (mediaUrl.startsWith(prefix + '/')) {
      const pathPart = mediaUrl.slice(prefix.length + 1).split('?')[0];
      try {
        return decodeURIComponent(pathPart);
      } catch {
        return pathPart;
      }
    }
  }
  return null;
}

export async function deleteS3Object(key: string): Promise<void> {
  const { bucket } = requireS3Config();
  const client = getS3Client();
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

export async function putS3ObjectBody(options: {
  key: string;
  body: Buffer;
  contentType: string;
}): Promise<void> {
  const { bucket } = requireS3Config();
  const client = getS3Client();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: options.key,
      Body: options.body,
      ContentType: options.contentType,
    })
  );
}

export async function createPresignedPutUrl(options: {
  key: string;
  contentType: string;
  contentLength: number;
}): Promise<{ uploadUrl: string; expiresIn: number }> {
  const { bucket } = requireS3Config();
  const client = getS3Client();
  const raw = process.env.AWS_S3_PRESIGN_EXPIRES_SECONDS;
  const parsed = raw ? Number(raw) : NaN;
  let expiresIn = Number.isFinite(parsed) ? parsed : 14_400;
  expiresIn = Math.min(604_800, Math.max(600, Math.floor(expiresIn)));

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: options.key,
    ContentType: options.contentType,
    ContentLength: options.contentLength,
  });
  const uploadUrl = await getSignedUrl(client, command, { expiresIn });
  return { uploadUrl, expiresIn };
}

export function sanitizeUploadFileName(raw: string): string {
  const base = raw.replace(/^.*[/\\]/, '') || 'upload';
  const trimmed = base.slice(0, 200);
  return trimmed.replace(/[^a-zA-Z0-9._-]+/g, '_') || 'upload';
}

export function buildMomentObjectKey(code: string, fileName: string): string {
  const safe = sanitizeUploadFileName(fileName);
  return `unikmo-moments/${code}/${randomUUID()}-${safe}`;
}
