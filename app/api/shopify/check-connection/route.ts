import { NextRequest, NextResponse } from 'next/server';
import { createShopifyClient, getShopifyCredentialsForAPI } from '@/lib/shopify';

export async function GET(request: NextRequest) {
  try {
    let shopifyClient;
    try {
      shopifyClient = await createShopifyClient();
    } catch (error: any) {
      return NextResponse.json(
        {
          connected: false,
          webhookSubscribed: false,
          error: 'Shopify credentials are not configured',
        },
        { status: 200 }
      );
    }

    // Test connection with a simple query
    const testQuery = `
      query {
        shop {
          name
          email
        }
      }
    `;

    try {
      await shopifyClient.query(testQuery);
    } catch (error: any) {
      return NextResponse.json(
        {
          connected: false,
          webhookSubscribed: false,
          error: `Connection failed: ${error.message}`,
        },
        { status: 200 }
      );
    }

    // Get baseUrl from credentials (DB or env)
    let baseUrl: string;
    try {
      const credentials = await getShopifyCredentialsForAPI();
      baseUrl = (credentials.baseUrl || process.env.BASE_URL || '').replace(/\/$/, '');
    } catch {
      baseUrl = (process.env.BASE_URL || '').replace(/\/$/, '');
    }

    if (!baseUrl) {
      return NextResponse.json(
        {
          connected: true,
          webhookSubscribed: false,
          error: 'BASE_URL is not configured',
        },
        { status: 200 }
      );
    }
    const expectedWebhookUrl = `${baseUrl}/api/webhooks/shopify/orders-paid`;
    const webhooks = await shopifyClient.listWebhookSubscriptions();

    const webhookSubscribed = webhooks.some(
      (wh: any) =>
        wh.callbackUrl === expectedWebhookUrl &&
        (wh.topic === 'ORDERS_PAID' || wh.topic === 'orders/paid' || wh.topic?.toUpperCase() === 'ORDERS_PAID')
    );

    return NextResponse.json({
      connected: true,
      webhookSubscribed,
      webhookUrl: webhookSubscribed
        ? expectedWebhookUrl
        : undefined,
      error: webhookSubscribed ? undefined : 'Webhook not subscribed',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        connected: false,
        webhookSubscribed: false,
        error: error.message || 'Unknown error occurred',
      },
      { status: 200 }
    );
  }
}
