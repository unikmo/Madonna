import { NextRequest, NextResponse } from 'next/server';
import {
  curatedCheckoutUrl,
  type CuratedDeliveryKey,
  type CuratedExperienceKey,
} from '@/lib/curated-products';

interface CheckoutRequest {
  experience?: string;
  delivery?: string;
  extraKeepsakes?: number;
}

function resolveExperience(value?: string): CuratedExperienceKey {
  return /times square|show it/i.test(value ?? '') ? 'SHOW_IT' : 'KEEP_IT';
}

function resolveDelivery(value?: string): CuratedDeliveryKey {
  return /digital/i.test(value ?? '') ? 'digital' : 'physical';
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CheckoutRequest;

    const experience = resolveExperience(body.experience);
    const delivery = resolveDelivery(body.delivery);
    const extraKeepsakes = Number(body.extraKeepsakes) || 0;

    const checkoutUrl = curatedCheckoutUrl({ experience, delivery, extraKeepsakes });

    return NextResponse.json({ success: true, checkoutUrl, experience, delivery, extraKeepsakes });
  } catch (error) {
    console.error('Curated checkout error:', error);
    return NextResponse.json({ error: 'Failed to build checkout URL' }, { status: 500 });
  }
}
