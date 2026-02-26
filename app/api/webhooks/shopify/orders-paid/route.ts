import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Order from '@/models/Order';
import MomentCode from '@/models/MomentCode';
import { validateShopifyHMAC, createShopifyClient } from '@/lib/shopify';
import { ShopifyGraphQLClient } from '@/lib/shopify';
import { generateMomentCode, type Quantity, type DeliveryType } from '@/lib/code-generator';
import { sendMomentCodesEmail } from '@/lib/email';

// Disable body parsing, we need raw body for HMAC validation
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Extracts quantity from product metafields and deliveryType from variant metafields
 */
async function extractProductData(
  productId: string,
  variantId: string,
  shopifyClient: ShopifyGraphQLClient
): Promise<{ quantity: Quantity; deliveryType: DeliveryType } | null> {
  try {
    // Get product metafields for quantity
    const productMetafields = await shopifyClient.getProductMetafields(productId);
    
    // Get variant metafields for delivery type
    const variantMetafields = await shopifyClient.getVariantMetafields(variantId);

    let quantity: Quantity | null = null;
    let deliveryType: DeliveryType | null = null;

    // Extract quantity from product metafields
    // Look for custom.moment_quantity or similar
    for (const metafield of productMetafields) {
      const key = metafield.key?.toLowerCase() || '';
      const namespace = metafield.namespace?.toLowerCase() || '';
      const fullKey = `${namespace}.${key}`;
      const value = metafield.value?.toString() || '';

      // Check for moment_quantity or quantity in custom namespace
      if (
        fullKey.includes('moment_quantity') ||
        fullKey.includes('quantity') ||
        (namespace === 'custom' && key.includes('quantity'))
      ) {
        const qty = parseInt(value);
        if (qty === 1 || qty === 4 || qty === 7) {
          quantity = qty as Quantity;
          break;
        }
      }
    }

    // Extract deliveryType from variant metafields
    // Look for custom.delivery_type or similar
    for (const metafield of variantMetafields) {
      const key = metafield.key?.toLowerCase() || '';
      const namespace = metafield.namespace?.toLowerCase() || '';
      const fullKey = `${namespace}.${key}`;
      const value = metafield.value?.toString().toLowerCase() || '';

      // Check for delivery_type or delivery in custom namespace
      if (
        fullKey.includes('delivery_type') ||
        fullKey.includes('delivery') ||
        (namespace === 'custom' && (key.includes('delivery') || key.includes('type')))
      ) {
        if (value === 'digital' || value.includes('digital')) {
          deliveryType = 'digital';
        } else if (value === 'physical' || value.includes('physical')) {
          deliveryType = 'physical';
        } else if (value === 'split' || value.includes('split')) {
          deliveryType = 'split';
        }
        if (deliveryType) break;
      }
    }

    // Fallback: Try to extract from variant title if metafields not found
    if (!deliveryType) {
      // We'll need to fetch variant title - but for now, log warning
      console.warn(`Could not extract deliveryType from metafields for variant ${variantId}`);
    }

    if (!quantity) {
      console.warn(`Could not extract quantity from metafields for product ${productId}`);
      return null;
    }

    if (!deliveryType) {
      console.warn(`Could not extract deliveryType from metafields for variant ${variantId}`);
      return null;
    }

    return { quantity, deliveryType };
  } catch (error) {
    console.error('Error fetching metafields:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get raw body for HMAC validation
    // IMPORTANT: Must get body as text BEFORE any parsing
    const rawBody = await request.text();
    const signature = request.headers.get('x-shopify-hmac-sha256');

    // Debug logging (remove in production)
    console.log('Webhook received:');
    console.log('- Signature header present:', !!signature);
    console.log('- Body length:', rawBody.length);
    console.log('- Body preview (first 100 chars):', rawBody.substring(0, 100));
    console.log('- Signature preview:', signature?.substring(0, 30) + '...');

    if (!signature) {
      console.error('Missing X-Shopify-Hmac-Sha256 header');
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Missing HMAC signature header' },
        { status: 401 }
      );
    }

    // Validate HMAC (will get secret from DB or env)
    // TEMPORARY: bypass HMAC to test flow — remove this and use real validation in production
    const bypassHmac = process.env.BYPASS_SHOPIFY_WEBHOOK_HMAC === 'true';
    const isValid = bypassHmac || (await validateShopifyHMAC(rawBody, signature));
    if (bypassHmac) console.warn('[TEMPORARY] Shopify webhook HMAC validation bypassed (BYPASS_SHOPIFY_WEBHOOK_HMAC=true)');

    if (!isValid) {
      console.error('Invalid HMAC signature');
      console.error('- Received signature:', signature.substring(0, 20) + '...');
      console.error('- Make sure webhook secret in DB or SHOPIFY_WEBHOOK_SECRET matches the secret from Shopify webhook settings');
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    // Parse webhook payload
    const order = JSON.parse(rawBody);

    // Idempotency check - prevent duplicate processing
    await connectDB();
    const existingOrder = await Order.findOne({ shopifyOrderId: order.id.toString() });
    if (existingOrder) {
      console.log(`Order ${order.id} already processed, skipping`);
      return NextResponse.json({ message: 'Order already processed' }, { status: 200 });
    }

    // Extract order data
    const email = order.email?.toLowerCase().trim();
    if (!email) {
      return NextResponse.json({ error: 'Order email is required' }, { status: 400 });
    }

    // Create or find user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        roles: ['buyer'],
        shopifyCustomerId: order.customer?.id?.toString(),
      });
    } else if (order.customer?.id && !user.shopifyCustomerId) {
      user.shopifyCustomerId = order.customer.id.toString();
      await user.save();
    }

    // Process line items and extract product/variant data
    let shopifyClient: ShopifyGraphQLClient;
    try {
      shopifyClient = await createShopifyClient();
    } catch (error: any) {
      console.error('Failed to initialize Shopify client:', error);
      return NextResponse.json(
        { error: 'Shopify configuration error', message: error.message },
        { status: 500 }
      );
    }

    const lineItems = order.line_items || [];
    const codesToGenerate: Array<{ quantity: Quantity; deliveryType: DeliveryType; orderQuantity: number }> = [];

    // Process each line item
    for (const lineItem of lineItems) {
      if (!lineItem.variant_id || !lineItem.product_id) {
        console.warn(`Skipping line item ${lineItem.id} - missing variant_id or product_id`);
        continue;
      }

      try {
        // Shopify GraphQL uses GID format
        const productId = `gid://shopify/Product/${lineItem.product_id}`;
        const variantId = `gid://shopify/ProductVariant/${lineItem.variant_id}`;
        
        // Extract quantity from product and deliveryType from variant
        const productData = await extractProductData(productId, variantId, shopifyClient);
        if (!productData) {
          console.warn(`Skipping line item ${lineItem.id} - could not extract product/variant data`);
          continue;
        }

        // For each unit in the order quantity, we need to generate codes
        // Example: If order quantity = 2 and product quantity = 4, we generate 2 sets of 4 codes = 8 codes total
        const orderQuantity = lineItem.quantity || 1;
        const momentQuantity = productData.quantity; // 1, 4, or 7 from product metafield

        // Generate codes: orderQuantity * momentQuantity
        // Example: Order 2x "4-Key Bundle" = 2 * 4 = 8 codes
        for (let i = 0; i < orderQuantity; i++) {
          codesToGenerate.push({
            quantity: momentQuantity,
            deliveryType: productData.deliveryType,
            orderQuantity: 1, // Each code represents one "moment"
          });
        }
      } catch (error: any) {
        console.error(`Error processing line item ${lineItem.id}:`, error);
        // Continue processing other line items
        continue;
      }
    }

    // Calculate total order quantity
    const totalQuantity = lineItems.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
    const firstProductId = lineItems[0]?.product_id?.toString() || '';

    // Create order record
    const orderRecord = await Order.create({
      shopifyOrderId: order.id.toString(),
      shopifyProductId: firstProductId,
      orderQuantity: totalQuantity,
      user: user._id,
      email,
      totalPrice: parseFloat(order.total_price || '0'),
      currency: order.currency || 'USD',
      paymentStatus: 'paid',
      lineItems: lineItems.map((item: any) => ({
        productId: item.product_id?.toString() || '',
        variantId: item.variant_id?.toString() || '',
        quantity: item.quantity || 0,
      })),
    });

    // Generate Moment Codes
    // Each code represents one "moment" - if quantity=4, we generate 4 codes
    const generatedCodes: string[] = [];
    const momentCodes = [];

    if (codesToGenerate.length === 0) {
      console.warn(`No valid products/variants found for order ${order.id}`);
      return NextResponse.json(
        {
          error: 'No valid products/variants found',
          message: 'Could not extract product/variant data from order line items. Make sure metafields are set up correctly.',
        },
        { status: 400 }
      );
    }

    // Generate codes for each item
    for (const item of codesToGenerate) {
      // Generate N codes where N = quantity (1, 4, or 7)
      for (let i = 0; i < item.quantity; i++) {
        try {
          let code: string;
          let attempts = 0;
          const maxAttempts = 10;

          // Ensure code uniqueness
          do {
            code = generateMomentCode(item.quantity, item.deliveryType);
            attempts++;
            if (attempts >= maxAttempts) {
              throw new Error('Failed to generate unique code after multiple attempts');
            }
          } while (await MomentCode.findOne({ code }));

          const momentCode = await MomentCode.create({
            code,
            user: user._id,
            order: orderRecord._id,
            quantity: item.quantity,
            deliveryType: item.deliveryType,
            status: 'new',
          });

          generatedCodes.push(code);
          momentCodes.push(momentCode);
        } catch (error: any) {
          console.error(`Error generating code:`, error);
          // Continue with other codes
          continue;
        }
      }
    }

    if (generatedCodes.length === 0) {
      return NextResponse.json(
        {
          error: 'Code generation failed',
          message: 'Failed to generate any Moment Codes',
        },
        { status: 500 }
      );
    }

    // Send email to buyer with codes
    if (generatedCodes.length > 0) {
      try {
        await sendMomentCodesEmail(email, generatedCodes, order.order_number || order.id.toString());
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Don't fail the webhook if email fails
      }
    }

    return NextResponse.json({
      message: 'Order processed successfully',
      codesGenerated: generatedCodes.length,
    });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
