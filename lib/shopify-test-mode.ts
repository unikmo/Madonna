import connectDB from './db';
import { getLatestAdminSettingsLean } from '@/lib/admin-settings-store';

/**
 * Returns the effective Shopify test mode flag.
 * Priority:
 * 1. AdminSettings.shopifyTestModeOverride (if boolean)
 * 2. SHOPIFY_TEST_MODE env (=== 'true')
 */
export async function getEffectiveShopifyTestMode(): Promise<boolean> {
  const envDefault = process.env.SHOPIFY_TEST_MODE === 'true';

  try {
    await connectDB();
    const settings = await getLatestAdminSettingsLean();
    if (settings && typeof settings.shopifyTestModeOverride === 'boolean') {
      return settings.shopifyTestModeOverride;
    }
  } catch (error) {
    console.error('Failed to read AdminSettings for test mode, falling back to env:', error);
  }

  return envDefault;
}

