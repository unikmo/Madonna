import { NextRequest, NextResponse } from 'next/server';
import { createShopifyClient } from '@/lib/shopify';
import { getShopifyCredentialsForAPI } from '@/lib/shopify';
import { getEffectiveShopifyTestMode } from '@/lib/shopify-test-mode';

export const dynamic = 'force-dynamic';

const fallbackProducts = [
  {
    id: 'single-fallback',
    title: 'Single Memory Card',
    handle: 'single-memory-card',
    image: '/cardfrontunikmo.jpg',
    imageAlt: 'UNIKMO single memory card',
    variantId: null,
    price: '24',
    currencyCode: 'USD',
    variants: [],
  },
  {
    id: 'four-fallback',
    title: '4 Memory Cards',
    handle: '4-memory-cards',
    image: '/cardfrontsite4.png',
    imageAlt: 'Four UNIKMO memory cards',
    variantId: null,
    price: '64',
    currencyCode: 'USD',
    variants: [],
  },
  {
    id: 'seven-fallback',
    title: '7 Memory Cards',
    handle: '7-memory-cards',
    image: '/cardfrontsite7.png',
    imageAlt: 'Seven UNIKMO memory cards',
    variantId: null,
    price: '72',
    currencyCode: 'USD',
    variants: [],
  },
];

/**
 * GET - Fetch products from Shopify and store domain for checkout links.
 * If Shopify is unavailable in a preview, retain the same real UNIKMO
 * product photography already used by the homepage.
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

    return NextResponse.json({ products: products.length ? products : fallbackProducts, storeDomain });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ products: fallbackProducts, storeDomain: '' });
  }
}
