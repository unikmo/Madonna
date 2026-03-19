import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import MomentCode from '@/models/MomentCode';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    await connectDB();
    const { orderId } = params;

    const order = await Order.findById(orderId).populate('user', 'email');
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const codes = await MomentCode.find({ order: order._id })
      .sort({ createdAt: -1 })
      .populate('user', 'email');

    return NextResponse.json({
      order: {
        _id: order._id.toString(),
        shopifyOrderId: order.shopifyOrderId,
        shopifyOrderName: order.shopifyOrderName || '',
        email: order.email,
        customerName: order.customerName || '',
        source: order.source || 'webhook',
        tags: order.tags || [],
        totalPrice: order.totalPrice,
        currency: order.currency,
        paymentStatus: order.paymentStatus,
        orderQuantity: order.orderQuantity,
        lineItems: order.lineItems || [],
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
      codes: codes.map((code) => ({
        _id: code._id.toString(),
        code: code.code,
        quantity: code.quantity,
        deliveryType: code.deliveryType,
        status: code.status,
        claimedAt: code.claimedAt || null,
        mediaCount: code.media.length,
        media: code.media || [],
        createdAt: code.createdAt,
        updatedAt: code.updatedAt,
      })),
    });
  } catch (error: any) {
    console.error('Admin order detail error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch order detail' }, { status: 500 });
  }
}

