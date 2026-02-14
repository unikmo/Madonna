/**
 * Shopify Connection Checker
 * Validates Shopify credentials and webhook subscription status
 * Client-side functions that call API endpoints
 */

export interface ShopifyConnectionStatus {
  connected: boolean;
  webhookSubscribed: boolean;
  error?: string;
  webhookUrl?: string;
}

export async function checkShopifyConnection(): Promise<ShopifyConnectionStatus> {
  try {
    // Test connection by making a simple GraphQL query
    const response = await fetch('/api/shopify/check-connection', {
      method: 'GET',
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return {
        connected: false,
        webhookSubscribed: false,
        error: data.error || 'Failed to connect to Shopify',
      };
    }

    const data = await response.json();
    return {
      connected: data.connected || false,
      webhookSubscribed: data.webhookSubscribed || false,
      webhookUrl: data.webhookUrl,
      error: data.error,
    };
  } catch (error: any) {
    return {
      connected: false,
      webhookSubscribed: false,
      error: error.message || 'Unknown error occurred',
    };
  }
}

export async function reconnectShopify(): Promise<ShopifyConnectionStatus> {
  try {
    const response = await fetch('/api/shopify/reconnect', {
      method: 'POST',
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        connected: false,
        webhookSubscribed: false,
        error: data.error || 'Failed to reconnect',
      };
    }

    const data = await response.json();
    return {
      connected: data.connected || false,
      webhookSubscribed: data.webhookSubscribed || false,
      webhookUrl: data.webhookUrl,
      error: data.error,
    };
  } catch (error: any) {
    return {
      connected: false,
      webhookSubscribed: false,
      error: error.message || 'Unknown error occurred',
    };
  }
}
