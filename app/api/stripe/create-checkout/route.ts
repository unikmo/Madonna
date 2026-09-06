import { NextRequest, NextResponse } from 'next/server';
import { getStripeTestProduct } from '@/lib/stripe-test-products';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SHIPPING_COUNTRIES = ['DE', 'AT', 'CH', 'NL', 'BE', 'FR', 'IT', 'ES', 'PT', 'IE', 'GB', 'US', 'CA', 'AU'];

function getBaseUrl(request: NextRequest): string {
  // For the parallel test flow, always return to the environment that initiated Checkout.
  // This keeps preview testing isolated from production even when BASE_URL points to unikmo.com.
  const origin = request.headers.get('origin');
  if (origin) return origin.replace(/\/$/, '');

  const host = request.headers.get('host');
  if (host) {
    const protocol = host.includes('localhost') ? 'http' : 'https';
    return `${protocol}://${host}`;
  }

  const configured = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL;
  if (configured) return configured.replace(/\/$/, '');

  return 'http://localhost:3000';
}

export async function POST(request: NextRequest) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: 'Stripe test checkout is not configured on this environment.' },
        { status: 503 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const product = getStripeTestProduct(body?.productCode);
    if (!product) {
      return NextResponse.json({ error: 'Invalid UNIKMO product.' }, { status: 400 });
    }

    const baseUrl = getBaseUrl(request);
    const params = new URLSearchParams();
    params.set('mode', 'payment');
    params.set('success_url', `${baseUrl}/stripe-test/success?session_id={CHECKOUT_SESSION_ID}`);
    params.set('cancel_url', `${baseUrl}/stripe-test?cancelled=1`);
    params.set('billing_address_collection', 'required');
    params.set('customer_creation', 'always');
    params.set('payment_method_types[0]', 'card');
    params.set('line_items[0][quantity]', '1');
    params.set('line_items[0][price_data][currency]', product.currency);
    params.set('line_items[0][price_data][unit_amount]', String(product.unitAmount));
    params.set('line_items[0][price_data][product_data][name]', product.name);
    params.set('line_items[0][price_data][product_data][description]', product.description);
    params.set('metadata[unikmo_product_code]', product.code);
    params.set('metadata[unikmo_key_quantity]', String(product.quantity));
    params.set('metadata[unikmo_delivery_type]', 'physical');
    params.set('metadata[integration]', 'stripe-parallel-test');

    SHIPPING_COUNTRIES.forEach((country, index) => {
      params.set(`shipping_address_collection[allowed_countries][${index}]`, country);
    });

    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
      cache: 'no-store',
    });

    const session = await stripeResponse.json();
    if (!stripeResponse.ok || !session?.url) {
      console.error('Stripe Checkout Session creation failed:', session);
      return NextResponse.json(
        { error: session?.error?.message || 'Unable to create Stripe Checkout Session.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Session error:', error);
    return NextResponse.json(
      { error: error?.message || 'Unable to create Stripe Checkout Session.' },
      { status: 500 }
    );
  }
}
