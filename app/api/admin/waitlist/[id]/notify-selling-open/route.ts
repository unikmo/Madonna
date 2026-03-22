import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import WaitlistEntry from '@/models/WaitlistEntry';
import mongoose from 'mongoose';
import { sendEmail } from '@/lib/email';
import { buildSellingOpenEmailHtml } from '@/lib/selling-open-email-html';

export const dynamic = 'force-dynamic';

const BASE = (process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://unikmo.com').replace(/\/$/, '');
const SHOP_URL = `${BASE}/#shop`;

/**
 * POST — Send the “shop is open” email to this waitlist entry only.
 */
export async function POST(_request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    await connectDB();
    const entry = await WaitlistEntry.findById(id).lean();
    if (!entry) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const email = String(entry.email || '')
      .toLowerCase()
      .trim();
    if (!email) {
      return NextResponse.json({ error: 'Entry has no email' }, { status: 400 });
    }

    const name = String(entry.name || 'there').trim() || 'there';
    const { html, subject } = buildSellingOpenEmailHtml({
      name,
      shopUrl: SHOP_URL,
    });

    const ok = await sendEmail(email, subject, html);
    if (!ok) {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 502 });
    }

    await WaitlistEntry.findByIdAndUpdate(id, { $set: { status: 'invited' } });

    return NextResponse.json({ ok: true, email, sent: 1, status: 'invited' });
  } catch (error: any) {
    console.error('POST /api/admin/waitlist/[id]/notify-selling-open:', error);
    return NextResponse.json({ error: error.message || 'Failed to send' }, { status: 500 });
  }
}
