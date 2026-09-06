import type { Quantity } from '@/lib/code-generator';

export type StripeTestProductCode = 'single' | 'four' | 'seven';

export type StripeTestProduct = {
  code: StripeTestProductCode;
  name: string;
  description: string;
  quantity: Quantity;
  unitAmount: number;
  currency: 'usd';
};

export const STRIPE_TEST_PRODUCTS: Record<StripeTestProductCode, StripeTestProduct> = {
  single: {
    code: 'single',
    name: 'UNIKMO Single Key',
    description: '1 physical UNIKMO card · 1 private memory',
    quantity: 1,
    unitAmount: 2400,
    currency: 'usd',
  },
  four: {
    code: 'four',
    name: 'UNIKMO 4-Key Bundle',
    description: '4 physical UNIKMO cards · 4 private memories',
    quantity: 4,
    unitAmount: 6400,
    currency: 'usd',
  },
  seven: {
    code: 'seven',
    name: 'UNIKMO 7-Key Bundle',
    description: '7 physical UNIKMO cards · 7 private memories',
    quantity: 7,
    unitAmount: 7200,
    currency: 'usd',
  },
};

export function getStripeTestProduct(code: string | null | undefined): StripeTestProduct | null {
  if (!code || !(code in STRIPE_TEST_PRODUCTS)) return null;
  return STRIPE_TEST_PRODUCTS[code as StripeTestProductCode];
}
