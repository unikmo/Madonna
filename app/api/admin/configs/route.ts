import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { applyAdminSettingsPatch, getLatestAdminSettingsLean } from '@/lib/admin-settings-store';
import { mergeWaitlistCopy, type WaitlistCopyFields } from '@/lib/waitlist-copy-defaults';
import { isSellingEnabledFromDoc, parseSellingEnabledInput } from '@/lib/parse-selling-enabled';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const doc = await getLatestAdminSettingsLean();
    const merged = mergeWaitlistCopy(doc as any);
    return NextResponse.json({
      sellingEnabled: isSellingEnabledFromDoc(doc?.sellingEnabled),
      ...merged,
      updatedAt: doc?.updatedAt,
    });
  } catch (error: any) {
    console.error('GET /api/admin/configs:', error);
    return NextResponse.json({ error: error.message || 'Failed to load configs' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown> & Partial<WaitlistCopyFields>;
    const {
      sellingEnabled: sellingEnabledRaw,
      waitlistHeadline,
      waitlistSubline1,
      waitlistSubline2,
      waitlistSupportingLine,
      waitlistEmailPlaceholder,
      waitlistNamePlaceholder,
      waitlistCtaLabel,
    } = body;

    await connectDB();
    const patch: Record<string, unknown> = {};
    if (Object.prototype.hasOwnProperty.call(body, 'sellingEnabled')) {
      const parsed = parseSellingEnabledInput(sellingEnabledRaw);
      if (parsed === undefined) {
        return NextResponse.json(
          { error: 'sellingEnabled must be a boolean (or "true"/"false")' },
          { status: 400 }
        );
      }
      patch.sellingEnabled = parsed;
    }
    if (typeof waitlistHeadline === 'string') patch.waitlistHeadline = waitlistHeadline;
    if (typeof waitlistSubline1 === 'string') patch.waitlistSubline1 = waitlistSubline1;
    if (typeof waitlistSubline2 === 'string') patch.waitlistSubline2 = waitlistSubline2;
    if (typeof waitlistSupportingLine === 'string') patch.waitlistSupportingLine = waitlistSupportingLine;
    if (typeof waitlistEmailPlaceholder === 'string') patch.waitlistEmailPlaceholder = waitlistEmailPlaceholder;
    if (typeof waitlistNamePlaceholder === 'string') patch.waitlistNamePlaceholder = waitlistNamePlaceholder;
    if (typeof waitlistCtaLabel === 'string') patch.waitlistCtaLabel = waitlistCtaLabel;

    await applyAdminSettingsPatch(patch);

    const settings = await getLatestAdminSettingsLean();
    const merged = mergeWaitlistCopy(settings as any);
    return NextResponse.json({
      sellingEnabled: isSellingEnabledFromDoc(settings?.sellingEnabled),
      ...merged,
    });
  } catch (error: any) {
    console.error('PUT /api/admin/configs:', error);
    return NextResponse.json({ error: error.message || 'Failed to save configs' }, { status: 500 });
  }
}
