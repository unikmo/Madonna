/**
 * Generates Moment Codes in the format: UNIKMO-XXXX-[Q][D]XX-XXX
 * Where:
 * - XXXX = 4 random alphanumeric characters
 * - Q = quantity (1, 4, or 7)
 * - D = deliveryType first letter (D=digital, P=physical, S=split)
 * - XX = 2 random alphanumeric characters
 * - XXX = 3 random alphanumeric characters
 */

export type Quantity = 1 | 4 | 7;
export type DeliveryType = 'digital' | 'physical' | 'split';

/**
 * Generates a random alphanumeric string of specified length
 */
function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Gets the delivery type letter code
 */
function getDeliveryTypeCode(deliveryType: DeliveryType): string {
  const mapping: Record<DeliveryType, string> = {
    digital: 'D',
    physical: 'P',
    split: 'S',
  };
  return mapping[deliveryType];
}

/**
 * Generates a Moment Code with encoded quantity and delivery type
 * Format: UNIKMO-XXXX-[Q][D]XX-XXX
 * 
 * @param quantity - The quantity value (1, 4, or 7)
 * @param deliveryType - The delivery type (digital, physical, or split)
 * @returns A unique Moment Code string
 */
export function generateMomentCode(quantity: Quantity, deliveryType: DeliveryType): string {
  const prefix = 'UNIKMO';
  const segment1 = generateRandomString(4); // 4 random chars
  const segment2 = `${quantity}${getDeliveryTypeCode(deliveryType)}${generateRandomString(2)}`; // Q + D + 2 random chars
  const segment3 = generateRandomString(3); // 3 random chars

  return `${prefix}-${segment1}-${segment2}-${segment3}`;
}

/**
 * Parses a Moment Code to extract quantity and delivery type
 * 
 * @param code - The Moment Code to parse
 * @returns Object with quantity and deliveryType, or null if invalid format
 */
export function parseMomentCode(code: string): { quantity: Quantity; deliveryType: DeliveryType } | null {
  const pattern = /^UNIKMO-[A-Z0-9]{4}-([147])([DPS])[A-Z0-9]{2}-[A-Z0-9]{3}$/;
  const match = code.toUpperCase().match(pattern);

  if (!match) {
    return null;
  }

  const quantity = parseInt(match[1]) as Quantity;
  const deliveryTypeCode = match[2];

  const deliveryTypeMapping: Record<string, DeliveryType> = {
    D: 'digital',
    P: 'physical',
    S: 'split',
  };

  const deliveryType = deliveryTypeMapping[deliveryTypeCode];

  if (!deliveryType) {
    return null;
  }

  return { quantity, deliveryType };
}
