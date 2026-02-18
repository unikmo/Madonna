import crypto from 'crypto';
import { getShopifyCredentials } from './shopify-credentials';

/**
 * Validates Shopify webhook HMAC signature
 * @param rawBody - The raw request body as string
 * @param signature - The X-Shopify-Hmac-Sha256 header value
 * @param secret - The webhook secret (optional, will try to get from DB/env if not provided)
 * @returns true if signature is valid
 */
export async function validateShopifyHMAC(
  rawBody: string,
  signature: string | null,
  secret?: string
): Promise<boolean> {
  // If secret not provided, try to get from DB/env
  if (!secret) {
    try {
      const credentials = await getShopifyCredentials();
      secret = credentials.webhookSecret;
    } catch (error) {
      console.error('Failed to get webhook secret:', error);
      return false;
    }
  }
  if (!signature) {
    return false;
  }

  try {
    // Shopify webhook secret can be provided as hex string (64 chars = 32 bytes)
    // or as a regular string. We'll use it directly as the HMAC key.
    // The secret from Shopify is typically a hex string, but HMAC accepts it as-is
    
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(rawBody, 'utf8');
    const calculatedSignature = hmac.digest('base64');

    // Both should be base64 strings
    const receivedSig = signature.trim();
    const calculatedSig = calculatedSignature.trim();

    // Debug: Log first few chars for comparison (remove in production)
    console.log('HMAC Debug:', {
      receivedSigStart: receivedSig.substring(0, 20),
      calculatedSigStart: calculatedSig.substring(0, 20),
      receivedLength: receivedSig.length,
      calculatedLength: calculatedSig.length,
      secretLength: secret.length,
    });

    // Use timing-safe comparison
    if (receivedSig.length !== calculatedSig.length) {
      console.error('Signature length mismatch:', {
        received: receivedSig.length,
        calculated: calculatedSig.length,
      });
      return false;
    }

    // Both signatures are base64 strings, compare them directly
    // Use base64 decoding for proper comparison
    try {
      const receivedBuffer = Buffer.from(receivedSig, 'base64');
      const calculatedBuffer = Buffer.from(calculatedSig, 'base64');
      
      if (receivedBuffer.length !== calculatedBuffer.length) {
        return false;
      }
      
      return crypto.timingSafeEqual(receivedBuffer, calculatedBuffer);
    } catch (error) {
      // If base64 decoding fails, try string comparison as fallback
      console.warn('Base64 decode failed, trying string comparison');
      return receivedSig === calculatedSig;
    }
  } catch (error: any) {
    console.error('HMAC validation error:', error);
    return false;
  }
}

/**
 * Gets Shopify credentials (from DB or env) for use in API calls
 * This is a helper that doesn't require a password (uses env fallback)
 */
export async function getShopifyCredentialsForAPI(): Promise<{
  storeDomain: string;
  accessToken: string;
  webhookSecret: string;
  baseUrl: string;
  apiVersion: string;
}> {
  try {
    // Try to get from DB first (without password - will fall back to env if encrypted)
    const credentials = await getShopifyCredentials();
    return {
      storeDomain: credentials.storeDomain,
      accessToken: credentials.accessToken,
      webhookSecret: credentials.webhookSecret,
      baseUrl: credentials.baseUrl,
      apiVersion: credentials.apiVersion,
    };
  } catch (error) {
    // Fall back to environment variables if DB credentials require password or don't exist
    const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
    const webhookSecret = process.env.SHOPIFY_WEBHOOK_SECRET;
    const baseUrl = process.env.BASE_URL || '';
    const apiVersion = process.env.SHOPIFY_API_VERSION || '2024-10';

    if (!storeDomain || !accessToken || !webhookSecret) {
      throw new Error('Shopify credentials not found in database or environment variables');
    }

    return {
      storeDomain,
      accessToken,
      webhookSecret,
      baseUrl,
      apiVersion,
    };
  }
}

/**
 * Creates a ShopifyGraphQLClient with credentials from DB or env
 */
export async function createShopifyClient(): Promise<ShopifyGraphQLClient> {
  const credentials = await getShopifyCredentialsForAPI();
  return new ShopifyGraphQLClient({
    storeDomain: credentials.storeDomain,
    accessToken: credentials.accessToken,
    apiVersion: credentials.apiVersion,
  });
}

