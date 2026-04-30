import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import MomentCode from '@/models/MomentCode';
import {
  buildMomentObjectKey,
  buildPublicUrlForKey,
  createPresignedPutUrl,
  getS3Config,
} from '@/lib/s3';
import {
  MAX_VIDEO_UPLOAD_BYTES,
  MAX_AUDIO_UPLOAD_BYTES,
  MAX_IMAGE_UPLOAD_BYTES,
  MAX_VIDEO_UPLOAD_LABEL,
} from '@/lib/media-upload-limits';

export const runtime = 'nodejs';

function maxBytesForContentType(contentType: string): number {
  const ct = contentType.toLowerCase();
  if (ct.startsWith('video/')) return MAX_VIDEO_UPLOAD_BYTES;
  if (ct.startsWith('audio/')) return MAX_AUDIO_UPLOAD_BYTES;
  if (ct.startsWith('image/')) return MAX_IMAGE_UPLOAD_BYTES;
  return 0;
}

export async function POST(request: NextRequest) {
  try {
    if (!getS3Config()) {
      return NextResponse.json(
        {
          error: 'Upload is not configured on this deployment.',
          message:
            'Set AWS_REGION, AWS_S3_BUCKET, and credentials (or IAM role). Optional: AWS_S3_PUBLIC_BASE_URL for CDN, AWS_S3_PRESIGN_EXPIRES_SECONDS (default 14400).',
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const normalizedCode = String(body.code || '').toUpperCase().trim();
    const fileName = String(body.fileName || 'upload');
    const contentType = String(body.contentType || 'application/octet-stream').trim();
    const fileSize = Number(body.fileSize);

    if (!normalizedCode) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    if (!Number.isFinite(fileSize) || fileSize < 1) {
      return NextResponse.json({ error: 'fileSize is required' }, { status: 400 });
    }

    const maxBytes = maxBytesForContentType(contentType);
    if (maxBytes === 0) {
      return NextResponse.json(
        { error: 'Unsupported content type. Use image/*, video/*, or audio/*.' },
        { status: 400 }
      );
    }

    if (fileSize > maxBytes) {
      const label =
        contentType.startsWith('video/') ? MAX_VIDEO_UPLOAD_LABEL : '40 MB';
      return NextResponse.json(
        {
          error: `File exceeds ${label} limit for this type.`,
        },
        { status: 400 }
      );
    }

    await connectDB();
    const momentCode = await MomentCode.findOne({ code: normalizedCode });

    if (!momentCode) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 404 });
    }

    if (momentCode.status === 'revoked') {
      return NextResponse.json(
        {
          error: 'This code is unavailable.',
          reason: 'revoked',
          message:
            'This code is not available from UNIKMO. Please contact the UNIKMO team — we will be happy to help.',
        },
        { status: 403 }
      );
    }

    if (momentCode.status !== 'new') {
      return NextResponse.json(
        {
          error: 'This moment has already been unlocked.',
          reason: 'claimed',
          message:
            'This code has already been used. Upload is no longer available. Please contact the UNIKMO team if you need assistance.',
        },
        { status: 400 }
      );
    }

    if (Array.isArray(momentCode.media) && momentCode.media.length > 0) {
      return NextResponse.json(
        {
          error: 'Only one moment can be uploaded per key.',
          reason: 'media_exists',
          message:
            'You can upload one moment at a time. Delete the existing file first to replace it.',
        },
        { status: 409 }
      );
    }

    const objectKey = buildMomentObjectKey(normalizedCode, fileName);
    const { uploadUrl, expiresIn } = await createPresignedPutUrl({
      key: objectKey,
      contentType,
      contentLength: fileSize,
    });

    const publicUrl = buildPublicUrlForKey(objectKey);

    return NextResponse.json({
      success: true,
      uploadUrl,
      objectKey,
      publicUrl,
      expiresIn,
    });
  } catch (error: any) {
    console.error('S3 presign error:', error);
    return NextResponse.json(
      { error: 'Failed to create upload URL', message: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
