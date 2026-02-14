import { NextRequest, NextResponse } from 'next/server';
import { getShopifyCredentialsRaw, saveShopifyCredentials, getShopifyCredentials } from '@/lib/shopify-credentials';
import { decrypt } from '@/lib/encryption';
import { verifyToken } from '@/lib/auth';

/**
 * GET - Get Shopify credentials status (encrypted, requires password to decrypt)
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('admin-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.roles || !payload.roles.includes('admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const credentials = await getShopifyCredentialsRaw();

    return NextResponse.json({
      hasCredentials: credentials.hasCredentials,
      storeDomain: credentials.storeDomain,
      baseUrl: credentials.baseUrl,
      apiVersion: credentials.apiVersion,
      // Don't return encrypted values, just indicate they exist
      hasAccessToken: !!credentials.accessToken,
      hasWebhookSecret: !!credentials.webhookSecret,
    });
  } catch (error: any) {
    console.error('Error getting Shopify credentials:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get credentials' },
      { status: 500 }
    );
  }
}

/**
 * POST - Decrypt and return credentials (requires password)
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('admin-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.roles || !payload.roles.includes('admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { password, action } = await request.json();

    if (action === 'decrypt') {
      if (!password) {
        return NextResponse.json({ error: 'Password is required' }, { status: 400 });
      }

      try {
        const credentials = await getShopifyCredentials(password);
        
        return NextResponse.json({
          success: true,
          credentials: {
            storeDomain: credentials.storeDomain,
            accessToken: credentials.accessToken,
            webhookSecret: credentials.webhookSecret,
            baseUrl: credentials.baseUrl,
            apiVersion: credentials.apiVersion,
            source: credentials.source,
          },
        });
      } catch (error: any) {
        return NextResponse.json(
          { error: error.message || 'Failed to decrypt credentials' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in POST /api/admin/shopify-credentials:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}

/**
 * PUT - Save/Update Shopify credentials (requires password for encryption)
 */
export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('admin-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.roles || !payload.roles.includes('admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { storeDomain, accessToken, webhookSecret, baseUrl, apiVersion, password } = await request.json();

    if (!storeDomain || !accessToken || !webhookSecret || !password) {
      return NextResponse.json(
        { error: 'storeDomain, accessToken, webhookSecret, and password are required' },
        { status: 400 }
      );
    }

    await saveShopifyCredentials(
      {
        storeDomain,
        accessToken,
        webhookSecret,
        baseUrl: baseUrl || process.env.BASE_URL || '',
        apiVersion: apiVersion || '2024-10',
      },
      password
    );

    return NextResponse.json({
      success: true,
      message: 'Credentials saved successfully',
    });
  } catch (error: any) {
    console.error('Error saving Shopify credentials:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save credentials' },
      { status: 500 }
    );
  }
}
