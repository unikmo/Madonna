export type WaitlistCopyFields = {
  waitlistHeadline: string;
  waitlistSubline1: string;
  waitlistSubline2: string;
  waitlistSupportingLine: string;
  waitlistEmailPlaceholder: string;
  waitlistNamePlaceholder: string;
  waitlistCtaLabel: string;
};

/** Default waitlist modal copy (editable in Admin → Configs). */
export const WAITLIST_COPY_DEFAULTS: WaitlistCopyFields = {
  waitlistHeadline: "Be among the first to send something they'll never forget.",
  waitlistSubline1: "You can't always be there.",
  waitlistSubline2: 'This is the next best thing.',
  waitlistSupportingLine: 'Now on direct sale — 30% off with code LAUNCH30, limited to the first 100 orders.',
  waitlistEmailPlaceholder: 'Enter your email',
  waitlistNamePlaceholder: 'Your name',
  waitlistCtaLabel: 'Secure your spot',
};

export function mergeWaitlistCopy(
  stored: Partial<Record<keyof WaitlistCopyFields, string | undefined | null>> | null | undefined
): WaitlistCopyFields {
  return {
    waitlistHeadline: stored?.waitlistHeadline?.trim() || WAITLIST_COPY_DEFAULTS.waitlistHeadline,
    waitlistSubline1: stored?.waitlistSubline1?.trim() || WAITLIST_COPY_DEFAULTS.waitlistSubline1,
    waitlistSubline2: stored?.waitlistSubline2?.trim() || WAITLIST_COPY_DEFAULTS.waitlistSubline2,
    waitlistSupportingLine:
      stored?.waitlistSupportingLine?.trim() || WAITLIST_COPY_DEFAULTS.waitlistSupportingLine,
    waitlistEmailPlaceholder:
      stored?.waitlistEmailPlaceholder?.trim() || WAITLIST_COPY_DEFAULTS.waitlistEmailPlaceholder,
    waitlistNamePlaceholder:
      stored?.waitlistNamePlaceholder?.trim() || WAITLIST_COPY_DEFAULTS.waitlistNamePlaceholder,
    waitlistCtaLabel: stored?.waitlistCtaLabel?.trim() || WAITLIST_COPY_DEFAULTS.waitlistCtaLabel,
  };
}
