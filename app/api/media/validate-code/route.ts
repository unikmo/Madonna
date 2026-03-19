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
      return NextResponse.json(
        {
          valid: false,
          reason: 'invalid',
          error: 'Invalid code',
          message: 'We could not find this Moment Code. Please check the key and try again.',
        },
        { status: 200 }
      );
    }

    if (momentCode.status === 'revoked') {
      return NextResponse.json(
        {
          valid: false,
          reason: 'revoked',
          error: 'This code is unavailable.',
          message:
            'This code is not available from UNIKMO. Please contact the UNIKMO team — we will be happy to help.',
        },
        { status: 200 }
      );
    }

    if (momentCode.status !== 'new') {
      return NextResponse.json(
        {
          valid: false,
          reason: 'claimed',
          error: 'This moment has already been unlocked.',
          message:
            'This code has already been used. If you need help, please contact the UNIKMO team.',
        },
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
