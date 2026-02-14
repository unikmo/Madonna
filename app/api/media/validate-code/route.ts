import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import MomentCode from '@/models/MomentCode';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code')?.toUpperCase().trim();

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    await connectDB();

    const momentCode = await MomentCode.findOne({ code }).select('status');

    if (!momentCode) {
      return NextResponse.json({ valid: false, error: 'Invalid code' }, { status: 200 });
    }

    if (momentCode.status !== 'new') {
      return NextResponse.json(
        { valid: false, error: 'Code has already been claimed' },
        { status: 200 }
      );
    }

    return NextResponse.json({ valid: true });
  } catch (error: any) {
    console.error('Code validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
