import nodemailer from 'nodemailer';

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
  const uploadUrl = `${baseUrl}/upload?code=${codes[0]}`;
  const unlockBaseUrl = `${baseUrl}/unlock`;
  const productPackUrl = `${baseUrl}/email-product-pack.png`;
  const firstCode = codes[0] || '';
  const unlockUrlForFirstCode = `${unlockBaseUrl}?code=${encodeURIComponent(firstCode)}`;
  const qrUrlForFirstCode = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    unlockUrlForFirstCode
  )}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #2D2926;
            background: #F7F1EA;
            padding: 40px 20px;
            min-height: 100vh;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #FDF9F5;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(45, 41, 38, 0.08);
          }
          .header {
            background: #EFE8E5;
            padding: 36px 30px;
            text-align: center;
          }
          .logo {
            font-size: 28px;
            font-weight: 700;
            color: #2D2926;
            margin-bottom: 8px;
            font-family: Georgia, 'Times New Roman', serif;
            letter-spacing: 0.02em;
          }
          .header-subtitle {
            color: #2D2926;
            font-size: 15px;
            opacity: 0.85;
          }
          .content {
            padding: 36px 30px;
          }
          .greeting {
            font-size: 22px;
            font-weight: 600;
            color: #2D2926;
            margin-bottom: 16px;
            font-family: Georgia, 'Times New Roman', serif;
          }
          .message {
            color: #2D2926;
            font-size: 15px;
            margin-bottom: 28px;
            line-height: 1.7;
            opacity: 0.9;
          }
          .order-info {
            background: #EFE8E5;
            border-radius: 12px;
            padding: 18px 20px;
            margin-bottom: 28px;
          }
          .order-label {
            color: #b08d57;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            margin-bottom: 6px;
            font-weight: 600;
          }
          .order-number {
            color: #2D2926;
            font-size: 20px;
            font-weight: 700;
            font-family: 'Courier New', monospace;
          }
          .codes-section {
            margin: 28px 0;
          }
          .codes-title {
            color: #2D2926;
            font-size: 17px;
            font-weight: 600;
            margin-bottom: 16px;
            text-align: center;
            font-family: Georgia, 'Times New Roman', serif;
          }
          .code-item {
            background: #FBF7F2;
            border: 1px solid rgba(45, 41, 38, 0.08);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 12px;
            text-align: center;
            box-shadow: 0 4px 16px rgba(45, 41, 38, 0.04);
          }
          .code-label {
            color: #b08d57;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            margin-bottom: 8px;
            font-weight: 600;
          }
          .code-value {
            color: #2D2926;
            font-size: 20px;
            font-weight: 700;
            font-family: 'Courier New', monospace;
            letter-spacing: 2px;
          }
          .actions {
            margin: 32px 0;
            text-align: center;
          }
          .button {
            display: inline-block;
            padding: 14px 28px;
            margin: 8px;
            background: #2D2926;
            color: #FDF9F5;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 14px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          .button:hover {
            background: #1E1B18;
          }
          .button-secondary {
            background: #FDF9F5;
            color: #2D2926;
            border: 1px solid #D3C7BB;
            padding: 14px 28px;
          }
          .button-secondary:hover {
            background: #EFE8E5;
          }
          .info-box {
            background: #EFE8E5;
            border-radius: 12px;
            padding: 18px 20px;
            margin: 28px 0;
          }
          .info-title {
            color: #2D2926;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 10px;
          }
          .info-text {
            color: #2D2926;
            font-size: 14px;
            line-height: 1.65;
            opacity: 0.85;
          }
          .footer {
            margin-top: 36px;
            padding-top: 24px;
            border-top: 1px solid rgba(45, 41, 38, 0.1);
            text-align: center;
          }
          .footer-text {
            color: #2D2926;
            font-size: 13px;
            line-height: 1.75;
            opacity: 0.75;
          }
          .footer-brand {
            color: #2D2926;
            font-weight: 600;
            margin-top: 12px;
            font-family: Georgia, 'Times New Roman', serif;
          }
          .divider {
            height: 1px;
            background: rgba(45, 41, 38, 0.1);
            margin: 28px 0;
          }
          @media only screen and (max-width: 600px) {
            .content {
              padding: 28px 20px;
            }
            .header {
              padding: 28px 20px;
            }
            .button {
              display: block;
              margin: 8px 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <div class="logo">UNIKMO</div>
            <div class="header-subtitle">Your Moment Codes Are Ready! 🎁</div>
          </div>
          
          <div class="content">
            <div class="greeting">Thank You for Your Purchase!</div>
            
            <div class="message">
              Your order has been confirmed and your unique Moment Code${codes.length > 1 ? 's are' : ' is'} ready to use.
            </div>
            
            <div class="order-info">
              <div class="order-label">Order Number</div>
              <div class="order-number">#${orderId}</div>
            </div>
            
            <div class="codes-section">
              <div class="codes-title">Your Moment Code${codes.length > 1 ? 's' : ''} & Digital Card${codes.length > 1 ? 's' : ''}</div>

              <!-- One image only: product pack with QR overlay -->
              <div style="position: relative; width: 100%; max-width: 520px; margin: 18px auto 0;">
                <img
                  src="${productPackUrl}"
                  alt="UNIKMO Digital Card"
                  style="width:100%; height:auto; display:block; margin: 0 auto; border-radius: 14px;"
                />
                <div style="position:absolute; top:50%; left:50%; margin-top:-70px; margin-left:-70px;">
                  <img
                    src="${qrUrlForFirstCode}"
                    alt="QR code for your Moment"
                    style="width:140px; height:140px; border-radius: 12px;"
                  />
                </div>
              </div>

              <!-- Codes are separate text under the image -->
              <div style="margin-top: 18px; text-align:center;">
                ${codes
                  .map((code, index) => {
                    return `
                      <div style="margin: 10px 0;">
                        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #b08d57; font-weight: 600; margin-bottom: 6px;">
                          ${codes.length > 1 ? `Card ${index + 1}` : 'Your Digital Card'}
                        </div>
                        <div style="color: #2D2926; font-size: 20px; font-weight: 700; font-family: 'Courier New', monospace; letter-spacing: 2px;">
                          ${code}
                        </div>
                      </div>
                    `;
                  })
                  .join('')}
              </div>
            </div>

            <div class="divider"></div>
            
            <div class="actions">
              <a href="${uploadUrl}" class="button">📤 Upload Your Media</a>
              <a href="${unlockBaseUrl}" class="button button-secondary">🔓 Unlock Moment</a>
            </div>
            
            <div class="info-box">
              <div class="info-title">
                <span>💡 Important Information</span>
              </div>
              <div class="info-text">
                <strong>Upload your media:</strong> Visit ${uploadUrl}<br>
                <strong>Share with recipient:</strong> Give them the code above and they can unlock at ${unlockBaseUrl}<br>
                <strong>Remember:</strong> Keep your code safe - it's the only way to access your moment!
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

  const subject = `Your Moment Code${codes.length > 1 ? 's' : ''} - UNIKMO`;

  const success = await sendEmail(to, subject, html);
  
  if (!success) {
    throw new Error('Failed to send email');
  }
}
