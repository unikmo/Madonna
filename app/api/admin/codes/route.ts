import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import MomentCode from '@/models/MomentCode';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const quantity = searchParams.get('quantity') || '';
    const deliveryType = searchParams.get('deliveryType') || '';

    await connectDB();

    const query: any = {};

    if (search) {
      query.code = { $regex: search, $options: 'i' };
    }

    if (status) {
      query.status = status;
    }

    if (quantity) {
      query.quantity = parseInt(quantity);
    }

    if (deliveryType) {
      query.deliveryType = deliveryType;
    }

    const codes = await MomentCode.find(query)
      .populate('user', 'email')
      .populate('order', 'shopifyOrderId email totalPrice source tags')
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json({
      codes: codes.map((code) => ({
        _id: code._id.toString(),
        code: code.code,
        user: code.user,
        order: code.order,
        quantity: code.quantity,
        deliveryType: code.deliveryType,
        status: code.status,
        claimedAt: code.claimedAt,
        mediaCount: code.media.length,
        createdAt: code.createdAt,
      })),
    });
  } catch (error: any) {
    console.error('Codes error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { codeId, action } = await request.json();

    if (!codeId || !action) {
      return NextResponse.json(
        { error: 'codeId and action are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const code = await MomentCode.findById(codeId);

    if (!code) {
      return NextResponse.json({ error: 'Code not found' }, { status: 404 });
    }

    if (action === 'revoke') {
      code.status = 'revoked';
      code.claimedAt = undefined;
      await code.save();
    } else if (action === 'reset') {
      code.status = 'new';
      code.claimedAt = undefined;
      code.media = [];
      code.unlockable = false;
      await code.save();
    }

    return NextResponse.json({ success: true, code });
  } catch (error: any) {
    console.error('Code update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
