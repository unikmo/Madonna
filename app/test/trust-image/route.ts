import { NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export async function GET() {
  const image = await readFile(path.join(process.cwd(), 'public', 'testimonials', 'customer-phone-hq.webp'));

  return new NextResponse(image, {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
