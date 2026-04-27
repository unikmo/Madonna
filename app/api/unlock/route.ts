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

function isMongoConnectivityError(err: unknown): boolean {
  const name = err && typeof err === 'object' && 'name' in err ? String((err as { name: string }).name) : '';
  const msg = err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : '';
  return (
    name === 'MongoServerSelectionError' ||
    name === 'MongoNetworkError' ||
    name === 'MongoParseError' ||
    /MONGODB_URI|ECONNREFUSED|ENOTFOUND|SSL|TLS|timed out|Server selection/i.test(msg)
  );
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

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body', message: 'Expected JSON with a code field.' },
        { status: 400 }
      );
    }

    const code =
      body &&
      typeof body === 'object' &&
      'code' in body &&
      typeof (body as { code: unknown }).code === 'string'
        ? (body as { code: string }).code
        : '';

    if (!code || !code.trim()) {
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

    if (momentCode.status === 'revoked') {
      return NextResponse.json(
        {
          error: 'This code is unavailable.',
          reason: 'revoked',
          message: 'This code is unavailable. Please contact the UNIKMO team.',
        },
        { status: 403 }
      );
    }

    const hasMedia = Array.isArray(momentCode.media) && momentCode.media.length > 0;
    const isUnlockable = Boolean((momentCode as any).unlockable) || hasMedia;
    if (!isUnlockable) {
      return NextResponse.json(
        {
          error: 'This moment cannot be unlocked yet.',
          reason: 'not_unlockable',
          message:
            'This moment cannot be unlocked because the owner has not uploaded media yet.',
        },
        { status: 403 }
      );
    }

    // Update claimed status on first unlock
    if (momentCode.status === 'new') {
      momentCode.status = 'claimed';
      momentCode.claimedAt = new Date();
      await momentCode.save();

      const buyerEmail =
        momentCode.user && typeof momentCode.user === 'object' && 'email' in momentCode.user
          ? String((momentCode.user as { email?: string }).email || '')
          : '';
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
  } catch (error: unknown) {
    const err = error as { name?: string; message?: string };
    console.error('[unlock] POST error:', err?.name, err?.message, error);

    if (err?.message?.includes('MONGODB_URI is not set')) {
      return NextResponse.json(
        {
          error: 'Server misconfiguration',
          code: 'missing_mongodb_uri',
          message: 'Database URL is not configured on this deployment.',
        },
        { status: 503 }
      );
    }

    if (isMongoConnectivityError(error)) {
      return NextResponse.json(
        {
          error: 'Database unavailable',
          code: 'db_connection',
          message:
            'Could not reach MongoDB from this server. On Atlas: Network Access → add 0.0.0.0/0 (or Vercel’s ranges). Confirm MONGODB_URI in Vercel matches your cluster.',
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
