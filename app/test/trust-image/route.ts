import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const TESTIMONIAL_IMAGE = 'https://raw.githubusercontent.com/unikmo/Unikmo/website-build-pro/emotion-test-page/public/testimonials/customer-phone-live.jpg';

export async function GET() {
  return NextResponse.redirect(TESTIMONIAL_IMAGE, 307);
}
