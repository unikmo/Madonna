import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import MomentCode from '@/models/MomentCode';
import { createShopifyClient } from '@/lib/shopify';
import { getEffectiveShopifyTestMode } from '@/lib/shopify-test-mode';
import { processPaidOrderAndGenerateCodes } from '@/lib/order-processing';
import type { DeliveryType, Quantity } from '@/lib/code-generator';

export const dynamic = 'force-dynamic';

const LIVE_PRODUCTS: Record<Quantity, string> = {
  1: 'gid://shopify/Product/16094803853657',
  4: 'gid://shopify/Product/16094852219225',
  7: 'gid://shopify/Product/16094859526489',
};

const TEST_PRODUCTS: Record<Quantity, string> = {
  1: 'gid://shopify/Product/8326274121914',
  4: 'gid://shopify/Product/8326277005498',
  7: 'gid://shopify/Product/8326277234874',
};

function parseNumericShopifyId(gidOrNumeric: string): string {
  const value = String(gidOrNumeric || '');
  return value.includes('/') ? value.split('/').pop() || '' : value;
}

function toVariantGid(variantId: string): string {
  return variantId.startsWith('gid://')
    ? variantId
    : `gid://shopify/ProductVariant/${variantId}`;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const search = (searchParams.get('search') || '').trim();
    const source = (searchParams.get('source') || '').trim();

    const query: Record<string, any> = {};
    if (source === 'admin' || source === 'webhook') {
      query.source = source;
    }
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { shopifyOrderId: { $regex: search, $options: 'i' } },
        { shopifyOrderName: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
      ];
    }

    const orders = await Order.find(query)
      .populate('user', 'email')
      .sort({ createdAt: -1 })
      .limit(100);

    const orderIds = orders.map((o) => o._id);
    const codeStats = await MomentCode.aggregate([
      { $match: { order: { $in: orderIds } } },
      {
        $group: {
          _id: '$order',
          totalCodes: { $sum: 1 },
          claimedCodes: {
            $sum: {
              $cond: [{ $eq: ['$status', 'claimed'] }, 1, 0],
            },
          },
          mediaCodes: {
            $sum: {
              $cond: [{ $gt: [{ $size: '$media' }, 0] }, 1, 0],
            },
          },
        },
      },
    ]);

    const statsMap = new Map<string, { totalCodes: number; claimedCodes: number; mediaCodes: number }>();
    for (const stat of codeStats) {
      statsMap.set(String(stat._id), {
        totalCodes: stat.totalCodes || 0,
        claimedCodes: stat.claimedCodes || 0,
        mediaCodes: stat.mediaCodes || 0,
      });
    }

    return NextResponse.json({
      orders: orders.map((order) => {
        const stats = statsMap.get(order._id.toString()) || {
          totalCodes: 0,
          claimedCodes: 0,
          mediaCodes: 0,
        };
        return {
          _id: order._id.toString(),
          shopifyOrderId: order.shopifyOrderId,
          shopifyOrderName: order.shopifyOrderName || '',
          email: order.email,
          customerName: order.customerName || '',
          totalPrice: order.totalPrice,
          currency: order.currency,
          source: order.source || 'webhook',
          tags: order.tags || [],
          orderQuantity: order.orderQuantity,
          createdAt: order.createdAt,
          totalCodes: stats.totalCodes,
          claimedCodes: stats.claimedCodes,
          mediaCodes: stats.mediaCodes,
        };
      }),
    });
  } catch (error: any) {
    console.error('Admin orders list error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();
    const customerName = String(body.customerName || '').trim();
    const productId = String(body.productId || '').trim();
    const variantId = String(body.variantId || '').trim();
    const momentQuantity = Number(body.momentQuantity) as Quantity;
    const deliveryType = String(body.deliveryType || '').trim() as DeliveryType;
    const customTag = String(body.customTag || '').trim();

    if (!email || !productId || !variantId || !momentQuantity || !deliveryType) {
      return NextResponse.json(
        { error: 'email, productId, variantId, momentQuantity and deliveryType are required' },
        { status: 400 }
      );
    }

    if (![1, 4, 7].includes(momentQuantity) || !['digital', 'physical'].includes(deliveryType)) {
      return NextResponse.json({ error: 'Invalid quantity or delivery type' }, { status: 400 });
    }

    const isTestMode = await getEffectiveShopifyTestMode();
    const allowedProducts = isTestMode ? TEST_PRODUCTS : LIVE_PRODUCTS;
    if (allowedProducts[momentQuantity] !== productId) {
      return NextResponse.json(
        { error: 'Selected product does not match the requested key quantity' },
        { status: 400 }
      );
    }

    const tags = ['admin_created', ...(customTag ? [customTag] : [])];
    const variantGid = toVariantGid(variantId);
    const client = await createShopifyClient();

    const draftCreate = await client.createDraftOrder({
      email,
      tags,
      note: customerName ? `Admin order for ${customerName}` : 'Admin-created order',
      lineItems: [{ variantId: variantGid, quantity: 1 }],
    });

    const draftErrors = draftCreate?.draftOrderCreate?.userErrors || [];
    if (draftErrors.length > 0) {
      return NextResponse.json({ error: draftErrors[0].message || 'Failed to create draft order' }, { status: 400 });
    }

    const draftOrderId = draftCreate?.draftOrderCreate?.draftOrder?.id;
    if (!draftOrderId) {
      return NextResponse.json({ error: 'Shopify draft order creation failed' }, { status: 500 });
    }

    const draftComplete = await client.completeDraftOrder(draftOrderId, false);
    const completeErrors = draftComplete?.draftOrderComplete?.userErrors || [];
    if (completeErrors.length > 0) {
      return NextResponse.json({ error: completeErrors[0].message || 'Failed to complete draft order' }, { status: 400 });
    }

    const orderNode = draftComplete?.draftOrderComplete?.draftOrder?.order;
    if (!orderNode?.id) {
      return NextResponse.json({ error: 'Shopify did not return an order after completion' }, { status: 500 });
    }

    const shopifyOrderId = parseNumericShopifyId(orderNode.id);
    const orderName = orderNode.name || shopifyOrderId;
    const orderCurrency = orderNode?.totalPriceSet?.shopMoney?.currencyCode || 'USD';
    const orderTotal = parseFloat(orderNode?.totalPriceSet?.shopMoney?.amount || '0');
    const lineItemEdges = orderNode?.lineItems?.edges || [];

    const internalLineItems = lineItemEdges.length
      ? lineItemEdges.map((edge: any) => ({
          product_id: parseNumericShopifyId(edge?.node?.variant?.product?.id || productId),
          variant_id: parseNumericShopifyId(edge?.node?.variant?.id || variantId),
          quantity: Number(edge?.node?.quantity || 1),
        }))
      : [
          {
            product_id: parseNumericShopifyId(productId),
            variant_id: parseNumericShopifyId(variantId),
            quantity: 1,
          },
        ];

    await connectDB();
    const result = await processPaidOrderAndGenerateCodes({
      shopifyOrderId,
      shopifyOrderNumber: orderName,
      shopifyOrderName: orderName,
      email,
      totalPrice: orderTotal,
      currency: orderCurrency,
      lineItems: internalLineItems,
      codesToGenerate: [{ quantity: momentQuantity, deliveryType, orderQuantity: 1 }],
      source: 'admin',
      tags,
      customerName,
    });

    if (result.generatedCodes.length === 0) {
      return NextResponse.json(
        { error: 'Order created, but code generation failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: result.orderId,
      shopifyOrderId,
      shopifyOrderName: orderName,
      generatedCodes: result.generatedCodes,
    });
  } catch (error: any) {
    console.error('Admin create order error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
}

