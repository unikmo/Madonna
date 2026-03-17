import { NextRequest, NextResponse } from 'next/server';
import { createShopifyClient } from '@/lib/shopify';
import { getShopifyCredentialsForAPI } from '@/lib/shopify';
import { getEffectiveShopifyTestMode } from '@/lib/shopify-test-mode';

export const dynamic = 'force-dynamic';

/**
 * GET - Fetch products from Shopify and store domain for checkout links
 */
export async function GET(request: NextRequest) {
  try {
    const isTestMode = await getEffectiveShopifyTestMode();
    const productIds = isTestMode
      ? [
          'gid://shopify/Product/8326274121914', // Single key (test)
          'gid://shopify/Product/8326277005498', // 4 key (test)
          'gid://shopify/Product/8326277234874', // 7 key (test)
        ]
      : [
          'gid://shopify/Product/16094803853657', // Single key (live)
          'gid://shopify/Product/16094852219225', // 4 key (live)
          'gid://shopify/Product/16094859526489', // 7 key (live)
        ];

    const shopifyClient = await createShopifyClient();
    const credentials = await getShopifyCredentialsForAPI();
    const storeDomain = credentials.storeDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');

    const query = `
      query getProducts($ids: [ID!]!) {
        shop {
          currencyCode
        }
        nodes(ids: $ids) {
          ... on Product {
            id
            title
            handle
            featuredImage {
              url
              altText
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price
                }
              }
            }
          }
        }
      }
    `;

    const data = await shopifyClient.query(query, { ids: productIds });
    let shopCurrency = data?.shop?.currencyCode ?? null;
    if (process.env.CURRENCY_OVERRIDE) {
      shopCurrency = process.env.CURRENCY_OVERRIDE.toUpperCase();
    }

    const products = data?.nodes
      ?.filter((node: any) => node !== null)
      .map((node: any) => {
        const image = node.featuredImage || node.images?.edges?.[0]?.node;
        const variantsEdges = node.variants?.edges || [];
        const variants =
          variantsEdges.map((edge: any) => {
            const v = edge?.node;
            const gid = v?.id;
            const id = gid ? String(gid).split('/').pop() : null;
            const price = v?.price != null ? String(v.price) : null;
            return {
              id,
              title: v?.title || '',
              price,
            };
          }) || [];

        const defaultVariant = variants[0] || null;
        const variantId = defaultVariant?.id || null;
        const price = defaultVariant?.price || null;

        return {
          id: node.id,
          title: node.title,
          handle: node.handle,
          image: image?.url || null,
          imageAlt: image?.altText || node.title,
          variantId,
          price,
          currencyCode: shopCurrency,
          variants,
        };
      }) || [];

    return NextResponse.json({ products, storeDomain });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', message: error.message },
      { status: 500 }
    );
  }
}
