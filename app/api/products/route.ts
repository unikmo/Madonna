import { NextRequest, NextResponse } from 'next/server';
import { createShopifyClient } from '@/lib/shopify';
import { getShopifyCredentialsForAPI } from '@/lib/shopify';

export const dynamic = 'force-dynamic';

/**
 * GET - Fetch products from Shopify and store domain for checkout links
 */
export async function GET(request: NextRequest) {
  try {
    const productIds = [
      'gid://shopify/Product/16094803853657', // Single key
      'gid://shopify/Product/16094852219225', // 4 key
      'gid://shopify/Product/16094859526489', // 7 key
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
            variants(first: 1) {
              edges {
                node {
                  id
                  price
                }
              }
            }
          }
        }
      }
    `;

    const data = await shopifyClient.query(query, { ids: productIds });
    const shopCurrency = data?.shop?.currencyCode ?? null;

    const products = data?.nodes
      ?.filter((node: any) => node !== null)
      .map((node: any) => {
        const image = node.featuredImage || node.images?.edges?.[0]?.node;
        const variant = node.variants?.edges?.[0]?.node;
        const variantGid = variant?.id;
        const variantId = variantGid ? String(variantGid).split('/').pop() : null;
        const price = variant?.price != null ? String(variant.price) : null;
        return {
          id: node.id,
          title: node.title,
          handle: node.handle,
          image: image?.url || null,
          imageAlt: image?.altText || node.title,
          variantId,
          price,
          currencyCode: shopCurrency,
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
