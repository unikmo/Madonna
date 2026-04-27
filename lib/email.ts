import nodemailer from 'nodemailer';
import { buildMomentCodesEmailHtml } from './moment-code-email-html';
import type { WaitlistCopyFields } from './waitlist-copy-defaults';
import {
  buildWaitlistConfirmationEmailHtml,
  type WaitlistConfirmationDetails,
} from './waitlist-confirmation-email-html';

/**
 * Creates and configures Nodemailer transporter for SMTP fallback
 */
function createEmailTransporter() {
  const host = process.env.SMTP_HOST?.trim();
  const portRaw = process.env.SMTP_PORT?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();

  if (!host || !portRaw || !user || !pass) {
    throw new Error('SMTP configuration is missing. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS');
  }

  const port = parseInt(portRaw, 10);
  const secure = port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    connectionTimeout: 12000,
    greetingTimeout: 12000,
    socketTimeout: 15000,
    auth: { user, pass },
  });
}

/**
 * Sends email using SMTP (fallback method)
 */
async function sendEmailViaSMTP(to: string, subject: string, html: string): Promise<boolean> {
  try {
    console.log("SMTP:: Attempting to send email via SMTP to:", to);
    const transporter = createEmailTransporter();
    const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@unikmo.com';

    const mailOptions = {
      from,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log("SMTP:: ✅ Email has been sent successfully via SMTP for ", to);
    return true;
  } catch (error: any) {
    console.error("SMTP:: ❌ Failed to send email via SMTP:", error?.message);
    return false;
  }
}

/**
 * Sends email using the external email service API.
 */
async function sendEmailViaApi(to: string, subject: string, html: string): Promise<boolean> {
  try {
    console.log("EmailService:: Attempting to send email to:", to);
    console.log("EmailService:: Subject:", subject);

    const sendEmailResponse = await fetch('https://glonetex-email-service.vercel.app/fitwell/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: to,
        subject,
        html,
      })
    });

    if (!sendEmailResponse.ok) {
      console.error("EmailServiceError:: HTTP error:", sendEmailResponse.status, sendEmailResponse.statusText);
      const errorText = await sendEmailResponse.text();
      console.error("EmailServiceError:: Response body:", errorText);
      throw new Error(`Email service API returned ${sendEmailResponse.status}`);
    }

    const response = await sendEmailResponse?.json();
    console.log("EmailServiceResponse:: ", JSON.stringify(response, null, 2));

    // Check response status - true means success, false means error
    if (response && response.status === true) {
      console.log("EmailService:: ✅ Email has been sent successfully for ", to);
      return true;
    }

    const errorMsg = response?.msg || response?.message || 'Unknown error';
    console.error("EmailServiceError:: ❌ Email failed to send");
    console.error("EmailServiceError:: Error details:", errorMsg);
    if (response?.msg?.response) {
      console.error("EmailServiceError:: SMTP Response:", response.msg.response);
    }
    throw new Error(`Email service returned error: ${errorMsg}`);
  } catch (error: any) {
    console.error("EmailServiceError:: Exception occurred:", error?.message);
    return false;
  }
}

/**
 * Sends email using configured provider.
 * EMAIL_PROVIDER=smtp  -> SMTP only (recommended for custom mailbox)
 * EMAIL_PROVIDER=api   -> API first, then SMTP fallback
 * unset/other          -> SMTP first, then API fallback
 */
export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const provider = (process.env.EMAIL_PROVIDER || '').toLowerCase().trim();

  if (provider === 'smtp') {
    return sendEmailViaSMTP(to, subject, html);
  }

  if (provider === 'api') {
    const viaApi = await sendEmailViaApi(to, subject, html);
    if (viaApi) return true;
    console.log("EmailService:: API failed, falling back to SMTP...");
    return sendEmailViaSMTP(to, subject, html);
  }

  // Default: SMTP first for reliability with custom mailbox integrations.
  const viaSmtp = await sendEmailViaSMTP(to, subject, html);
  if (viaSmtp) return true;

  console.log("SMTP:: Failed, falling back to EmailService API...");
  return sendEmailViaApi(to, subject, html);
}

/**
 * Sends Moment Code(s) to buyer via email
 */
