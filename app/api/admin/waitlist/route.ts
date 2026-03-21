import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import WaitlistEntry from '@/models/WaitlistEntry';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const status = (request.nextUrl.searchParams.get('status') || '').trim();
    const query: Record<string, unknown> = {};
    if (status === 'pending' || status === 'invited' || status === 'code_sent') {
      query.status = status;
    }

    const entries = await WaitlistEntry.find(query).sort({ createdAt: -1 }).limit(500).lean();

    return NextResponse.json({
      entries: entries.map((e) => ({
        _id: e._id.toString(),
        email: e.email,
        name: e.name,
        deliveryType: e.deliveryType || null,
        productId: e.productId || null,
        productTitle: e.productTitle || null,
        quantity: e.quantity || null,
        status: e.status,
        order: e.order ? String(e.order) : null,
        generatedCodes: e.generatedCodes || [],
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
      })),
    });
  } catch (error: any) {
    console.error('GET /api/admin/waitlist:', error);
    return NextResponse.json({ error: error.message || 'Failed to load waitlist' }, { status: 500 });
  }
}
