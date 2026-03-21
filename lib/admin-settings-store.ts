import AdminSettings from '@/models/AdminSettings';

/**
 * Multiple legacy rows in `adminsettings` caused reads to return a stale doc
 * (still `sellingEnabled: true`) even after updates. We keep a single row.
 */
export async function dedupeAdminSettingsIfNeeded(): Promise<void> {
  const count = await AdminSettings.countDocuments();
  if (count <= 1) return;

  const docs = await AdminSettings.find({}).sort({ updatedAt: -1 });
  if (docs.length === 0) return;

  // Prefer a row that explicitly disabled selling (avoids keeping a stale "true" row
  // that only got bumped by another toggle like Shopify test mode).
  const falseDoc = docs.find((d) => d.sellingEnabled === false);
  const keeper = falseDoc || docs[0];

  await AdminSettings.deleteMany({ _id: { $ne: keeper._id } });
}

export async function getLatestAdminSettingsLean(): Promise<Record<string, unknown> | null> {
  await dedupeAdminSettingsIfNeeded();
  const doc = await AdminSettings.findOne().sort({ updatedAt: -1 }).lean();
  return doc as Record<string, unknown> | null;
}

/**
 * Applies $set on the single settings document (creates one if missing).
 */
export async function applyAdminSettingsPatch(patch: Record<string, unknown>): Promise<void> {
  await dedupeAdminSettingsIfNeeded();

  let doc = await AdminSettings.findOne().sort({ updatedAt: -1 });
  if (!doc) {
    await AdminSettings.create({
      sellingEnabled: true,
      ...patch,
    });
    return;
  }

  if (Object.keys(patch).length === 0) return;

  await AdminSettings.findByIdAndUpdate(doc._id, { $set: patch }, { new: true });
}
