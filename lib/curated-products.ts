/**
 * Curated UNIKMO — Shopify product configuration.
 *
 * These are live products in the Unikmo Shopify store (created 2026-09).
 * Numeric variant IDs are used to build Shopify cart permalinks
 * (https://<domain>/cart/<variantId>:<qty>,...), which drop the buyer
 * straight into Shopify checkout.
 */

export const SHOPIFY_STORE_DOMAIN =
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, '').replace(/\/$/, '') ||
  'unikmo.myshopify.com';

export type CuratedExperienceKey = 'KEEP_IT' | 'SHOW_IT';
export type CuratedDeliveryKey = 'physical' | 'digital';

export const CURATED_PRODUCTS = {
  KEEP_IT: {
    key: 'KEEP_IT',
    label: 'Keep It — Curated',
    productId: '16567461937497',
    price: 199,
    variants: {
      physical: { id: '59289396805977', label: 'Physical UNIKMO card' },
      digital: { id: '59289396838745', label: 'Digital delivery' },
    },
  },
  SHOW_IT: {
    key: 'SHOW_IT',
    label: 'Show It — Times Square Edition',
    productId: '16567462461785',
    price: 399,
    variants: {
      physical: { id: '59289397395801', label: 'Physical UNIKMO card' },
      digital: { id: '59289397428569', label: 'Digital delivery' },
    },
  },
  EXTRA_KEEPSAKES: {
    key: 'EXTRA_KEEPSAKES',
    label: 'Extra Keepsake Card',
    productId: '16567463117145',
    pricePerCard: 12,
    variants: {
      standard: { id: '59289398477145', label: 'Extra keepsake card' },
    },
  },
} as const;

export interface CuratedCartItem {
  id: string;
  quantity: number;
}

/** Builds a Shopify cart permalink that lands the buyer in checkout. */
export function curatedCartUrl(items: CuratedCartItem[]): string {
  const cart = items
    .filter((item) => item.id && item.quantity > 0)
    .map((item) => `${item.id}:${item.quantity}`)
    .join(',');
  return `https://${SHOPIFY_STORE_DOMAIN}/cart/${cart}`;
}

/** Resolves the experience + delivery + extras selection to Shopify cart items. */
export function curatedCartItems(options: {
  experience: CuratedExperienceKey;
  delivery: CuratedDeliveryKey;
  extraKeepsakes?: number;
}): CuratedCartItem[] {
  const product = CURATED_PRODUCTS[options.experience];
  const variant = product.variants[options.delivery];
  const items: CuratedCartItem[] = [{ id: variant.id, quantity: 1 }];

  const extras = Math.max(0, Math.min(50, Math.floor(options.extraKeepsakes ?? 0)));
  if (extras > 0) {
    items.push({ id: CURATED_PRODUCTS.EXTRA_KEEPSAKES.variants.standard.id, quantity: extras });
  }
  return items;
}

export function curatedCheckoutUrl(options: {
  experience: CuratedExperienceKey;
  delivery: CuratedDeliveryKey;
  extraKeepsakes?: number;
}): string {
  return curatedCartUrl(curatedCartItems(options));
}

/** Direct "buy now" link for a single curated line item. */
export function curatedBuyUrl(variantId: string, quantity = 1): string {
  return curatedCartUrl([{ id: variantId, quantity }]);
}