/**
 * Sends waitlist confirmation with the same marketing copy as Admin → Configs.
 * Does not throw — returns false if all providers fail (signup should still succeed).
 */
export async function sendWaitlistConfirmationEmail(
  to: string,
  copy: WaitlistCopyFields,
  details: WaitlistConfirmationDetails
): Promise<boolean> {
  const { html, subject } = buildWaitlistConfirmationEmailHtml(copy, details);
  return sendEmail(to, subject, html);
}

export async function sendMomentCodesEmail(
  to: string,
  codes: string[],
  orderId: string
): Promise<void> {
  const baseUrl = (process.env.BASE_URL || 'https://yourdomain.com').replace(/\/$/, '');
  const { html } = buildMomentCodesEmailHtml({ codes, orderId, baseUrl });

  const subject = `Your Moment Code${codes.length > 1 ? 's' : ''} - UNIKMO`;

  const success = await sendEmail(to, subject, html);
  
  if (!success) {
    throw new Error('Failed to send email');
  }
}

/**
 * Sends unlock notification email to buyer when a code is unlocked.
 */
export async function sendUnlockNotificationEmail(params: {
  to: string;
  code: string;
  unlockedAt?: Date;
}): Promise<void> {
  const baseUrl = (process.env.BASE_URL || 'https://yourdomain.com').replace(/\/$/, '');
  const unlockedAtText = (params.unlockedAt || new Date()).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const subject = 'Your UNIKMO Moment Was Unlocked';
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
          line-height: 1.6; color: #2D2926; background: #F7F1EA;
          padding: 40px 20px; min-height: 100vh;
        }
        .email-container { max-width: 600px; margin: 0 auto; background: #FDF9F5; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(45, 41, 38, 0.08); }
        .header { background: #EFE8E5; padding: 36px 30px; text-align: center; }
        .logo { font-size: 28px; font-weight: 700; color: #2D2926; margin-bottom: 8px; font-family: Georgia, 'Times New Roman', serif; letter-spacing: 0.02em; }
        .header-subtitle { color: #2D2926; font-size: 15px; opacity: 0.85; }
        .content { padding: 36px 30px; }
        .title { font-size: 22px; font-weight: 600; color: #2D2926; margin-bottom: 16px; font-family: Georgia, 'Times New Roman', serif; }
        .message { color: #2D2926; font-size: 15px; margin-bottom: 22px; line-height: 1.7; opacity: 0.9; }
        .info-box { background: #EFE8E5; border-radius: 12px; padding: 18px 20px; margin: 16px 0 24px; }
        .row-label { color: #b08d57; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 6px; font-weight: 600; }
        .row-value { color: #2D2926; font-size: 18px; font-weight: 700; font-family: 'Courier New', monospace; }
        .meta { color: #2D2926; font-size: 14px; opacity: 0.85; margin-top: 8px; }
        .actions { margin: 26px 0; text-align: center; }
        .button { display: inline-block; padding: 14px 28px; background: #2D2926; color: #FDF9F5 !important; text-decoration: none !important; border-radius: 12px; font-weight: 600; font-size: 14px; letter-spacing: 0.08em; text-transform: uppercase; border: 1px solid #2D2926; -webkit-text-fill-color: #FDF9F5; }
        .footer { margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(45, 41, 38, 0.1); text-align: center; }
        .footer-text { color: #2D2926; font-size: 13px; line-height: 1.75; opacity: 0.75; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="logo">UNIKMO</div>
          <div class="header-subtitle">Unlock Notification</div>
        </div>
        <div class="content">
          <div class="title">Your moment has been unlocked</div>
          <div class="message">
            Great news — someone just unlocked one of your UNIKMO moments.
          </div>
          <div class="info-box">
            <div class="row-label">Moment Code</div>
            <div class="row-value">${params.code}</div>
            <div class="meta">Unlocked at: ${unlockedAtText}</div>
          </div>
          <div class="actions">
            <a href="${baseUrl}/unlock" class="button">Open Unlock Page</a>
          </div>
          <div class="footer">
            <div class="footer-text">
              You are receiving this because this code is connected to your purchase.
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>
  `;

  const success = await sendEmail(params.to, subject, html);
  if (!success) {
    throw new Error('Failed to send unlock notification email');
  }
}
