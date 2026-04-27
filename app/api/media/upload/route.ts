import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import MomentCode from '@/models/MomentCode';
import { uploadToCloudinary } from '@/lib/cloudinary';
import {
  MAX_VIDEO_UPLOAD_BYTES,
  MAX_AUDIO_UPLOAD_BYTES,
  MAX_IMAGE_UPLOAD_BYTES,
  MAX_VIDEO_UPLOAD_LABEL,
} from '@/lib/media-upload-limits';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes for large uploads (raise on host if 1 GB uploads timeout)

export async function POST(request: NextRequest) {
  try {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        {
          error: 'Upload failed',
          message:
            'Cloudinary is not configured on this deployment. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.',
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

    // Determine media type from file
    const fileType = file.type || '';
    let mediaType: 'image' | 'video' | 'audio' | 'text' = 'text';

    if (fileType.startsWith('image/')) {
      mediaType = 'image';
    } else if (fileType.startsWith('video/')) {
      mediaType = 'video';
    } else if (fileType.startsWith('audio/')) {
      mediaType = 'audio';
    }

    // Validate file size based on type
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

    // Find the moment code
    const momentCode = await MomentCode.findOne({ code });

    if (!momentCode) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 404 });
    }

    // Check if code is still new (not claimed)
    if (momentCode.status !== 'new') {
      return NextResponse.json(
        { error: 'Code has already been claimed. Cannot upload media.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(
      buffer,
      `unikmo-moments/${code}`,
      mediaType === 'image' ? 'image' : mediaType === 'video' ? 'video' : 'raw'
    );

    // Delete existing media from Cloudinary if any
    if (momentCode.media && momentCode.media.length > 0) {
      const existingMedia = momentCode.media[0];
      // Extract public ID from Cloudinary URL
      const urlParts = existingMedia.url.split('/');
      const publicIdWithExt = urlParts.slice(-2).join('/').split('.')[0];
      const publicId = `unikmo-moments/${publicIdWithExt}`;
      
      try {
        const { v2: cloudinary } = await import('cloudinary');
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.warn('Failed to delete existing media from Cloudinary:', err);
      }
    }

    // Replace existing media (only one file allowed)
    momentCode.media = [{
      type: mediaType,
      url: uploadResult.url,
      createdAt: new Date(),
    }];
    momentCode.unlockable = true;

    await momentCode.save();

    return NextResponse.json({
      success: true,
      media: {
        type: mediaType,
        url: uploadResult.url,
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
