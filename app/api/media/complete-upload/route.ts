import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import MomentCode from '@/models/MomentCode';
import { buildPublicUrlForKey, deleteS3Object, getS3Config } from '@/lib/s3';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    if (!getS3Config()) {
      return NextResponse.json(
        { error: 'S3 is not configured (AWS_REGION, AWS_S3_BUCKET).' },
        { status: 500 }
      );
    }

    const { code, mediaType, objectKey } = await request.json();
    const normalizedCode = String(code || '').toUpperCase().trim();
    const key = String(objectKey || '').trim();

    if (!normalizedCode || !mediaType || !key) {
      return NextResponse.json(
        { error: 'code, mediaType, and objectKey are required' },
        { status: 400 }
      );
    }

    if (!key.startsWith(`unikmo-moments/${normalizedCode}/`)) {
      return NextResponse.json(
        { error: 'Invalid upload source. Object key does not match this code.' },
        { status: 400 }
      );
    }

    const url = buildPublicUrlForKey(key);

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
            'This code has already been used. Please contact the UNIKMO team if you need assistance.',
        },
        { status: 400 }
      );
    }

    if (Array.isArray(momentCode.media) && momentCode.media.length > 0) {
      try {
        await deleteS3Object(key);
      } catch (cleanupError) {
        console.warn('Failed to cleanup extra S3 object:', cleanupError);
      }

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

    const alreadyExists = Array.isArray(momentCode.media)
      ? momentCode.media.some((m) => m.url === url)
      : false;
    if (!alreadyExists) {
      if (!Array.isArray(momentCode.media)) momentCode.media = [];
      momentCode.media.push({
        type: mediaType,
        url,
        createdAt: new Date(),
      });
    }
    momentCode.unlockable = Array.isArray(momentCode.media) && momentCode.media.length > 0;

    await momentCode.save();

    return NextResponse.json({
      success: true,
      media: {
        type: mediaType,
        url,
      },
      mediaCount: momentCode.media.length,
    });
  } catch (error: any) {
    console.error('Complete upload error:', error);
    return NextResponse.json(
      { error: 'Failed to finalize upload', message: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
