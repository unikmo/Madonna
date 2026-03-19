import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { validateShopifyHMAC, createShopifyClient } from '@/lib/shopify';
import { deriveCodesToGenerateFromLineItems, processPaidOrderAndGenerateCodes } from '@/lib/order-processing';

// Disable body parsing, we need raw body for HMAC validation
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Get raw body for HMAC validation
    // IMPORTANT: Must get body as text BEFORE any parsing
    const rawBody = await request.text();
    const signature = request.headers.get('x-shopify-hmac-sha256');

    // Debug logging (remove in production)
    console.log('Webhook received:');
    console.log('- Signature header present:', !!signature);
    console.log('- Body length:', rawBody.length);
    console.log('- Body preview (first 100 chars):', rawBody.substring(0, 100));
    console.log('- Signature preview:', signature?.substring(0, 30) + '...');

    if (!signature) {
      console.error('Missing X-Shopify-Hmac-Sha256 header');
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Missing HMAC signature header' },
        { status: 401 }
      );
    }

    // Validate HMAC (will get secret from DB or env)
    // TEMPORARY: bypass HMAC to test flow — remove this and use real validation in production
    const bypassHmac = process.env.BYPASS_SHOPIFY_WEBHOOK_HMAC === 'true';
    const isValid = bypassHmac || (await validateShopifyHMAC(rawBody, signature));
    if (bypassHmac) console.warn('[TEMPORARY] Shopify webhook HMAC validation bypassed (BYPASS_SHOPIFY_WEBHOOK_HMAC=true)');

    if (!isValid) {
      console.error('Invalid HMAC signature');
      console.error('- Received signature:', signature.substring(0, 20) + '...');
      console.error('- Make sure webhook secret in DB or SHOPIFY_WEBHOOK_SECRET matches the secret from Shopify webhook settings');
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    // Parse webhook payload
    const order = JSON.parse(rawBody);

    // Idempotency check - prevent duplicate processing
    await connectDB();
    const existingOrder = await Order.findOne({ shopifyOrderId: order.id.toString() });
    if (existingOrder) {
      console.log(`Order ${order.id} already processed, skipping`);
      return NextResponse.json({ message: 'Order already processed' }, { status: 200 });
    }

    // Extract order data
    const email = order.email?.toLowerCase().trim();
    if (!email) {
      return NextResponse.json({ error: 'Order email is required' }, { status: 400 });
    }

    // Process line items and extract product/variant data
    let shopifyClient: Awaited<ReturnType<typeof createShopifyClient>>;
    try {
      shopifyClient = await createShopifyClient();
    } catch (error: any) {
      console.error('Failed to initialize Shopify client:', error);
      return NextResponse.json(
        { error: 'Shopify configuration error', message: error.message },
        { status: 500 }
      );
    }

    const lineItems = order.line_items || [];
    const codesToGenerate = await deriveCodesToGenerateFromLineItems(lineItems, shopifyClient);

    if (codesToGenerate.length === 0) {
      console.warn(`No valid products/variants found for order ${order.id}`);
      return NextResponse.json(
        {
          error: 'No valid products/variants found',
          message: 'Could not extract product/variant data from order line items. Make sure metafields are set up correctly.',
        },
        { status: 400 }
      );
    }

    const result = await processPaidOrderAndGenerateCodes({
      shopifyOrderId: order.id.toString(),
      shopifyOrderNumber: String(order.order_number || order.id),
      shopifyOrderName: order.name || String(order.order_number || order.id),
      email,
      shopifyCustomerId: order.customer?.id?.toString(),
      totalPrice: parseFloat(order.total_price || '0'),
      currency: order.currency || 'USD',
      lineItems,
      codesToGenerate,
      source: 'webhook',
      tags: Array.isArray(order.tags)
        ? order.tags
        : typeof order.tags === 'string' && order.tags.trim()
          ? order.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
          : [],
      customerName: [order.customer?.first_name, order.customer?.last_name].filter(Boolean).join(' ').trim(),
    });

    if (result.generatedCodes.length === 0) {
      return NextResponse.json(
        {
          error: 'Code generation failed',
          message: 'Failed to generate any Moment Codes',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Order processed successfully',
      codesGenerated: result.generatedCodes.length,
    });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
