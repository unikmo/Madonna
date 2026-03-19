import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import MomentCode from '@/models/MomentCode';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { code, mediaType, url, publicId } = await request.json();
    const normalizedCode = String(code || '').toUpperCase().trim();

    if (!normalizedCode || !mediaType || !url || !publicId) {
      return NextResponse.json(
        { error: 'code, mediaType, url, and publicId are required' },
        { status: 400 }
      );
    }

    if (!String(publicId).startsWith(`unikmo-moments/${normalizedCode}/`)) {
      return NextResponse.json(
        { error: 'Invalid upload source. Public ID folder mismatch.' },
        { status: 400 }
      );
    }

    await connectDB();
    const momentCode = await MomentCode.findOne({ code: normalizedCode });

    if (!momentCode) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 404 });
    }

    if (momentCode.status !== 'new') {
      return NextResponse.json(
        { error: 'Code has already been claimed. Cannot upload media.' },
        { status: 400 }
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

