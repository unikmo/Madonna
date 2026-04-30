import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import MomentCode from '@/models/MomentCode';
import { deleteS3Object, extractS3ObjectKeyFromMediaUrl, getS3Config } from '@/lib/s3';

async function handleDelete(request: NextRequest) {
  try {
    const { code, mediaUrl } = await request.json();

    if (!code || !mediaUrl) {
      return NextResponse.json(
        { error: 'Code and mediaUrl are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const momentCode = await MomentCode.findOne({ code: code.toUpperCase().trim() });

    if (!momentCode) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 404 });
    }

    if (momentCode.status !== 'new') {
      return NextResponse.json(
        { error: 'Code has already been claimed. Cannot delete media.' },
        { status: 400 }
      );
    }

    const mediaIndex = momentCode.media.findIndex((m) => m.url === mediaUrl);

    if (mediaIndex === -1) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    if (getS3Config()) {
      const objectKey = extractS3ObjectKeyFromMediaUrl(mediaUrl);
      if (objectKey) {
        try {
          await deleteS3Object(objectKey);
        } catch (err: any) {
          console.error('Failed to delete from S3:', err);
        }
      }
    }

    momentCode.media.splice(mediaIndex, 1);
    momentCode.unlockable = momentCode.media.length > 0;
    await momentCode.save();

    return NextResponse.json({
      success: true,
      message: 'Media deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete media error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  return handleDelete(request);
}

/**
 * Compatibility fallback for clients/environments where DELETE with body is blocked.
 */
export async function POST(request: NextRequest) {
  return handleDelete(request);
}
