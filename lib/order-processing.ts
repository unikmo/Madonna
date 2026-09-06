import User from '@/models/User';
import Order from '@/models/Order';
import MomentCode from '@/models/MomentCode';
import { generateMomentCode, type DeliveryType, type Quantity } from '@/lib/code-generator';
import { sendMomentCodesEmail } from '@/lib/email';
import type { ShopifyGraphQLClient } from '@/lib/shopify';

export interface ShopifyLineItemLike {
  id?: string | number;
  product_id?: string | number;
  variant_id?: string | number;
  quantity?: number;
}

export interface CodesToGenerateItem {
  quantity: Quantity;
  deliveryType: DeliveryType;
  orderQuantity: number;
}

export interface ProcessOrderInput {
  shopifyOrderId: string;
  shopifyOrderNumber: string;
  email: string;
  shopifyCustomerId?: string;
  totalPrice: number;
  currency: string;
  lineItems: ShopifyLineItemLike[];
  codesToGenerate: CodesToGenerateItem[];
  source?: 'webhook' | 'admin';
  tags?: string[];
  shopifyOrderName?: string;
  customerName?: string;
}

export interface StripePaidOrderInput {
  checkoutSessionId: string;
  paymentIntentId?: string;
  email: string;
  totalPrice: number;
  currency: string;
  productCode: 'single' | 'four' | 'seven';
  quantity: Quantity;
  customerName?: string;
  shippingAddress?: {
    name?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

function normalizeShopifyId(id: string | number | undefined): string {
  return id != null ? String(id) : '';
}

async function generateCodesForOrder({
  userId,
  orderId,
  quantity,
  deliveryType,
}: {
  userId: any;
  orderId: any;
  quantity: Quantity;
  deliveryType: DeliveryType;
}): Promise<string[]> {
  const generatedCodes: string[] = [];

  for (let i = 0; i < quantity; i++) {
    try {
      let code = '';
      let attempts = 0;
      const maxAttempts = 10;
      do {
        code = generateMomentCode(quantity, deliveryType);
        attempts += 1;
        if (attempts >= maxAttempts) {
          throw new Error('Failed to generate unique code after multiple attempts');
        }
      } while (await MomentCode.findOne({ code }));

      await MomentCode.create({
        code,
        user: userId,
        order: orderId,
        quantity,
        deliveryType,
        status: 'new',
      });
      generatedCodes.push(code);
    } catch (error) {
      console.error('Error generating code:', error);
    }
  }

  return generatedCodes;
}

/**
 * Extracts quantity from product metafields and deliveryType from variant metafields.
 */
export async function extractProductData(
  productId: string,
  variantId: string,
  shopifyClient: ShopifyGraphQLClient
): Promise<{ quantity: Quantity; deliveryType: DeliveryType } | null> {
  try {
    const productMetafields = await shopifyClient.getProductMetafields(productId);
    const variantMetafields = await shopifyClient.getVariantMetafields(variantId);

    let quantity: Quantity | null = null;
    let deliveryType: DeliveryType | null = null;

    for (const metafield of productMetafields) {
      const key = metafield.key?.toLowerCase() || '';
      const namespace = metafield.namespace?.toLowerCase() || '';
      const fullKey = `${namespace}.${key}`;
      const value = metafield.value?.toString() || '';

      if (
        fullKey.includes('moment_quantity') ||
        fullKey.includes('quantity') ||
        (namespace === 'custom' && key.includes('quantity'))
      ) {
        const qty = parseInt(value, 10);
        if (qty === 1 || qty === 4 || qty === 7) {
          quantity = qty as Quantity;
          break;
        }
      }
    }

    for (const metafield of variantMetafields) {
      const key = metafield.key?.toLowerCase() || '';
      const namespace = metafield.namespace?.toLowerCase() || '';
      const fullKey = `${namespace}.${key}`;
      const value = metafield.value?.toString().toLowerCase() || '';

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

    if (!quantity || !deliveryType) {
      return null;
    }

    return { quantity, deliveryType };
  } catch (error) {
    console.error('Error fetching metafields:', error);
    return null;
  }
}

export async function deriveCodesToGenerateFromLineItems(
  lineItems: ShopifyLineItemLike[],
  shopifyClient: ShopifyGraphQLClient
): Promise<CodesToGenerateItem[]> {
  const codesToGenerate: CodesToGenerateItem[] = [];

  for (const lineItem of lineItems) {
    if (!lineItem.variant_id || !lineItem.product_id) {
      continue;
    }

    try {
      const productId = `gid://shopify/Product/${lineItem.product_id}`;
      const variantId = `gid://shopify/ProductVariant/${lineItem.variant_id}`;
      const productData = await extractProductData(productId, variantId, shopifyClient);

      if (!productData) continue;

      const orderQuantity = lineItem.quantity || 1;
      for (let i = 0; i < orderQuantity; i++) {
        codesToGenerate.push({
          quantity: productData.quantity,
          deliveryType: productData.deliveryType,
          orderQuantity: 1,
        });
      }
    } catch (error) {
      console.error(`Error processing line item ${lineItem.id}:`, error);
    }
  }

  return codesToGenerate;
}

export async function processPaidOrderAndGenerateCodes(input: ProcessOrderInput): Promise<{
  created: boolean;
  orderId: string;
  generatedCodes: string[];
}> {
  const normalizedEmail = input.email.toLowerCase().trim();
  const existingOrder = await Order.findOne({ shopifyOrderId: input.shopifyOrderId });
  if (existingOrder) {
    return {
      created: false,
      orderId: existingOrder._id.toString(),
      generatedCodes: [],
    };
  }

  let user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    user = await User.create({
      email: normalizedEmail,
      roles: ['buyer'],
      shopifyCustomerId: input.shopifyCustomerId,
    });
  } else if (input.shopifyCustomerId && !user.shopifyCustomerId) {
    user.shopifyCustomerId = input.shopifyCustomerId;
    await user.save();
  }

  const totalQuantity = input.lineItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const firstProductId = normalizeShopifyId(input.lineItems[0]?.product_id);

  const orderRecord = await Order.create({
    paymentProvider: 'shopify',
    paymentReference: `shopify:${input.shopifyOrderId}`,
    shopifyOrderId: input.shopifyOrderId,
    shopifyOrderName: input.shopifyOrderName || input.shopifyOrderNumber,
    shopifyProductId: firstProductId,
    orderQuantity: totalQuantity,
    user: user._id,
    email: normalizedEmail,
    customerName: input.customerName || '',
    totalPrice: input.totalPrice,
    currency: input.currency || 'USD',
    paymentStatus: 'paid',
    source: input.source || 'webhook',
    tags: input.tags || [],
    lineItems: input.lineItems.map((item) => ({
      productId: normalizeShopifyId(item.product_id),
      variantId: normalizeShopifyId(item.variant_id),
      quantity: item.quantity || 0,
    })),
  });

  const generatedCodes: string[] = [];
  for (const item of input.codesToGenerate) {
    const codes = await generateCodesForOrder({
      userId: user._id,
      orderId: orderRecord._id,
      quantity: item.quantity,
      deliveryType: item.deliveryType,
    });
    generatedCodes.push(...codes);
  }

  if (generatedCodes.length > 0) {
    try {
      await sendMomentCodesEmail(normalizedEmail, generatedCodes, input.shopifyOrderNumber);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
    }
  }

  return {
    created: true,
    orderId: orderRecord._id.toString(),
    generatedCodes,
  };
}

export async function processStripePaidOrder(input: StripePaidOrderInput): Promise<{
  created: boolean;
  orderId: string;
  generatedCodes: string[];
}> {
  const normalizedEmail = input.email.toLowerCase().trim();
  const paymentReference = `stripe:${input.checkoutSessionId}`;
  const existingOrder = await Order.findOne({ paymentReference });
  if (existingOrder) {
    return {
      created: false,
      orderId: existingOrder._id.toString(),
      generatedCodes: [],
    };
  }

  let user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    user = await User.create({
      email: normalizedEmail,
      roles: ['buyer'],
    });
  }

  const orderRecord = await Order.create({
    paymentProvider: 'stripe',
    paymentReference,
    productCode: input.productCode,
    orderQuantity: input.quantity,
    user: user._id,
    email: normalizedEmail,
    customerName: input.customerName || input.shippingAddress?.name || '',
    shippingAddress: input.shippingAddress || undefined,
    totalPrice: input.totalPrice,
    currency: input.currency || 'USD',
    paymentStatus: 'paid',
    source: 'stripe',
    tags: ['stripe-test'],
    lineItems: [
      {
        productId: input.productCode,
        variantId: input.paymentIntentId || input.checkoutSessionId,
        quantity: input.quantity,
      },
    ],
  });

  const generatedCodes = await generateCodesForOrder({
    userId: user._id,
    orderId: orderRecord._id,
    quantity: input.quantity,
    deliveryType: 'physical',
  });

  if (generatedCodes.length > 0) {
    try {
      await sendMomentCodesEmail(normalizedEmail, generatedCodes, input.checkoutSessionId);
    } catch (emailError) {
      console.error('Failed to send Stripe order email:', emailError);
    }
  }

  return {
    created: true,
    orderId: orderRecord._id.toString(),
    generatedCodes,
  };
}
