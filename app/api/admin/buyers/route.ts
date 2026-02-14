import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Order from '@/models/Order';
import MomentCode from '@/models/MomentCode';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    await connectDB();

    const query: any = { roles: { $in: ['buyer'] } };
    if (search) {
      query.email = { $regex: search, $options: 'i' };
    }

    const buyers = await User.find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .limit(100);

    // Get stats for each buyer
    const buyersWithStats = await Promise.all(
      buyers.map(async (buyer) => {
        const [ordersCount, codesCount] = await Promise.all([
          Order.countDocuments({ user: buyer._id }),
          MomentCode.countDocuments({ user: buyer._id }),
        ]);

        return {
          _id: buyer._id.toString(),
          email: buyer.email,
          ordersCount,
          codesCount,
          createdAt: buyer.createdAt,
        };
      })
    );

    return NextResponse.json({ buyers: buyersWithStats });
  } catch (error: any) {
    console.error('Buyers error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
