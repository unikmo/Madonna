import type { WaitlistCopyFields } from '@/lib/waitlist-copy-defaults';

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export type WaitlistConfirmationDetails = {
  name: string;
  productTitle?: string;
  quantity?: number;
  deliveryType?: string;
};

/**
 * Confirmation email uses the same waitlist copy as configured in Admin → Configs.
 */
export function buildWaitlistConfirmationEmailHtml(
  copy: WaitlistCopyFields,
  details: WaitlistConfirmationDetails
): { html: string; subject: string } {
  const name = escapeHtml(details.name);
  const productTitle = details.productTitle ? escapeHtml(details.productTitle) : '';
  const qty = details.quantity ? escapeHtml(String(details.quantity)) : '';
  const delivery = details.deliveryType
    ? escapeHtml(details.deliveryType === 'digital' ? 'Digital' : 'Physical')
    : '';

  const headline = escapeHtml(copy.waitlistHeadline);
  const sub1 = escapeHtml(copy.waitlistSubline1);
  const sub2 = escapeHtml(copy.waitlistSubline2);
  const supporting = escapeHtml(copy.waitlistSupportingLine);

  const summaryRows: string[] = [];
  if (productTitle) {
    summaryRows.push(
      `<tr><td style="padding:8px 0;color:#6b635c;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;">Product</td><td style="padding:8px 0;color:#2D2926;font-size:15px;font-weight:600;">${productTitle}${qty ? ` (${qty} keys)` : ''}</td></tr>`
    );
  }
  if (delivery) {
    summaryRows.push(
      `<tr><td style="padding:8px 0;color:#6b635c;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;">Delivery</td><td style="padding:8px 0;color:#2D2926;font-size:15px;">${delivery}</td></tr>`
    );
  }

  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin:0;padding:0;background:#F7F1EA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#2D2926;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F7F1EA;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:560px;background:#FDF9F5;border-radius:16px;overflow:hidden;box-shadow:0 10px 40px rgba(45,41,38,0.08);">
            <tr>
              <td style="background:#EFE8E5;padding:28px 24px;text-align:center;">
                <div style="font-size:26px;font-weight:700;font-family:Georgia,'Times New Roman',serif;letter-spacing:0.06em;color:#2D2926;">UNIKMO</div>
                <div style="font-size:12px;color:#2D2926;opacity:0.75;margin-top:6px;text-transform:uppercase;letter-spacing:0.15em;">Waitlist</div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 28px;">
                <h1 style="margin:0 0 12px;font-size:22px;font-weight:600;font-family:Georgia,serif;line-height:1.3;color:#2D2926;text-align:center;">${headline}</h1>
                <p style="margin:0 0 6px;font-size:16px;line-height:1.55;color:#2D2926;opacity:0.88;text-align:center;">${sub1}</p>
                <p style="margin:0 0 16px;font-size:16px;line-height:1.55;color:#2D2926;opacity:0.88;text-align:center;">${sub2}</p>
                <p style="margin:0 0 28px;font-size:14px;line-height:1.6;color:#2D2926;opacity:0.72;text-align:center;">${supporting}</p>
                <p style="margin:0 0 20px;font-size:15px;line-height:1.65;color:#2D2926;text-align:center;">
                  Hi ${name}, thanks for securing your spot. We’ve saved your details and will be in touch when it’s your turn.
                </p>
                ${
                  summaryRows.length
                    ? `<table role="presentation" width="100%" style="background:#EFE8E5;border-radius:12px;padding:16px 20px;margin:0 0 24px;">${summaryRows.join('')}</table>`
                    : ''
                }
                <p style="margin:0;font-size:13px;line-height:1.6;color:#2D2926;opacity:0.65;text-align:center;">
                  If you didn’t request this, you can ignore this email.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const subject = `UNIKMO — ${copy.waitlistCtaLabel}`;

  return { html, subject };
}
