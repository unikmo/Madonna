/**
 * Builds the exact HTML used for the Moment Keys email.
 * This is intentionally "HTML-only" (no nodemailer / server deps) so it can be used
 * both in the email sender and in the admin preview (client-side iframe).
 */

import type { DeliveryType, Quantity } from './code-generator';

type BuildArgs = {
  codes: string[];
  orderId: string;
  baseUrl?: string; // e.g. https://yourdomain.com (no trailing slash recommended)
  // Optional override: if you ever want physical/split templates later.
  deliveryType?: DeliveryType;
};

type TierConfig = {
  productImagePath: string; // path under /public (no baseUrl)
  // QR placement relative to the rendered product image box.
  // Values are in percentages of image width/height after scaling.
  qr: {
    leftPct: number;
    topPct: number;
    // QR overlay size in percentages of product image width/height after scaling.
    sizeXPct: number;
    sizeYPct: number;
  };
  qrBgColor: string; // hex without '#'
  // For converting bbox pixels (detected from original assets) into rendered px.
  // Email HTML sets the product image width to 520px on desktop.
  // These are used to compute QR px size that matches scaling.
  original: { imgW: number; qrW: number; qrH: number };
};

// Shared config: the email overlays a live QR code onto the real UNIKMO back-card
// design (public/card-back.png), inside the placeholder QR box already printed on it.
// Box measured directly from the 1920x1362 export: 496x496px centered at (959, 496).
const BACK_CARD_TIER: TierConfig = {
  productImagePath: '/card-back.png',
  qr: { leftPct: 49.9479, topPct: 36.417, sizeXPct: 25.8333, sizeYPct: 36.417 },
  qrBgColor: 'F7F2EF',
  original: { imgW: 1920, qrW: 496, qrH: 496 },
};

const TIER_BY_COUNT: Record<1 | 4 | 7, TierConfig> = {
  1: BACK_CARD_TIER,
  4: BACK_CARD_TIER,
  7: BACK_CARD_TIER,
};

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.replace(/\/$/, '');
}

