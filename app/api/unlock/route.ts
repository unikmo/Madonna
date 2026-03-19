import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import MomentCode from '@/models/MomentCode';
import { sendUnlockNotificationEmail } from '@/lib/email';

// Simple in-memory rate limiting (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_ATTEMPTS = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX_ATTEMPTS) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.ip || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    await connectDB();

    const momentCode = await MomentCode.findOne({ code: code.toUpperCase().trim() })
      .populate('user', 'email')
      .populate('order', 'shopifyOrderId');

    if (!momentCode) {
      return NextResponse.json(
        { error: 'Invalid code' },
        { status: 404 }
      );
    }

    // Update claimed status on first unlock
    if (momentCode.status === 'new') {
      momentCode.status = 'claimed';
      momentCode.claimedAt = new Date();
      await momentCode.save();

      const buyerEmail = momentCode?.user?.email;
      if (buyerEmail) {
        try {
          await sendUnlockNotificationEmail({
            to: buyerEmail,
            code: momentCode.code,
            unlockedAt: momentCode.claimedAt,
          });
        } catch (emailError) {
          // Do not block unlock success if email fails
          console.error('Unlock notification email failed:', emailError);
        }
      }
    }

    // Return media (no sensitive user data)
    return NextResponse.json({
      success: true,
      media: momentCode.media,
      quantity: momentCode.quantity,
      deliveryType: momentCode.deliveryType,
    });
  } catch (error: any) {
    console.error('Unlock error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
