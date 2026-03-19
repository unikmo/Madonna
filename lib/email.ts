import nodemailer from 'nodemailer';
import { buildMomentCodesEmailHtml } from './moment-code-email-html';

/**
 * Creates and configures Nodemailer transporter for SMTP fallback
 */
function createEmailTransporter() {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    throw new Error('SMTP configuration is missing. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS');
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
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
 * Sends email using the external email service API, with SMTP fallback
 */
export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  // Try email service API first
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
    } else {
      const errorMsg = response?.msg || response?.message || 'Unknown error';
      console.error("EmailServiceError:: ❌ Email failed to send");
      console.error("EmailServiceError:: Error details:", errorMsg);
      if (response?.msg?.response) {
        console.error("EmailServiceError:: SMTP Response:", response.msg.response);
      }
      throw new Error(`Email service returned error: ${errorMsg}`);
    }
  } catch (error: any) {
    console.error("EmailServiceError:: Exception occurred:", error?.message);
    console.log("EmailService:: Falling back to SMTP...");
    
    // Fallback to SMTP
    try {
      return await sendEmailViaSMTP(to, subject, html);
    } catch (smtpError: any) {
      console.error("SMTP:: ❌ SMTP fallback also failed:", smtpError?.message);
      return false;
    }
  }
}

/**
 * Sends Moment Code(s) to buyer via email
 */
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
