import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { createShopifyClient, getShopifyCredentialsForAPI } from '@/lib/shopify';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.roles || !payload.roles.includes('admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await getShopifyCredentialsForAPI();
    const webhookBaseUrl = (process.env.BASE_URL || '').replace(/\/$/, '');

    if (!webhookBaseUrl) {
      return NextResponse.json(
        { error: 'BASE_URL is not configured.' },
        { status: 400 }
      );
    }

    let callbackUrl = '';
    try {
      const parsed = new URL(webhookBaseUrl);
      if (parsed.protocol !== 'https:') {
        return NextResponse.json(
          { error: 'BASE_URL must use https in production', callbackBaseUrl: webhookBaseUrl },
          { status: 400 }
        );
      }
      callbackUrl = `${parsed.origin}/api/webhooks/shopify/orders-paid`;
    } catch {
      return NextResponse.json(
        { error: 'Invalid webhook base URL', callbackBaseUrl: webhookBaseUrl },
        { status: 400 }
      );
    }
    const topic = 'ORDERS_PAID';

    const client = await createShopifyClient();

    const existingWebhooks = await client.listWebhookSubscriptions();

    const existingWebhook = existingWebhooks.find(
      (wh: any) =>
        wh.callbackUrl === callbackUrl &&
        (wh.topic === topic || wh.topic === 'orders/paid' || wh.topic?.toUpperCase() === topic)
    );

    const existingWebhookWithUrl = existingWebhooks.find(
      (wh: any) => wh.callbackUrl === callbackUrl
    );

    if (existingWebhook) {
      return NextResponse.json({
        success: true,
        alreadySubscribed: true,
        message: 'Webhook already exists for this callback URL and topic.',
        webhook: existingWebhook,
      });
    }

    if (existingWebhookWithUrl && existingWebhookWithUrl.id) {
      try {
        await client.deleteWebhookSubscription(existingWebhookWithUrl.id);
      } catch (deleteError: any) {
        // Continue even if delete fails; Shopify may still allow new subscription
        console.warn('Failed to delete existing webhook before re-subscribing:', deleteError);
      }
    }

    try {
      const result = await client.createWebhookSubscription(topic, callbackUrl);

      if (result.webhookSubscriptionCreate?.userErrors?.length > 0) {
        const errors = result.webhookSubscriptionCreate.userErrors;

        const addressTakenError = errors.find(
          (e: any) =>
            e.message?.toLowerCase().includes('already been taken') ||
            e.message?.toLowerCase().includes('address for this topic')
        );

        if (addressTakenError) {
          return NextResponse.json({
            success: true,
            alreadySubscribed: true,
            message: 'Webhook already exists for this callback URL and topic.',
          });
        }

        return NextResponse.json({
          error: 'Shopify API errors',
          details: errors,
          callbackUrl,
          hint:
            'Shopify rejected this callback domain. Use a different public domain (not blocked by Shopify) and set SHOPIFY_WEBHOOK_BASE_URL to it.',
        }, { status: 400 });
      }

      const webhook = result.webhookSubscriptionCreate?.webhookSubscription;
      if (!webhook) {
        return NextResponse.json(
          { error: 'Failed to create webhook subscription' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        alreadySubscribed: false,
        callbackUrl,
        webhook,
      });
    } catch (error: any) {
      if (
        error.message?.toLowerCase().includes('already been taken') ||
        error.message?.toLowerCase().includes('address for this topic')
      ) {
        return NextResponse.json({
          success: true,
          alreadySubscribed: true,
          message: 'Webhook already exists for this callback URL and topic.',
        });
      }

      throw error;
    }
  } catch (error: any) {
    console.error('Error subscribing Shopify webhook via admin API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to subscribe webhook' },
      { status: 500 }
    );
  }
}

