import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import WaitlistEntry from '@/models/WaitlistEntry';
import { getLatestAdminSettingsLean } from '@/lib/admin-settings-store';
import { mergeWaitlistCopy } from '@/lib/waitlist-copy-defaults';
import { sendWaitlistConfirmationEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const settings = await getLatestAdminSettingsLean();
    if (settings?.sellingEnabled !== false) {
      return NextResponse.json({ error: 'Waitlist is not open' }, { status: 403 });
    }

    const body = await request.json();
    const email = String(body.email || '')
      .trim()
      .toLowerCase();
    const name = String(body.name || '').trim();
    const deliveryType = String(body.deliveryType || '').trim().toLowerCase();
    const productId = String(body.productId || '').trim();
    const productTitle = String(body.productTitle || '').trim();
    const quantity = Number(body.quantity);
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!email || !emailRe.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }
    if (deliveryType && deliveryType !== 'physical' && deliveryType !== 'digital') {
      return NextResponse.json({ error: 'Invalid delivery type' }, { status: 400 });
    }
    if (quantity && ![1, 4, 7].includes(quantity)) {
      return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
    }

    const entry = await WaitlistEntry.create({
      email,
      name,
      deliveryType: deliveryType || undefined,
      productId: productId || undefined,
      productTitle: productTitle || undefined,
      quantity: quantity || undefined,
      status: 'pending',
      generatedCodes: [],
    });

    const copy = mergeWaitlistCopy(settings as Record<string, string | undefined>);
    let emailSent = false;
    try {
      emailSent = await sendWaitlistConfirmationEmail(email, copy, {
        name,
        productTitle: productTitle || undefined,
        quantity: quantity && [1, 4, 7].includes(quantity) ? quantity : undefined,
        deliveryType: deliveryType || undefined,
      });
      if (!emailSent) {
        console.error('Waitlist: confirmation email failed for', email);
      }
    } catch (err) {
      console.error('Waitlist: confirmation email error:', err);
    }

    return NextResponse.json({
      success: true,
      id: entry._id.toString(),
      emailSent,
    });
  } catch (error: any) {
    console.error('POST /api/public/waitlist:', error);
    return NextResponse.json({ error: error.message || 'Failed to join waitlist' }, { status: 500 });
  }
}
