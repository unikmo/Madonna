import { createShopifyClient } from '@/lib/shopify';
import { getEffectiveShopifyTestMode } from '@/lib/shopify-test-mode';
import type { DeliveryType, Quantity } from '@/lib/code-generator';

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

function parseNumericId(gid: string): string {
  return gid.includes('/') ? gid.split('/').pop() || gid : gid;
}

/**
 * Resolves Shopify product + variant numeric IDs for moment quantity and delivery preference.
 */
export async function resolveMomentProductVariant(
  quantity: Quantity,
  deliveryType: DeliveryType
): Promise<{ productId: string; variantId: string } | null> {
  const isTest = await getEffectiveShopifyTestMode();
  const productGid = (isTest ? TEST_PRODUCTS : LIVE_PRODUCTS)[quantity];
  if (!productGid) return null;

  const client = await createShopifyClient();
  const query = `
    query ProductVariants($id: ID!) {
      node(id: $id) {
        ... on Product {
          id
          variants(first: 20) {
            edges {
              node {
                id
                title
              }
            }
          }
        }
      }
    }
  `;

  const data = await client.query(query, { id: productGid });
  const edges = data?.node?.variants?.edges || [];
  const variants = edges.map((e: any) => e?.node).filter(Boolean) as { id: string; title: string }[];

  const wantDigital = deliveryType === 'digital';
  const chosen =
    variants.find((v) => {
      const t = (v.title || '').toLowerCase();
      return wantDigital ? /digital/i.test(t) : /physical/i.test(t);
    }) || variants[0];

  if (!chosen?.id) return null;

  const productNodeId = data?.node?.id;
  if (!productNodeId) return null;

  return {
    productId: parseNumericId(productNodeId),
    variantId: parseNumericId(chosen.id),
  };
}
