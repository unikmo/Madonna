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
async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
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
  const baseUrl = process.env.BASE_URL || 'https://yourdomain.com';
  const uploadUrl = `${baseUrl}/upload?code=${codes[0]}`;
  const unlockUrl = `${baseUrl}/unlock`;

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
            color: #e2e8f0;
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%);
            padding: 40px 20px;
            min-height: 100vh;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(15, 23, 42, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
            animation: pulse 3s ease-in-out infinite;
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
          }
          .logo {
            font-size: 32px;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          }
          .header-subtitle {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            position: relative;
            z-index: 1;
          }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 24px;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 20px;
            background: linear-gradient(135deg, #a78bfa 0%, #f472b6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .message {
            color: #cbd5e1;
            font-size: 16px;
            margin-bottom: 30px;
            line-height: 1.8;
          }
          .order-info {
            background: rgba(139, 92, 246, 0.1);
            border: 1px solid rgba(139, 92, 246, 0.3);
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 30px;
            backdrop-filter: blur(10px);
          }
          .order-label {
            color: #a78bfa;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
            font-weight: 600;
          }
          .order-number {
            color: #ffffff;
            font-size: 20px;
            font-weight: 700;
            font-family: 'Courier New', monospace;
          }
          .codes-section {
            margin: 30px 0;
          }
          .codes-title {
            color: #ffffff;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
            text-align: center;
          }
          .code-item {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%);
            border: 1px solid rgba(139, 92, 246, 0.4);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 15px;
            text-align: center;
            backdrop-filter: blur(10px);
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .code-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
          }
          .code-label {
            color: #a78bfa;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
            font-weight: 600;
          }
          .code-value {
            color: #ffffff;
            font-size: 22px;
            font-weight: 700;
            font-family: 'Courier New', monospace;
            letter-spacing: 2px;
            text-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
          }
          .actions {
            margin: 40px 0;
            text-align: center;
          }
          .button {
            display: inline-block;
            padding: 16px 32px;
            margin: 10px;
            background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
            color: #ffffff;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
            transition: transform 0.2s, box-shadow 0.2s;
            border: none;
          }
          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(139, 92, 246, 0.6);
          }
          .button-secondary {
            background: rgba(139, 92, 246, 0.2);
            border: 1px solid rgba(139, 92, 246, 0.4);
          }
          .button-secondary:hover {
            background: rgba(139, 92, 246, 0.3);
          }
          .info-box {
            background: rgba(59, 130, 246, 0.1);
            border: 1px solid rgba(59, 130, 246, 0.3);
            border-radius: 12px;
            padding: 20px;
            margin: 30px 0;
            backdrop-filter: blur(10px);
          }
          .info-title {
            color: #60a5fa;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .info-text {
            color: #cbd5e1;
            font-size: 14px;
            line-height: 1.6;
          }
          .footer {
            margin-top: 40px;
            padding-top: 30px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            text-align: center;
          }
          .footer-text {
            color: #94a3b8;
            font-size: 14px;
            line-height: 1.8;
          }
          .footer-brand {
            color: #a78bfa;
            font-weight: 600;
            margin-top: 10px;
          }
          .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent);
            margin: 30px 0;
          }
          @media only screen and (max-width: 600px) {
            .content {
              padding: 30px 20px;
            }
            .header {
              padding: 30px 20px;
            }
            .button {
              display: block;
              margin: 10px 0;
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
              <div class="codes-title">Your Moment Code${codes.length > 1 ? 's' : ''}</div>
              ${codes.map((code, index) => `
                <div class="code-item">
                  <div class="code-label">${codes.length > 1 ? `Code ${index + 1}` : 'Your Code'}</div>
                  <div class="code-value">${code}</div>
                </div>
              `).join('')}
            </div>
            
            <div class="divider"></div>
            
            <div class="actions">
              <a href="${uploadUrl}" class="button">📤 Upload Your Media</a>
              <a href="${unlockUrl}" class="button button-secondary">🔓 Unlock Moment</a>
            </div>
            
            <div class="info-box">
              <div class="info-title">
                <span>💡 Important Information</span>
              </div>
              <div class="info-text">
                <strong>Upload your media:</strong> Visit ${uploadUrl}<br>
                <strong>Share with recipient:</strong> Give them the code above and they can unlock at ${unlockUrl}<br>
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
