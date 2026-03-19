import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import nodemailer from 'nodemailer';

/**
 * POST - Test email connection and send a test email
 */
export async function POST(request: NextRequest) {
  console.log('📧 [Test Email] Request received');
  
  try {
    // Verify admin authentication
    const token = request.cookies.get('admin-token')?.value;
    console.log('📧 [Test Email] Token present:', !!token);
    
    if (!token) {
      console.error('📧 [Test Email] No token found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    console.log('📧 [Test Email] Token verified:', !!payload);
    
    if (!payload || !payload.roles || !payload.roles.includes('admin')) {
      console.error('📧 [Test Email] Invalid token or not admin');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { testEmail } = await request.json();
    console.log('📧 [Test Email] Test email address:', testEmail);

    if (!testEmail) {
      console.error('📧 [Test Email] No email address provided');
      return NextResponse.json(
        { error: 'Test email address is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(testEmail)) {
      console.error('📧 [Test Email] Invalid email format:', testEmail);
      return NextResponse.json(
        { error: 'Invalid email address format' },
        { status: 400 }
      );
    }

    // Check SMTP configuration
    console.log('📧 [Test Email] Checking SMTP configuration...');
    console.log('📧 [Test Email] SMTP_HOST:', process.env.SMTP_HOST ? '✓ Set' : '✗ Missing');
    console.log('📧 [Test Email] SMTP_PORT:', process.env.SMTP_PORT ? `✓ Set (${process.env.SMTP_PORT})` : '✗ Missing');
    console.log('📧 [Test Email] SMTP_USER:', process.env.SMTP_USER ? '✓ Set' : '✗ Missing');
    console.log('📧 [Test Email] SMTP_PASS:', process.env.SMTP_PASS ? '✓ Set' : '✗ Missing');
    console.log('📧 [Test Email] SMTP_FROM:', process.env.SMTP_FROM || process.env.SMTP_USER || 'Not set');

    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_PORT ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      console.error('📧 [Test Email] SMTP configuration incomplete');
      return NextResponse.json(
        {
          success: false,
          error: 'SMTP configuration is missing',
          details: 'Please set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS in your environment variables',
        },
        { status: 400 }
      );
    }

    // Create transporter
    let transporter;
    try {
      console.log('📧 [Test Email] Creating SMTP transporter...');
      console.log('📧 [Test Email] Host:', process.env.SMTP_HOST);
      console.log('📧 [Test Email] Port:', process.env.SMTP_PORT);
      console.log('📧 [Test Email] Secure:', process.env.SMTP_PORT === '465');
      console.log('📧 [Test Email] User:', process.env.SMTP_USER);
      
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: process.env.SMTP_PORT === '465',
        connectionTimeout: 12000,
        greetingTimeout: 12000,
        socketTimeout: 15000,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      console.log('📧 [Test Email] ✓ Transporter created successfully');
    } catch (error: any) {
      console.error('📧 [Test Email] ✗ Failed to create transporter:', error.message);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create SMTP transporter',
          details: error.message,
        },
        { status: 500 }
      );
    }

    // Verify SMTP connection
    try {
      console.log('📧 [Test Email] Verifying SMTP connection...');
      await transporter.verify();
      console.log('📧 [Test Email] ✓ SMTP connection verified successfully');
    } catch (error: any) {
      console.error('📧 [Test Email] ✗ SMTP connection failed:', error.message);
      console.error('📧 [Test Email] Error code:', error.code);
      console.error('📧 [Test Email] Error command:', error.command);
      return NextResponse.json(
        {
          success: false,
          error: 'SMTP connection failed',
          details: error.message || 'Unable to connect to SMTP server. Please check your SMTP credentials.',
        },
        { status: 500 }
      );
    }

    // Send test email
    const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@unikmo.com';
    const testHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #2D2926;
              background: #F7F1EA;
              padding: 40px 20px;
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
              margin-bottom: 0;
              font-family: Georgia, 'Times New Roman', serif;
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
              margin-bottom: 24px;
              line-height: 1.7;
              opacity: 0.9;
            }
            .success-box {
              background: #EFE8E5;
              border-radius: 12px;
              padding: 20px;
              margin: 28px 0;
            }
            .success-text {
              color: #2D2926;
              font-size: 15px;
              font-weight: 600;
            }
            .footer {
              margin-top: 36px;
              padding-top: 24px;
              border-top: 1px solid rgba(45, 41, 38, 0.1);
              text-align: center;
              color: #2D2926;
              font-size: 13px;
              opacity: 0.75;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <div class="logo">UNIKMO</div>
            </div>
            <div class="content">
              <div class="greeting">✅ Test Email Successful!</div>
              <div class="message">
                This is a test email from your UNIKMO admin dashboard.
              </div>
              <div class="success-box">
                <div class="success-text">
                  🎉 Your email configuration is working correctly!
                </div>
              </div>
              <div class="message">
                If you received this email, it means your SMTP settings are properly configured and emails will be sent successfully to your customers.
              </div>
              <div class="footer">
                <p>This is an automated test email from UNIKMO Admin Dashboard</p>
                <p>Time: ${new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      console.log('📧 [Test Email] Sending test email...');
      console.log('📧 [Test Email] From:', from);
      console.log('📧 [Test Email] To:', testEmail);
      console.log('📧 [Test Email] Subject: UNIKMO - Test Email');
      
      const result = await transporter.sendMail({
        from,
        to: testEmail,
        subject: 'UNIKMO - Test Email',
        html: testHtml,
      });

      console.log('📧 [Test Email] ✓ Email sent successfully!');
      console.log('📧 [Test Email] Message ID:', result.messageId);
      console.log('📧 [Test Email] Response:', result.response);

      return NextResponse.json({
        success: true,
        message: `Test email sent successfully to ${testEmail}`,
        details: 'Please check your inbox (and spam folder) to confirm receipt.',
      });
    } catch (error: any) {
      console.error('📧 [Test Email] ✗ Failed to send email:', error.message);
      console.error('📧 [Test Email] Error code:', error.code);
      console.error('📧 [Test Email] Error command:', error.command);
      console.error('📧 [Test Email] Error response:', error.response);
      console.error('📧 [Test Email] Full error:', error);
      
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send test email',
          details: error.message || 'An error occurred while sending the email. Please check your SMTP settings.',
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('📧 [Test Email] ✗ Unexpected error:', error.message);
    console.error('📧 [Test Email] Stack:', error.stack);
    return NextResponse.json(
      {
        success: false,
        error: 'Unexpected error occurred',
        details: error.message || 'An unexpected error occurred while testing email',
      },
      { status: 500 }
    );
  }
}
