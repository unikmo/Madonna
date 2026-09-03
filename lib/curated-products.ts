/**
 * Curated UNIKMO Shopify Product Configuration
 * Product IDs and pricing for the curated service offerings
 *
 * IMPORTANT: Update these IDs after creating products in Shopify
 */

export interface CuratedProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  basePrice: number;
  variants: Array<{
    title: string;
    variantId: string;
    price: number;
  }>;
}

// TODO: Replace these IDs with real Shopify product IDs after creation
// Format: gid://shopify/Product/XXXXXXXXXX

export const CURATED_PRODUCTS = {
  // Keep It - Curated
  KEEP_IT: {
    title: 'Curated UNIKMO - Keep It',
    slug: 'curated-keep-it',
    description: 'Professional curation and editing of your selected moments into one finished UNIKMO memory.',
    testModeId: 'gid://shopify/Product/KEEP_IT_TEST_ID', // TODO: Update
    productionId: 'gid://shopify/Product/KEEP_IT_PROD_ID', // TODO: Update
    variants: {
      physical: {
        title: 'Physical UNIKMO Card',
        testModeVariantId: 'gid://shopify/ProductVariant/KEEP_IT_PHYSICAL_TEST', // TODO: Update
        productionVariantId: 'gid://shopify/ProductVariant/KEEP_IT_PHYSICAL_PROD', // TODO: Update
        basePrice: 0, // TODO: Set pricing
      },
      digital: {
        title: 'Digital Delivery',
        testModeVariantId: 'gid://shopify/ProductVariant/KEEP_IT_DIGITAL_TEST', // TODO: Update
        productionVariantId: 'gid://shopify/ProductVariant/KEEP_IT_DIGITAL_PROD', // TODO: Update
        basePrice: 0, // TODO: Set pricing (usually lower than physical)
      },
    },
  },

  // Show It - Times Square Edition
  SHOW_IT: {
    title: 'Curated UNIKMO - Times Square Edition',
    slug: 'curated-show-it-times-square',
    description: 'Professional curation with a Times Square appearance. The public moment is captured and incorporated into your finished UNIKMO memory.',
    testModeId: 'gid://shopify/Product/SHOW_IT_TEST_ID', // TODO: Update
    productionId: 'gid://shopify/Product/SHOW_IT_PROD_ID', // TODO: Update
    variants: {
      physical: {
        title: 'Physical UNIKMO Card',
        testModeVariantId: 'gid://shopify/ProductVariant/SHOW_IT_PHYSICAL_TEST', // TODO: Update
        productionVariantId: 'gid://shopify/ProductVariant/SHOW_IT_PHYSICAL_PROD', // TODO: Update
        basePrice: 0, // TODO: Set pricing (premium)
      },
      digital: {
        title: 'Digital Delivery',
        testModeVariantId: 'gid://shopify/ProductVariant/SHOW_IT_DIGITAL_TEST', // TODO: Update
        productionVariantId: 'gid://shopify/ProductVariant/SHOW_IT_DIGITAL_PROD', // TODO: Update
        basePrice: 0, // TODO: Set pricing
      },
    },
  },

  // Extra Keepsakes
  EXTRA_KEEPSAKES: {
    title: 'Curated UNIKMO - Extra Keepsake Card',
    slug: 'curated-extra-keepsakes',
    description: 'Additional physical UNIKMO cards with the same finished curated memory.',
    testModeId: 'gid://shopify/Product/EXTRAS_TEST_ID', // TODO: Update
    productionId: 'gid://shopify/Product/EXTRAS_PROD_ID', // TODO: Update
    variants: {
      standard: {
        title: '1 Extra Card',
        testModeVariantId: 'gid://shopify/ProductVariant/EXTRAS_TEST', // TODO: Update
        productionVariantId: 'gid://shopify/ProductVariant/EXTRAS_PROD', // TODO: Update
        pricePerCard: 12, // Fixed price per card
      },
    },
  },
};

export function getCuratedProductId(productKey: keyof typeof CURATED_PRODUCTS, isTestMode: boolean): string {
  const product = CURATED_PRODUCTS[productKey];
  return isTestMode ? product.testModeId : product.productionId;
}

export function getCuratedVariantId(
  productKey: keyof typeof CURATED_PRODUCTS,
  variantKey: string,
  isTestMode: boolean
): string {
  const product = CURATED_PRODUCTS[productKey];
  const variant = (product.variants as any)[variantKey];

  if (!variant) {
    throw new Error(`Variant ${variantKey} not found for product ${productKey}`);
  }

  return isTestMode ? variant.testModeVariantId : variant.productionVariantId;
}

export function calculateCuratedPrice(
  baseServicePrice: number,
  extraKeepsakesCount: number
): { basePrice: number; extrasPrice: number; totalPrice: number } {
  const extrasPrice = extraKeepsakesCount * CURATED_PRODUCTS.EXTRA_KEEPSAKES.variants.standard.pricePerCard;
  const totalPrice = baseServicePrice + extrasPrice;

  return {
    basePrice: baseServicePrice,
    extrasPrice,
    totalPrice,
  };
}
