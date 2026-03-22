import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import WaitlistEntry from '@/models/WaitlistEntry';
import { sendEmail } from '@/lib/email';
import { buildSellingOpenEmailHtml } from '@/lib/selling-open-email-html';

export const dynamic = 'force-dynamic';

const BASE = (process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://unikmo.com').replace(/\/$/, '');
const SHOP_URL = `${BASE}/#shop`;

/**
 * POST — Email every unique waitlist address that the shop is open (selling enabled on site).
 * Dedupes by email. Sends sequentially to avoid SMTP bursts.
 */
export async function POST() {
  try {
    await connectDB();
    const entries = await WaitlistEntry.find({}).sort({ createdAt: -1 }).limit(1000).lean();

    const seen = new Set<string>();
    const recipients: { email: string; name: string }[] = [];
    for (const e of entries) {
      const em = String(e.email || '')
        .toLowerCase()
        .trim();
      if (!em || seen.has(em)) continue;
      seen.add(em);
      recipients.push({ email: em, name: String(e.name || 'there').trim() || 'there' });
    }

    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const r of recipients) {
      try {
        const { html, subject } = buildSellingOpenEmailHtml({
          name: r.name,
          shopUrl: SHOP_URL,
        });
        const ok = await sendEmail(r.email, subject, html);
        if (ok) {
          sent += 1;
          await WaitlistEntry.updateMany({ email: r.email }, { $set: { status: 'invited' } });
        } else {
          failed += 1;
          errors.push(r.email);
        }
      } catch (err: any) {
        failed += 1;
        errors.push(`${r.email}: ${err?.message || 'error'}`);
      }
    }

    return NextResponse.json({
      ok: true,
      total: recipients.length,
      sent,
      failed,
      errors: errors.slice(0, 10),
    });
  } catch (error: any) {
    console.error('POST /api/admin/waitlist/notify-selling-open:', error);
    return NextResponse.json({ error: error.message || 'Failed to notify waitlist' }, { status: 500 });
  }
}