export function buildMomentCodesEmailHtml({ codes, orderId, baseUrl, deliveryType }: BuildArgs): { html: string } {
  const safeBaseUrl = normalizeBaseUrl(baseUrl ?? 'https://yourdomain.com');
  const uploadPageUrl = `${safeBaseUrl}/upload`;
  const uploadUrl = `${uploadPageUrl}?code=${encodeURIComponent(codes[0] || '')}`;
  const unlockBaseUrl = `${safeBaseUrl}/unlock`;

  const firstCode = codes[0] || '';

  const count = codes.length as Quantity | number;
  const tierCount = (count === 7 || count === 4 || count === 1 ? count : 1) as 1 | 4 | 7;
  const tier = TIER_BY_COUNT[tierCount];
  const cardBlocksHtml = codes
    .map((code, index) => {
      const unlockUrlForCode = `${unlockBaseUrl}?code=${encodeURIComponent(code)}`;
      const qrUrlForCode = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
        unlockUrlForCode
      )}&bgcolor=${tier.qrBgColor}&color=2D2926`;

      return `
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 16px auto 0; max-width: 520px; width: 100%;">
          <tr>
            <td style="padding: 0;">
              ${
                codes.length > 1
                  ? `<div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #B38846; font-weight: 600; margin: 0 0 8px 2px;">Card ${index + 1}</div>`
                  : ''
              }
              <div style="position: relative; border-radius: 14px; overflow: hidden; border: 1px solid rgba(45,41,38,0.12);">
                <img
                  src="${safeBaseUrl}${tier.productImagePath}"
                  width="520"
                  alt="UNIKMO card"
                  style="width: 100%; max-width: 520px; height: auto; display: block; border: 0;"
                />
                <img
                  src="${qrUrlForCode}"
                  width="92"
                  alt="QR for Key ${code}"
                  style="
                    position: absolute;
                    left: ${tier.qr.leftPct}%;
                    top: ${tier.qr.topPct}%;
                    width: ${tier.qr.sizeXPct}%;
                    height: ${tier.qr.sizeYPct}%;
                    transform: translate(-50%, -50%);
                    border: 0;
                    background: #${tier.qrBgColor};
                  "
                />
                <div
                  style="
                    position: absolute;
                    left: 49%;
                    bottom: 14px;
                    transform: translateX(-50%);
                    background: rgba(253,249,245,0.9);
                    border: 1px solid rgba(45,41,38,0.2);
                    border-radius: 999px;
                    padding: 7px 12px;
                    font-family: 'Courier New', monospace;
                    font-size: 13px;
                    letter-spacing: 1.1px;
                    color: #22323A;
                    white-space: nowrap;
                  "
                >${code}</div>
              </div>
            </td>
          </tr>
        </table>
      `;
    })
    .join('');

  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6; color: #22323A; background: #F7F1EA;
          padding: 40px 20px; min-height: 100vh;
        }
        .email-container { max-width: 600px; margin: 0 auto; background: #FDF9F5; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(45, 41, 38, 0.08); }
        .header { background: #EFE8E5; padding: 36px 30px; text-align: center; }
        .logo { font-size: 28px; font-weight: 700; color: #22323A; margin-bottom: 8px; font-family: Georgia, 'Times New Roman', serif; letter-spacing: 0.02em; }
        .header-subtitle { color: #22323A; font-size: 15px; opacity: 0.85; }
        .content { padding: 36px 30px; }
        .greeting { font-size: 22px; font-weight: 600; color: #22323A; margin-bottom: 16px; font-family: Georgia, 'Times New Roman', serif; }
        .message { color: #22323A; font-size: 15px; margin-bottom: 28px; line-height: 1.7; opacity: 0.9; }
        .order-info { background: #EFE8E5; border-radius: 12px; padding: 18px 20px; margin-bottom: 28px; }
        .order-label { color: #B38846; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 6px; font-weight: 600; }
        .order-number { color: #22323A; font-size: 20px; font-weight: 700; font-family: 'Courier New', monospace; }
        .codes-section { margin: 28px 0; }
        .codes-title { color: #22323A; font-size: 17px; font-weight: 600; margin-bottom: 16px; text-align: center; font-family: Georgia, 'Times New Roman', serif; }
        .code-item { background: #FBF7F2; border: 1px solid rgba(45, 41, 38, 0.08); border-radius: 12px; padding: 20px; margin-bottom: 12px; text-align: center; box-shadow: 0 4px 16px rgba(45, 41, 38, 0.04); }
        .code-label { color: #B38846; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 8px; font-weight: 600; }
        .code-value { color: #22323A; font-size: 20px; font-weight: 700; font-family: 'Courier New', monospace; letter-spacing: 2px; }
        .actions { margin: 32px 0; text-align: center; }
        .button { display: inline-block; padding: 14px 28px; margin: 8px; background: #22323A; color: #FDF9F5; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 14px; letter-spacing: 0.08em; text-transform: uppercase; }
        .button:hover { background: #1E1B18; }
        .button-secondary { background: #FDF9F5; color: #22323A; border: 1px solid #D3C7BB; padding: 14px 28px; }
        .button-secondary:hover { background: #EFE8E5; }
        .info-box { background: #EFE8E5; border-radius: 12px; padding: 18px 20px; margin: 28px 0; }
        .info-title { color: #22323A; font-size: 13px; font-weight: 600; margin-bottom: 10px; }
        .info-text { color: #22323A; font-size: 14px; line-height: 1.65; opacity: 0.85; }
        .footer { margin-top: 36px; padding-top: 24px; border-top: 1px solid rgba(45, 41, 38, 0.1); text-align: center; }
        .footer-text { color: #22323A; font-size: 13px; line-height: 1.75; opacity: 0.75; }
        .footer-brand { color: #22323A; font-weight: 600; margin-top: 12px; font-family: Georgia, 'Times New Roman', serif; }
        .divider { height: 1px; background: rgba(45, 41, 38, 0.1); margin: 28px 0; }
        @media only screen and (max-width: 600px) {
          .content { padding: 28px 20px; }
          .header { padding: 28px 20px; }
          .button { display: block; margin: 8px 0; }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="logo">UNIKMO</div>
          <div class="header-subtitle">Your moment is ready</div>
        </div>

        <div class="content">
          <div class="greeting">Thank you for your purchase</div>

          <div class="message">
            Your order is confirmed and your unique Moment Key${codes.length > 1 ? 's are' : ' is'} ready to use.
          </div>

          <div class="order-info">
            <div class="order-label">Order Number</div>
            <div class="order-number">#${orderId}</div>
          </div>

          <div class="codes-section">
            <div class="codes-title">Your card &amp; access code</div>
            ${cardBlocksHtml}
          </div>

          <div class="divider"></div>
          
          <div class="actions">
            <a
              href="${uploadUrl}"
              class="button"
              style="display: inline-block; padding: 14px 28px; margin: 8px; background-color: #22323A; color: #FDF9F5 !important; text-decoration: none !important; border-radius: 12px; font-weight: 600; font-size: 14px; letter-spacing: 0.08em; text-transform: uppercase; border: 1px solid #22323A; -webkit-text-fill-color: #FDF9F5;"
            >Upload your media</a>
            <a
              href="${unlockBaseUrl}"
              class="button button-secondary"
              style="display: inline-block; padding: 14px 28px; margin: 8px; background-color: #FDF9F5 !important; color: #22323A !important; text-decoration: none !important; border-radius: 12px; font-weight: 600; font-size: 14px; letter-spacing: 0.08em; text-transform: uppercase; border: 1px solid #D3C7BB; -webkit-text-fill-color: #22323A;"
            >Unlock moment</a>
          </div>
          
          <div class="info-box">
            <div class="info-title"><span>Important information</span></div>
            <div class="info-text">
              <strong>Upload your media:</strong> <a href="${uploadUrl}" style="color: #22323A; font-weight: 600;">${uploadPageUrl.replace(/^https?:\/\//, '')}</a> (your Key is pre-filled)<br>
              <strong>Share with recipient:</strong> Give them the Key above and they can unlock at <a href="${unlockBaseUrl}" style="color: #22323A; font-weight: 600;">${unlockBaseUrl.replace(/^https?:\/\//, '')}</a><br>
              <strong>Remember:</strong> Keep your Key safe - it's the only way to access your moment!
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-text">
              If you have any questions, please don't hesitate to contact us.<br>
              We're here to help make your moment special!
            </div>
            <div class="footer-brand">Best regards,<br>The UNIKMO Team</div>
          </div>
        </div>
      </div>
    </body>
  </html>
  `;

  return { html };
}

