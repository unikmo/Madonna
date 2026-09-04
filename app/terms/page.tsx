import type { Metadata } from 'next';
import LegalPageShell, { LegalSection } from '@/components/LegalPageShell';

export const metadata: Metadata = {
  title: 'Terms & Conditions | UNIKMO',
  description: 'The terms that govern the purchase and use of UNIKMO cards, private access codes and Moments.',
  alternates: { canonical: 'https://www.unikmo.com/terms' },
};

const bullet = 'list-disc space-y-1 pl-5 marker:text-[#B38846]/60';

export default function TermsPage() {
  return (
    <LegalPageShell
      title="Terms &amp; Conditions"
      intro="By purchasing or using UNIKMO, you agree to these Terms."
      updated="September 2026"
    >
      <LegalSection heading="1. Overview">
        <p>
          UNIKMO provides a service that enables users to create, store, and share digital Moments (video, audio,
          images, or text) through unique private access codes. By purchasing or using UNIKMO, you agree to these Terms.
        </p>
      </LegalSection>

      <LegalSection heading="2. Product nature">
        <ul className={bullet}>
          <li>Each purchase grants one or more private access codes.</li>
          <li>Each code allows creation of one (1) digital Moment.</li>
          <li>Moments are private and accessible only through the corresponding code.</li>
          <li>No account or login required.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="3. User responsibility (important)">
        <p>
          The buyer is solely responsible for storing the private access code securely and sharing it with the intended
          recipient. UNIKMO will never send the code to recipients.
        </p>
        <p>If a code is lost, shared accidentally, or accessed by third parties, UNIKMO is not liable.</p>
      </LegalSection>

      <LegalSection heading="4. Key usage rules">
        <ul className={bullet}>
          <li>One private access code = one Moment.</li>
          <li>Once a Moment is created, it cannot be edited or reassigned.</li>
          <li>Keys may not be resold or redistributed commercially.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="5. Content responsibility">
        <p>Users are fully responsible for all uploaded content. You agree not to upload:</p>
        <ul className={bullet}>
          <li>Illegal content.</li>
          <li>Copyrighted content you do not own.</li>
          <li>Offensive, abusive, or harmful material.</li>
        </ul>
        <p>UNIKMO reserves the right to remove content at any time.</p>
      </LegalSection>

      <LegalSection heading="6. Storage &amp; availability">
        <p>
          Moments are stored digitally (cloud infrastructure). We aim for long-term storage but do not guarantee
          permanent availability.
        </p>
        <p>UNIKMO may modify, migrate, or discontinue storage services (with reasonable notice where possible).</p>
      </LegalSection>

      <LegalSection heading="7. Curated UNIKMO">
        <p>
          Curated UNIKMO is an optional concierge service. After checkout we contact you to collect your materials and,
          where the Times Square Edition is selected, to confirm scheduling. Times Square appearances are subject to
          availability. Curated orders are made to order; once production has begun they cannot be cancelled or refunded.
        </p>
      </LegalSection>

      <LegalSection heading="8. Limitation of liability">
        <p>
          UNIKMO is not liable for loss of content, unauthorized access, service interruptions, or emotional / indirect
          damages.
        </p>
        <p>Maximum liability equals the amount paid by the customer.</p>
      </LegalSection>

      <LegalSection heading="9. Delivery">
        <p>
          Delivery options include Physical + Digital, Digital only, and Split delivery. Shipping times are estimates
          only.
        </p>
      </LegalSection>

      <LegalSection heading="10. Refunds">
        <ul className={bullet}>
          <li>Digital access codes are non-refundable once issued.</li>
          <li>Physical products follow the standard return policy (if unused).</li>
        </ul>
      </LegalSection>

      <LegalSection heading="11. Anti-fraud policy">
        <ul className={bullet}>
          <li>Keys are only sent to buyers.</li>
          <li>We will never ask recipients for payment or personal data.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="12. Changes">
        <p>We may update these Terms at any time.</p>
      </LegalSection>

      <LegalSection heading="13. Governing law &amp; jurisdiction">
        <p>
          These Terms are governed by the laws of Estonia, without regard to conflict-of-law principles. Any dispute
          arising from these Terms or your use of UNIKMO is subject to the exclusive jurisdiction of the courts of
          Estonia.
        </p>
        <p>
          If you are a consumer resident in the European Union, this choice of law does not deprive you of the
          protections afforded to you by the mandatory consumer-protection laws of your country of habitual residence.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
