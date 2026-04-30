import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import MomentCode from '@/models/MomentCode';
import {
  buildMomentObjectKey,
  buildPublicUrlForKey,
  deleteS3Object,
  extractS3ObjectKeyFromMediaUrl,
  getS3Config,
  putS3ObjectBody,
} from '@/lib/s3';
import {
  MAX_VIDEO_UPLOAD_BYTES,
  MAX_AUDIO_UPLOAD_BYTES,
  MAX_IMAGE_UPLOAD_BYTES,
  MAX_VIDEO_UPLOAD_LABEL,
} from '@/lib/media-upload-limits';

export const runtime = 'nodejs';
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    if (!getS3Config()) {
      return NextResponse.json(
        {
          error: 'Upload failed',
          message:
            'S3 is not configured. Set AWS_REGION, AWS_S3_BUCKET, and credentials (or use browser uploads via presigned URLs).',
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const code = formData.get('code')?.toString()?.toUpperCase().trim();
    const file = formData.get('file') as File | null;

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    const fileType = file.type || '';
    let mediaType: 'image' | 'video' | 'audio' | 'text' = 'text';

    if (fileType.startsWith('image/')) {
      mediaType = 'image';
    } else if (fileType.startsWith('video/')) {
      mediaType = 'video';
    } else if (fileType.startsWith('audio/')) {
      mediaType = 'audio';
    }

    if (mediaType === 'video' && file.size > MAX_VIDEO_UPLOAD_BYTES) {
      return NextResponse.json(
        {
          error: `Video file exceeds ${MAX_VIDEO_UPLOAD_LABEL} limit. Current size: ${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        },
        { status: 400 }
      );
    }

    if (mediaType === 'audio' && file.size > MAX_AUDIO_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: `Audio file exceeds 40 MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(2)} MB` },
        { status: 400 }
      );
    }

    if (mediaType === 'image' && file.size > MAX_IMAGE_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: `Image file exceeds 40 MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(2)} MB` },
        { status: 400 }
      );
    }

    await connectDB();

    const momentCode = await MomentCode.findOne({ code });

    if (!momentCode) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 404 });
    }

    if (momentCode.status !== 'new') {
      return NextResponse.json(
        { error: 'Code has already been claimed. Cannot upload media.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const objectKey = buildMomentObjectKey(code, file.name);
    const contentType = file.type || 'application/octet-stream';

    await putS3ObjectBody({ key: objectKey, body: buffer, contentType });

    const uploadUrl = buildPublicUrlForKey(objectKey);

    if (momentCode.media && momentCode.media.length > 0) {
      const existingMedia = momentCode.media[0];
      const oldKey = extractS3ObjectKeyFromMediaUrl(existingMedia.url);
      if (oldKey) {
        try {
          await deleteS3Object(oldKey);
        } catch (err) {
          console.warn('Failed to delete existing media from S3:', err);
        }
      }
    }

    momentCode.media = [
      {
        type: mediaType,
        url: uploadUrl,
        createdAt: new Date(),
      },
    ];
    momentCode.unlockable = true;

    await momentCode.save();

    return NextResponse.json({
      success: true,
      media: {
        type: mediaType,
        url: uploadUrl,
      },
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed', message: error.message },
      { status: 500 }
    );
  }
}
