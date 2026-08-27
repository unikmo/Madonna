import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Deterministic testimonial image endpoint.
 * Do not read the file through Node fs in a serverless function: that made the
 * image dependent on build packaging and caused the broken third testimonial.
 * The image is a committed public asset and this route always resolves to it.
 */
export async function GET(request: NextRequest) {
  const imageUrl = new URL('/testimonials/customer-phone-live.jpg', request.url);
  return NextResponse.redirect(imageUrl, 307);
}