/**
 * Shopify GraphQL API client
 */
export class ShopifyGraphQLClient {
  private storeDomain: string;
  private accessToken: string;
  private apiVersion: string;

  constructor(credentials?: {
    storeDomain: string;
    accessToken: string;
    apiVersion?: string;
  }) {
    if (credentials) {
      this.storeDomain = credentials.storeDomain;
      this.accessToken = credentials.accessToken;
      this.apiVersion = credentials.apiVersion || '2024-10';
    } else {
      // Fallback to env variables
      this.storeDomain = process.env.SHOPIFY_STORE_DOMAIN || '';
      this.accessToken = process.env.SHOPIFY_ACCESS_TOKEN || '';
      this.apiVersion = process.env.SHOPIFY_API_VERSION || '2024-10';
    }

    if (!this.storeDomain || !this.accessToken) {
      throw new Error('SHOPIFY_STORE_DOMAIN and SHOPIFY_ACCESS_TOKEN must be set');
    }
  }

  /**
   * Makes a GraphQL request to Shopify API
   */
  async query(query: string, variables?: Record<string, any>): Promise<any> {
    const url = `https://${this.storeDomain}/admin/api/${this.apiVersion}/graphql.json`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': this.accessToken,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Shopify API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(`Shopify GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    return data.data;
  }

  /**
   * Fetches variant metafields by variant ID
   */
  async getVariantMetafields(variantId: string): Promise<any[]> {
    const query = `
      query getVariantMetafields($id: ID!) {
        productVariant(id: $id) {
          id
          metafields(first: 20) {
            edges {
              node {
                key
                value
                namespace
                type
              }
            }
          }
        }
      }
    `;

    try {
      const data = await this.query(query, { id: variantId });
      return data?.productVariant?.metafields?.edges?.map((edge: any) => edge.node) || [];
    } catch (error) {
      console.error(`Error fetching metafields for variant ${variantId}:`, error);
      return [];
    }
  }

  /**
   * Fetches product metafields by product ID
   */
  async getProductMetafields(productId: string): Promise<any[]> {
    const query = `
      query getProductMetafields($id: ID!) {
        product(id: $id) {
          id
          metafields(first: 20) {
            edges {
              node {
                key
                value
                namespace
                type
              }
            }
          }
        }
      }
    `;

    try {
      const data = await this.query(query, { id: productId });
      return data?.product?.metafields?.edges?.map((edge: any) => edge.node) || [];
    } catch (error) {
      console.error(`Error fetching metafields for product ${productId}:`, error);
      return [];
    }
  }

  /**
   * Subscribes to a webhook
   */
  async createWebhookSubscription(topic: string, callbackUrl: string): Promise<any> {
    // Convert topic to Shopify's expected format
    // ORDERS_PAID or orders/paid both work, but we'll use the enum format
    let topicEnum = topic.toUpperCase();
    if (topicEnum.includes('/')) {
      topicEnum = topicEnum.replace(/\//g, '_');
    }

    const mutation = `
      mutation webhookSubscriptionCreate($topic: WebhookSubscriptionTopic!, $webhookSubscription: WebhookSubscriptionInput!) {
        webhookSubscriptionCreate(topic: $topic, webhookSubscription: $webhookSubscription) {
          webhookSubscription {
            id
            callbackUrl
            format
            topic
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      topic: topicEnum,
      webhookSubscription: {
        callbackUrl,
        format: 'JSON',
      },
    };

    return this.query(mutation, variables);
  }

  /**
   * Lists existing webhook subscriptions
   */
  async listWebhookSubscriptions(): Promise<any[]> {
    const query = `
      query {
        webhookSubscriptions(first: 50) {
          edges {
            node {
              id
              callbackUrl
              topic
            }
          }
        }
      }
    `;

    const data = await this.query(query);
    return data?.webhookSubscriptions?.edges?.map((edge: any) => edge.node) || [];
  }

  /**
   * Deletes a webhook subscription
   */
  async deleteWebhookSubscription(webhookId: string): Promise<any> {
    const mutation = `
      mutation webhookSubscriptionDelete($id: ID!) {
        webhookSubscriptionDelete(id: $id) {
          deletedWebhookSubscriptionId
          userErrors {
            field
            message
          }
        }
      }
    `;

    return this.query(mutation, { id: webhookId });
  }
}
