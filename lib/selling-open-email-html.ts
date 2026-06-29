function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export type SellingOpenEmailParams = {
  name: string;
  shopUrl: string;
};

/**
 * Matches UNIKMO waitlist email shell (waitlist-confirmation-email-html) — same header, card, typography.
 */
export function buildSellingOpenEmailHtml(params: SellingOpenEmailParams): { html: string; subject: string } {
  const name = escapeHtml(params.name);
  const shopUrl = escapeHtml(params.shopUrl);

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
                <h1 style="margin:0 0 16px;font-size:22px;font-weight:600;font-family:Georgia,serif;line-height:1.3;color:#2D2926;text-align:center;">
                  The shop is open again
                </h1>
                <p style="margin:0 0 18px;font-size:16px;line-height:1.6;color:#2D2926;opacity:0.9;text-align:center;">
                  Hi ${name || 'there'},
                </p>
                <p style="margin:0 0 22px;font-size:15px;line-height:1.65;color:#2D2926;opacity:0.88;text-align:center;">
                  We’ve turned purchasing back on. You can reserve your Unikmo moment on the site whenever you’re ready — same flow as before, no new signup needed.
                </p>
                <table role="presentation" width="100%" style="background:#EFE8E5;border-radius:12px;padding:18px 20px;margin:0 0 26px;">
                  <tr>
                    <td style="padding:0;text-align:center;">
                      <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#6b635c;">Next step</p>
                      <p style="margin:0;font-size:15px;line-height:1.5;color:#2D2926;font-weight:600;">Open the site and Choose a Card</p>
                    </td>
                  </tr>
                </table>
                <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 auto 24px;">
                  <tr>
                    <td style="border-radius:999px;background:#2D2926;padding:14px 28px;">
                      <a href="${shopUrl}" style="display:inline-block;font-size:13px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#FDF9F5 !important;text-decoration:none !important;-webkit-text-fill-color:#FDF9F5;">Go to Unikmo</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0;font-size:13px;line-height:1.6;color:#2D2926;opacity:0.65;text-align:center;">
                  If you didn’t join the waitlist, you can ignore this email.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const subject = 'UNIKMO — The shop is open';

  return { html, subject };
}
