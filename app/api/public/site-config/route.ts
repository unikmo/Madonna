import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getPublicSiteConfig } from '@/lib/site-config';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const config = await getPublicSiteConfig();
    return NextResponse.json(config);
  } catch (error: any) {
    console.error('GET /api/public/site-config:', error);
    return NextResponse.json({ error: error.message || 'Failed to load config' }, { status: 500 });
  }
}
