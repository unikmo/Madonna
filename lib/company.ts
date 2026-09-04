/**
 * Operating entity behind UNIKMO. Used across the legal pages and structured data
 * so the details stay consistent. Update here if the entity or address changes.
 */
export const COMPANY = {
  legalName: 'TSquare Ventures LLC',
  product: 'UNIKMO',
  founder: 'Tichi Mbanwie',
  formationState: 'Wyoming',
  formationCountry: 'United States',
  filingId: '2026-002072750',
  address: {
    line1: '30 N Gould St, Ste R',
    city: 'Sheridan',
    region: 'WY',
    postalCode: '82801',
    country: 'United States',
  },
  addressOneLine: '30 N Gould St, Ste R, Sheridan, WY 82801, United States',
  registeredAgent: 'Registered Agents Inc, 30 N Gould St, Ste R, Sheridan, WY 82801',
  email: 'hello@planethike.org',
  governingLaw: 'the State of Wyoming, United States',
  social: {
    instagram: 'https://www.instagram.com/unikmo_first',
    tiktok: 'https://www.tiktok.com/@myunikmo',
  },
} as const;
