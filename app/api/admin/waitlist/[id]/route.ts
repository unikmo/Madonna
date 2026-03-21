import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import WaitlistEntry from '@/models/WaitlistEntry';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    const body = await request.json();
    const { status } = body as { status?: string };

    if (status !== 'pending' && status !== 'invited' && status !== 'code_sent') {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await connectDB();
    const entry = await WaitlistEntry.findByIdAndUpdate(id, { $set: { status } }, { new: true }).lean();
    if (!entry) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({
      _id: entry._id.toString(),
      email: entry.email,
      name: entry.name,
      status: entry.status,
      order: entry.order ? String(entry.order) : null,
      generatedCodes: entry.generatedCodes || [],
    });
  } catch (error: any) {
    console.error('PATCH /api/admin/waitlist/[id]:', error);
    return NextResponse.json({ error: error.message || 'Failed to update' }, { status: 500 });
  }
}
