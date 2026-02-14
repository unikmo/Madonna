import { NextRequest, NextResponse } from 'next/server';
import { createShopifyClient, getShopifyCredentialsForAPI } from '@/lib/shopify';

export async function POST(request: NextRequest) {
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
        { status: 400 }
      );
    }

    // Test connection
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
        { status: 400 }
      );
    }
    const callbackUrl = `${baseUrl}/api/webhooks/shopify/orders-paid`;
    const topic = 'ORDERS_PAID';

    // Check if webhook already exists
    const existingWebhooks = await shopifyClient.listWebhookSubscriptions();
    
    // Find any existing webhook with the same callback URL (regardless of topic)
    const existingWebhookWithUrl = existingWebhooks.find(
      (wh: any) => wh.callbackUrl === callbackUrl
    );

    // Find webhook with correct topic
    const existingWebhook = existingWebhooks.find(
      (wh: any) =>
        wh.callbackUrl === callbackUrl &&
        (wh.topic === 'ORDERS_PAID' || wh.topic === 'orders/paid' || wh.topic?.toUpperCase() === 'ORDERS_PAID')
    );

    // If exact match exists, return success
    if (existingWebhook) {
      return NextResponse.json({
        connected: true,
        webhookSubscribed: true,
        webhookUrl: callbackUrl,
      });
    }

    // If webhook exists with same URL but different topic, delete it first
    if (existingWebhookWithUrl && existingWebhookWithUrl.id) {
      try {
        await shopifyClient.deleteWebhookSubscription(existingWebhookWithUrl.id);
        // Wait a moment for deletion to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (deleteError: any) {
        console.error('Failed to delete existing webhook:', deleteError);
        // Continue anyway - might still work
      }
    }

    // Create new webhook subscription
    try {
      const result = await shopifyClient.createWebhookSubscription(topic, callbackUrl);

      if (result.webhookSubscriptionCreate?.userErrors?.length > 0) {
        const errors = result.webhookSubscriptionCreate.userErrors;
        
        // Check if error is about address already taken
        const addressTakenError = errors.find((e: any) => 
          e.message?.toLowerCase().includes('already been taken') ||
          e.message?.toLowerCase().includes('address for this topic')
        );

        if (addressTakenError) {
          // Webhook might exist but wasn't found in list - treat as success
          return NextResponse.json({
            connected: true,
            webhookSubscribed: true,
            webhookUrl: callbackUrl,
          });
        }

        return NextResponse.json(
          {
            connected: true,
            webhookSubscribed: false,
            error: `Webhook subscription failed: ${JSON.stringify(errors)}`,
          },
          { status: 200 }
        );
      }

      return NextResponse.json({
        connected: true,
        webhookSubscribed: true,
        webhookUrl: callbackUrl,
      });
    } catch (error: any) {
      // Check if error is about address already taken
      if (error.message?.toLowerCase().includes('already been taken') ||
          error.message?.toLowerCase().includes('address for this topic')) {
        // Webhook exists - treat as success
        return NextResponse.json({
          connected: true,
          webhookSubscribed: true,
          webhookUrl: callbackUrl,
        });
      }

      return NextResponse.json(
        {
          connected: true,
          webhookSubscribed: false,
          error: `Failed to subscribe webhook: ${error.message}`,
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        connected: false,
        webhookSubscribed: false,
        error: error.message || 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
