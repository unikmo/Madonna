import { NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-dynamic';

export async function GET() {
  const image = await readFile(path.join(process.cwd(), 'public', 'testimonials', 'customer-phone-live.jpg'));

  return new NextResponse(image, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
