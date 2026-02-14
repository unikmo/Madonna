/**
 * Shopify Webhook Subscription Script
 * 
 * This script subscribes to the orders/paid webhook using Shopify GraphQL API.
 * Run with: npm run sub:shopify:hook
 */

import { ShopifyGraphQLClient } from '../lib/shopify';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function subscribeWebhook() {
  try {
    // Validate required environment variables
    const requiredVars = [
      'SHOPIFY_STORE_DOMAIN',
      'SHOPIFY_ACCESS_TOKEN',
      'BASE_URL',
    ];

    for (const varName of requiredVars) {
      if (!process.env[varName]) {
        throw new Error(`Missing required environment variable: ${varName}`);
      }
    }

    const baseUrl = process.env.BASE_URL!.replace(/\/$/, ''); // Remove trailing slash
    const callbackUrl = `${baseUrl}/api/webhooks/shopify/orders-paid`;
    const topic = 'ORDERS_PAID';

    console.log('🔗 Connecting to Shopify...');
    const client = new ShopifyGraphQLClient();

    // Check existing webhooks
    console.log('📋 Checking existing webhooks...');
    const existingWebhooks = await client.listWebhookSubscriptions();
    
    // Find webhook with exact match
    const existingWebhook = existingWebhooks.find(
      (wh: any) =>
        wh.callbackUrl === callbackUrl &&
        (wh.topic === topic || wh.topic === 'orders/paid' || wh.topic?.toUpperCase() === topic)
    );

    // Find any webhook with same URL (might be different topic)
    const existingWebhookWithUrl = existingWebhooks.find(
      (wh: any) => wh.callbackUrl === callbackUrl
    );

    if (existingWebhook) {
      console.log(`✅ Webhook already exists: ${existingWebhook.id}`);
      console.log(`   Callback URL: ${existingWebhook.callbackUrl}`);
      console.log(`   Topic: ${existingWebhook.topic}`);
      return;
    }

    // If webhook exists with same URL but different topic, delete it first
    if (existingWebhookWithUrl && existingWebhookWithUrl.id) {
      console.log(`🔄 Found existing webhook with different topic, deleting...`);
      try {
        await client.deleteWebhookSubscription(existingWebhookWithUrl.id);
        console.log(`✅ Deleted existing webhook: ${existingWebhookWithUrl.id}`);
        // Wait a moment for deletion to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (deleteError: any) {
        console.warn(`⚠️  Failed to delete existing webhook: ${deleteError.message}`);
        // Continue anyway
      }
    }

    // Create new webhook subscription
    console.log(`📝 Creating webhook subscription...`);
    console.log(`   Topic: ${topic}`);
    console.log(`   Callback URL: ${callbackUrl}`);

    try {
      const result = await client.createWebhookSubscription(topic, callbackUrl);

      if (result.webhookSubscriptionCreate?.userErrors?.length > 0) {
        const errors = result.webhookSubscriptionCreate.userErrors;
        
        // Check if error is about address already taken
        const addressTakenError = errors.find((e: any) => 
          e.message?.toLowerCase().includes('already been taken') ||
          e.message?.toLowerCase().includes('address for this topic')
        );

        if (addressTakenError) {
          console.log('✅ Webhook already exists (detected via error message)');
          console.log(`   Callback URL: ${callbackUrl}`);
          return;
        }

        throw new Error(`Shopify API errors: ${JSON.stringify(errors)}`);
      }

      const webhook = result.webhookSubscriptionCreate?.webhookSubscription;
      if (webhook) {
        console.log('✅ Webhook subscription created successfully!');
        console.log(`   ID: ${webhook.id}`);
        console.log(`   Callback URL: ${webhook.callbackUrl}`);
        console.log(`   Format: ${webhook.format}`);
      } else {
        throw new Error('Failed to create webhook subscription');
      }
    } catch (error: any) {
      // Check if error is about address already taken
      if (error.message?.toLowerCase().includes('already been taken') ||
          error.message?.toLowerCase().includes('address for this topic')) {
        console.log('✅ Webhook already exists (detected via error message)');
        console.log(`   Callback URL: ${callbackUrl}`);
        return;
      }
      throw error;
    }
  } catch (error: any) {
    console.error('❌ Error subscribing webhook:', error.message);
    process.exit(1);
  }
}

// Run the script
subscribeWebhook()
  .then(() => {
    console.log('✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
