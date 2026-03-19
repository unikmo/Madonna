import connectDB from './db';
import ShopifyCredentials from '@/models/ShopifyCredentials';
import { encrypt, decrypt } from './encryption';
import { getEffectiveShopifyTestMode } from './shopify-test-mode';

/**
 * Gets Shopify credentials from DB or falls back to env variables
 * @param password - Password to decrypt DB credentials (if stored in DB)
 * @returns Credentials object
 */
export async function getShopifyCredentials(password?: string): Promise<{
  storeDomain: string;
  accessToken: string;
  webhookSecret: string;
  baseUrl: string;
  apiVersion: string;
  source: 'db' | 'env';
}> {
  try {
    await connectDB();
    
    // Try to get from DB first
    const credentials = await ShopifyCredentials.findOne();
    
    if (credentials && credentials.accessToken && credentials.webhookSecret) {
      // Credentials exist in DB, MUST decrypt them with correct password
      if (!password) {
        throw new Error('Password is required to decrypt credentials from database');
      }

      try {
        const decryptedAccessToken = decrypt(credentials.accessToken, password);
        const decryptedWebhookSecret = decrypt(credentials.webhookSecret, password);

        return {
          storeDomain: credentials.storeDomain,
          accessToken: decryptedAccessToken,
          webhookSecret: decryptedWebhookSecret,
          baseUrl: process.env.BASE_URL || '',
          apiVersion: credentials.apiVersion || '2024-10',
          source: 'db',
        };
      } catch (error: any) {
        // If decryption fails, throw error - DO NOT fall back to env
        throw new Error('Invalid password. Failed to decrypt credentials.');
      }
    }

    const isTestMode = await getEffectiveShopifyTestMode();
    const storeDomain = isTestMode ? process.env.TEST_SHOPIFY_STORE_DOMAIN : process.env.SHOPIFY_STORE_DOMAIN;
    const accessToken = isTestMode ? process.env.TEST_SHOPIFY_ACCESS_TOKEN : process.env.SHOPIFY_ACCESS_TOKEN;
    const webhookSecret = isTestMode ? process.env.TEST_SHOPIFY_WEBHOOK_SECRET : process.env.SHOPIFY_WEBHOOK_SECRET;
    const apiVersion = process.env.SHOPIFY_API_VERSION || '2024-10';

    if (!storeDomain || !accessToken || !webhookSecret) {
      throw new Error('Shopify credentials not found in database or environment variables');
    }

    return {
      storeDomain,
      accessToken,
      webhookSecret,
      baseUrl: process.env.BASE_URL || '',
      apiVersion,
      source: 'env',
    };
  } catch (error: any) {
    // Final fallback to env (still respecting admin override)
    const isTestMode = await getEffectiveShopifyTestMode();
    const storeDomain = isTestMode ? process.env.TEST_SHOPIFY_STORE_DOMAIN : process.env.SHOPIFY_STORE_DOMAIN;
    const accessToken = isTestMode ? process.env.TEST_SHOPIFY_ACCESS_TOKEN : process.env.SHOPIFY_ACCESS_TOKEN;
    const webhookSecret = isTestMode ? process.env.TEST_SHOPIFY_WEBHOOK_SECRET : process.env.SHOPIFY_WEBHOOK_SECRET;
    const apiVersion = process.env.SHOPIFY_API_VERSION || '2024-10';

    if (!storeDomain || !accessToken || !webhookSecret) {
      throw new Error(`Failed to get Shopify credentials: ${error.message}`);
    }

    return {
      storeDomain,
      accessToken,
      webhookSecret,
      baseUrl: process.env.BASE_URL || '',
      apiVersion,
      source: 'env',
    };
  }
}

/**
 * Gets Shopify credentials without decryption (for internal use with session password)
 * This is used when we have the password stored in session/memory
 */
export async function getShopifyCredentialsRaw(): Promise<{
  storeDomain: string;
  accessToken: string; // Encrypted
  webhookSecret: string; // Encrypted
  baseUrl: string;
  apiVersion: string;
  hasCredentials: boolean;
}> {
  try {
    await connectDB();
    const isTestMode = await getEffectiveShopifyTestMode();

    // In test mode, always use TEST_* env credentials to avoid mixing with DB live credentials.
    if (isTestMode) {
      return {
        storeDomain: process.env.TEST_SHOPIFY_STORE_DOMAIN || '',
        accessToken: process.env.TEST_SHOPIFY_ACCESS_TOKEN || '',
        webhookSecret: process.env.TEST_SHOPIFY_WEBHOOK_SECRET || '',
        baseUrl: process.env.BASE_URL || '',
        apiVersion: process.env.SHOPIFY_API_VERSION || '2024-10',
        hasCredentials: false,
      };
    }

    const credentials = await ShopifyCredentials.findOne();
    
    if (credentials && credentials.accessToken && credentials.webhookSecret) {
      return {
        storeDomain: credentials.storeDomain,
        accessToken: credentials.accessToken,
        webhookSecret: credentials.webhookSecret,
        baseUrl: process.env.BASE_URL || '',
        apiVersion: credentials.apiVersion || '2024-10',
        hasCredentials: true,
      };
    }

    return {
      storeDomain: process.env.SHOPIFY_STORE_DOMAIN || '',
      accessToken: process.env.SHOPIFY_ACCESS_TOKEN || '',
      webhookSecret: process.env.SHOPIFY_WEBHOOK_SECRET || '',
      baseUrl: process.env.BASE_URL || '',
      apiVersion: process.env.SHOPIFY_API_VERSION || '2024-10',
      hasCredentials: false,
    };
  } catch (error: any) {
    const isTestMode = await getEffectiveShopifyTestMode();

    return {
      storeDomain: isTestMode ? process.env.TEST_SHOPIFY_STORE_DOMAIN || '' : process.env.SHOPIFY_STORE_DOMAIN || '',
      accessToken: isTestMode ? process.env.TEST_SHOPIFY_ACCESS_TOKEN || '' : process.env.SHOPIFY_ACCESS_TOKEN || '',
      webhookSecret: isTestMode ? process.env.TEST_SHOPIFY_WEBHOOK_SECRET || '' : process.env.SHOPIFY_WEBHOOK_SECRET || '',
      baseUrl: process.env.BASE_URL || '',
      apiVersion: process.env.SHOPIFY_API_VERSION || '2024-10',
      hasCredentials: false,
    };
  }
}

/**
 * Saves Shopify credentials to database (encrypted)
 * @param credentials - Credentials to save
 * @param password - Password to encrypt with
 */
export async function saveShopifyCredentials(
  credentials: {
    storeDomain: string;
    accessToken: string;
    webhookSecret: string;
    baseUrl?: string;
    apiVersion?: string;
  },
  password: string
): Promise<void> {
  await connectDB();

  // Encrypt credentials
  const encryptedAccessToken = encrypt(credentials.accessToken, password);
  const encryptedWebhookSecret = encrypt(credentials.webhookSecret, password);

  // Update or create credentials
  await ShopifyCredentials.findOneAndUpdate(
    {},
    {
      storeDomain: credentials.storeDomain,
      accessToken: encryptedAccessToken,
      webhookSecret: encryptedWebhookSecret,
      baseUrl: credentials.baseUrl || process.env.BASE_URL || '',
      apiVersion: credentials.apiVersion || '2024-10',
    },
    { upsert: true, new: true }
  );
}
