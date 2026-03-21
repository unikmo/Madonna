import { mergeWaitlistCopy, type WaitlistCopyFields } from '@/lib/waitlist-copy-defaults';
import { isSellingEnabledFromDoc } from '@/lib/parse-selling-enabled';
import { getLatestAdminSettingsLean } from '@/lib/admin-settings-store';

export type PublicSiteConfig = {
  sellingEnabled: boolean;
} & WaitlistCopyFields;

/**
 * Reads AdminSettings from DB (call after connectDB). Defaults to selling on + default copy.
 */
export async function getPublicSiteConfig(): Promise<PublicSiteConfig> {
  const doc = await getLatestAdminSettingsLean();
  const merged = mergeWaitlistCopy(doc as any);
  const sellingEnabled = isSellingEnabledFromDoc(doc?.sellingEnabled);
  return {
    sellingEnabled,
    ...merged,
  };
}
