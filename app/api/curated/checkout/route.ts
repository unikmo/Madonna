import { NextRequest, NextResponse } from 'next/server';
import { getEffectiveShopifyTestMode } from '@/lib/shopify-test-mode';
import { getShopifyCredentialsForAPI } from '@/lib/shopify';
import { getCuratedVariantId } from '@/lib/curated-products';

interface CheckoutRequest {
  experience: 'Keep It — Curated' | 'Show It + Keep It — Times Square Edition';
  delivery: 'Physical UNIKMO card' | 'Digital delivery';
  extraKeepsakes: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CheckoutRequest;
    const { experience, delivery, extraKeepsakes } = body;

    if (!experience || !delivery) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const isTestMode = await getEffectiveShopifyTestMode();
    const credentials = await getShopifyCredentialsForAPI();
    const storeDomain = credentials.storeDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');

    let productKey: 'KEEP_IT' | 'SHOW_IT';
    let variantKey: 'physical' | 'digital';

    if (experience === 'Show It + Keep It — Times Square Edition') {
      productKey = 'SHOW_IT';
    } else {
      productKey = 'KEEP_IT';
    }

    variantKey = delivery === 'Physical UNIKMO card' ? 'physical' : 'digital';

    const baseVariantId = getCuratedVariantId(productKey, variantKey, isTestMode);
    const variantIdMatch = baseVariantId.match(/\/(\d+)$/);
    
    if (!variantIdMatch) {
      return NextResponse.json({ error: 'Invalid variant configuration' }, { status: 500 });
    }
    
    const numericVariantId = variantIdMatch[1];

    const cartItems: Array<{ variantId: string; quantity: number }> = [
      { variantId: numericVariantId, quantity: 1 },
    ];

    if (extraKeepsakes > 0) {
      const extrasVariantId = getCuratedVariantId('EXTRA_KEEPSAKES', 'standard', isTestMode);
      const extrasMatch = extrasVariantId.match(/\/(\d+)$/);
      
      if (!extrasMatch) {
        return NextResponse.json({ error: 'Invalid extras configuration' }, { status: 500 });
      }
      
      cartItems.push({ variantId: extrasMatch[1], quantity: extraKeepsakes });
    }

    const cartString = cartItems.map((item) => `${item.variantId}:${item.quantity}`).join(',');
    const checkoutUrl = `https://${storeDomain}/cart/${cartString}`;

    return NextResponse.json({
      success: true,
      checkoutUrl,
      cartItems,
      experience,
      delivery,
      extraKeepsakes,
    });
  } catch (error: any) {
    console.error('Curated checkout error:', error);
    return NextResponse.json({ error: 'Failed to generate checkout URL' }, { status: 500 });
  }
}
