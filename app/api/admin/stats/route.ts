import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Order from '@/models/Order';
import MomentCode from '@/models/MomentCode';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const [totalBuyers, totalOrders, totalCodes, claimedCodes, unclaimedCodes] = await Promise.all([
      User.countDocuments({ roles: { $in: ['buyer'] } }),
      Order.countDocuments(),
      MomentCode.countDocuments(),
      MomentCode.countDocuments({ status: 'claimed' }),
      MomentCode.countDocuments({ status: 'new' }),
    ]);

    return NextResponse.json({
      totalBuyers,
      totalOrders,
      totalCodes,
      claimedCodes,
      unclaimedCodes,
    });
  } catch (error: any) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
