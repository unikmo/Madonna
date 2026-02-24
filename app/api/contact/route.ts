import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'mbanwie@gmail.com';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, message } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const subject = `Unikmo contact from ${email.trim()}`;
    const html = `
      <p><strong>From:</strong> ${email.trim()}</p>
      <p><strong>Message:</strong></p>
      <p>${message.trim().replace(/\n/g, '<br>')}</p>
    `;

    const ok = await sendEmail(CONTACT_EMAIL, subject, html);
    if (!ok) {
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
