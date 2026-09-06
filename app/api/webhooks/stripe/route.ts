import { createHmac, timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { processStripePaidOrder } from '@/lib/order-processing';
import { getStripeTestProduct } from '@/lib/stripe-test-products';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function verifyStripeSignature(rawBody: string, signatureHeader: string, secret: string): boolean {
  const parts = signatureHeader.split(',').map((part) => part.trim());
  const timestampPart = parts.find((part) => part.startsWith('t='));
  const signatures = parts.filter((part) => part.startsWith('v1=')).map((part) => part.slice(3));

  if (!timestampPart || signatures.length === 0) return false;

  const timestamp = timestampPart.slice(2);
  const timestampNumber = Number(timestamp);
  if (!Number.isFinite(timestampNumber)) return false;

  // Reject stale webhook replays outside Stripe's normal five-minute tolerance.
  if (Math.abs(Math.floor(Date.now() / 1000) - timestampNumber) > 300) return false;

  const expected = createHmac('sha256', secret)
    .update(`${timestamp}.${rawBody}`, 'utf8')
    .digest('hex');

  const expectedBuffer = Buffer.from(expected, 'hex');
  return signatures.some((signature) => {
    try {
      const signatureBuffer = Buffer.from(signature, 'hex');
      return signatureBuffer.length === expectedBuffer.length && timingSafeEqual(signatureBuffer, expectedBuffer);
    } catch {
      return false;
    }
  });
}

function normalizeShipping(session: any) {
  const shipping = session?.shipping_details || session?.collected_information?.shipping_details;
  const address = shipping?.address;
  if (!address && !shipping?.name) return undefined;

  return {
    name: shipping?.name || '',
    line1: address?.line1 || '',
    line2: address?.line2 || '',
    city: address?.city || '',
    state: address?.state || '',
    postalCode: address?.postal_code || '',
    country: address?.country || '',
  };
}

export async function POST(request: NextRequest) {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured');
      return NextResponse.json({ error: 'Stripe webhook is not configured.' }, { status: 503 });
    }

    const rawBody = await request.text();
    const signature = request.headers.get('stripe-signature');
    if (!signature || !verifyStripeSignature(rawBody, signature, webhookSecret)) {
      return NextResponse.json({ error: 'Invalid Stripe webhook signature.' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    if (event?.type !== 'checkout.session.completed' && event?.type !== 'checkout.session.async_payment_succeeded') {
      return NextResponse.json({ received: true });
    }

    const session = event?.data?.object;
    if (!session?.id) {
      return NextResponse.json({ error: 'Missing Checkout Session.' }, { status: 400 });
    }

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ received: true, skipped: 'payment_not_paid' });
    }

    const product = getStripeTestProduct(session?.metadata?.unikmo_product_code);
    if (!product) {
      console.error('Stripe webhook has invalid or missing UNIKMO product metadata', session?.metadata);
      return NextResponse.json({ error: 'Invalid UNIKMO product metadata.' }, { status: 400 });
    }

    const metadataQuantity = Number(session?.metadata?.unikmo_key_quantity);
    if (metadataQuantity !== product.quantity) {
      console.error('Stripe webhook quantity metadata mismatch', {
        sessionId: session.id,
        metadataQuantity,
        productQuantity: product.quantity,
      });
      return NextResponse.json({ error: 'UNIKMO quantity metadata mismatch.' }, { status: 400 });
    }

    const email = session?.customer_details?.email || session?.customer_email;
    if (!email) {
      return NextResponse.json({ error: 'Checkout Session email is required.' }, { status: 400 });
    }

    await connectDB();
    const result = await processStripePaidOrder({
      checkoutSessionId: session.id,
      paymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id,
      email,
      totalPrice: Number(session.amount_total || 0) / 100,
      currency: String(session.currency || product.currency).toUpperCase(),
      productCode: product.code,
      quantity: product.quantity,
      customerName: session?.customer_details?.name || '',
      shippingAddress: normalizeShipping(session),
    });

    return NextResponse.json({
      received: true,
      created: result.created,
      orderId: result.orderId,
      codesGenerated: result.generatedCodes.length,
    });
  } catch (error: any) {
    console.error('Stripe webhook processing error:', error);
    return NextResponse.json(
      { error: 'Stripe webhook processing failed.', message: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
