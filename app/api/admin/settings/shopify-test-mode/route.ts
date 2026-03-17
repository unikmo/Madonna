import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import AdminSettings from '@/models/AdminSettings';
import { verifyToken } from '@/lib/auth';
import { getEffectiveShopifyTestMode } from '@/lib/shopify-test-mode';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const settings = await AdminSettings.findOne().lean();
    const envDefault = process.env.SHOPIFY_TEST_MODE === 'true';
    const effective = await getEffectiveShopifyTestMode();

    return NextResponse.json({
      override: settings?.shopifyTestModeOverride ?? null,
      envDefault,
      effective,
    });
  } catch (error: any) {
    console.error('Error in GET /api/admin/settings/shopify-test-mode:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch test mode settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.roles || !payload.roles.includes('admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { override } = body as { override: boolean | null };

    await connectDB();
    const settings = await AdminSettings.findOne();

    if (settings) {
      settings.shopifyTestModeOverride = override;
      await settings.save();
    } else {
      await AdminSettings.create({ shopifyTestModeOverride: override });
    }

    const envDefault = process.env.SHOPIFY_TEST_MODE === 'true';
    const effective = await getEffectiveShopifyTestMode();

    return NextResponse.json({
      override,
      envDefault,
      effective,
    });
  } catch (error: any) {
    console.error('Error in PUT /api/admin/settings/shopify-test-mode:', error);
    return NextResponse.json({ error: error.message || 'Failed to update test mode settings' }, { status: 500 });
  }
}

