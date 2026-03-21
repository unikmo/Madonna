/**
 * Parses `sellingEnabled` from JSON bodies where clients sometimes send
 * string "true"/"false" instead of real booleans.
 */
export function parseSellingEnabledInput(value: unknown): boolean | undefined {
  if (value === true || value === 1) return true;
  if (value === false || value === 0) return false;
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase();
    if (v === 'true' || v === '1' || v === 'yes' || v === 'on') return true;
    if (v === 'false' || v === '0' || v === 'no' || v === 'off') return false;
  }
  return undefined;
}

/** Default when field is missing in DB: selling is ON. */
export function isSellingEnabledFromDoc(sellingEnabled: unknown): boolean {
  return sellingEnabled !== false;
}
