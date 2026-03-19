import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import connectDB from '@/lib/db';
import MomentCode from '@/models/MomentCode';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    const normalizedCode = String(code || '').toUpperCase().trim();

    if (!normalizedCode) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        {
          error: 'Cloudinary is not configured on this deployment.',
          message:
            'Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in Vercel environment variables.',
        },
        { status: 500 }
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

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = `unikmo-moments/${normalizedCode}`;

    const signature = cloudinary.utils.api_sign_request(
      { folder, timestamp },
      process.env.CLOUDINARY_API_SECRET
    );

    return NextResponse.json({
      success: true,
      timestamp,
      signature,
      folder,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch (error: any) {
    console.error('Cloudinary signature error:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload signature', message: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

