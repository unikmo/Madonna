import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import WaitlistEntry from '@/models/WaitlistEntry';
import { processPaidOrderAndGenerateCodes } from '@/lib/order-processing';
import { resolveMomentProductVariant } from '@/lib/shopify-resolve-variant';
import type { DeliveryType, Quantity } from '@/lib/code-generator';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    const body = await request.json();
    const momentQuantity = Number(body.momentQuantity) as Quantity;
    const deliveryType = String(body.deliveryType || 'digital').trim() as DeliveryType;

    if (![1, 4, 7].includes(momentQuantity)) {
      return NextResponse.json({ error: 'momentQuantity must be 1, 4, or 7' }, { status: 400 });
    }
    if (deliveryType !== 'digital' && deliveryType !== 'physical') {
      return NextResponse.json({ error: 'deliveryType must be digital or physical' }, { status: 400 });
    }

    await connectDB();
    const entry = await WaitlistEntry.findById(id);
    if (!entry) {
      return NextResponse.json({ error: 'Waitlist entry not found' }, { status: 404 });
    }

    const resolved = await resolveMomentProductVariant(momentQuantity, deliveryType);
    if (!resolved) {
      return NextResponse.json({ error: 'Could not resolve Shopify variant' }, { status: 500 });
    }

    const shopifyOrderId = `WAITLIST-${entry._id.toString()}-${Date.now()}`;

    const result = await processPaidOrderAndGenerateCodes({
      shopifyOrderId,
      shopifyOrderNumber: `WL-${entry._id.toString().slice(-6).toUpperCase()}`,
      shopifyOrderName: `Waitlist — ${entry.name}`,
      email: entry.email,
      customerName: entry.name,
      totalPrice: 0,
      currency: 'USD',
      lineItems: [
        {
          product_id: resolved.productId,
          variant_id: resolved.variantId,
          quantity: 1,
        },
      ],
      codesToGenerate: [{ quantity: momentQuantity, deliveryType, orderQuantity: 1 }],
      source: 'waitlist',
      tags: ['waitlist_invite'],
    });

    if (result.generatedCodes.length === 0) {
      return NextResponse.json({ error: 'Code generation failed' }, { status: 500 });
    }

    entry.status = 'code_sent';
    entry.order = new mongoose.Types.ObjectId(result.orderId);
    entry.generatedCodes = result.generatedCodes;
    await entry.save();

    return NextResponse.json({
      success: true,
      orderId: result.orderId,
      generatedCodes: result.generatedCodes,
    });
  } catch (error: any) {
    console.error('POST waitlist generate-code:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate codes' }, { status: 500 });
  }
}
