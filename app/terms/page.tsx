import type { Metadata } from 'next';
import LegalPageShell, { LegalSection } from '@/components/LegalPageShell';
import { COMPANY } from '@/lib/company';

export const metadata: Metadata = {
  title: 'Terms & Conditions | UNIKMO',
  description: 'The terms that govern the purchase and use of UNIKMO cards, private access codes, Moments and the Curated UNIKMO service.',
  alternates: { canonical: 'https://www.unikmo.com/terms' },
};

const bullet = 'list-disc space-y-1 pl-5 marker:text-[#B38846]/60';

export default function TermsPage() {
  return (
    <LegalPageShell
      title="Terms &amp; Conditions"
      intro={`These Terms are a contract between you and ${COMPANY.legalName}, a Wyoming (USA) limited liability company that operates UNIKMO ("UNIKMO", "we", "us"). By purchasing or using UNIKMO you agree to them.`}
      updated="September 2026"
    >
      <LegalSection heading="1. Who you are contracting with">
        <p>
          UNIKMO is a product of {COMPANY.legalName}, {COMPANY.addressOneLine}. You can reach us at{' '}
          <a href={`mailto:${COMPANY.email}`} className="underline decoration-[#B38846]/50 underline-offset-4 hover:text-[#B38846]">
            {COMPANY.email}
          </a>{' '}
          or through the <a href="/contact" className="underline decoration-[#B38846]/50 underline-offset-4 hover:text-[#B38846]">contact form</a>.
        </p>
      </LegalSection>

      <LegalSection heading="2. Overview">
        <p>
          UNIKMO lets you create, store and share private digital Moments (video, audio, images or text) that a recipient
          opens through a unique private access code connected to a physical card. Checkout and payment are handled by
          Shopify.
        </p>
      </LegalSection>

      <LegalSection heading="3. Product nature">
        <ul className={bullet}>
          <li>Each purchase grants one or more private access codes.</li>
          <li>Each code allows creation of one (1) digital Moment.</li>
          <li>Moments are private and accessible only through the corresponding code.</li>
          <li>No account or login is required for you or the recipient.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="4. Your responsibility for the access code (important)">
        <p>
          You are solely responsible for storing your private access code securely and giving it to the intended
          recipient. UNIKMO never sends the code to recipients. If a code is lost, shared by mistake, or accessed by a
          third party, UNIKMO is not liable.
        </p>
      </LegalSection>

      <LegalSection heading="5. Key usage rules">
        <ul className={bullet}>
          <li>One private access code equals one Moment.</li>
          <li>Once a Moment is created it cannot be edited or reassigned.</li>
          <li>Codes and cards may not be resold or redistributed commercially.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="6. Content responsibility">
        <p>You are fully responsible for the content you upload. You agree not to upload:</p>
        <ul className={bullet}>
          <li>illegal content;</li>
          <li>content that infringes someone else&rsquo;s rights, including copyright;</li>
          <li>offensive, abusive, deceptive or harmful material.</li>
        </ul>
        <p>We may remove content that breaches these Terms or the law at any time.</p>
      </LegalSection>

      <LegalSection heading="7. Storage &amp; availability">
        <p>
          Moments are stored on cloud infrastructure. We aim for long-term storage but do not guarantee permanent
          availability, and we may modify, migrate or discontinue storage services with reasonable notice where possible.
          Keep your own copy of anything important.
        </p>
      </LegalSection>

      <LegalSection heading="8. Curated UNIKMO">
        <ul className={bullet}>
          <li>Curated UNIKMO is an optional concierge service. After checkout we contact you to collect your materials.</li>
          <li>
            The Times Square Edition adds a Times Square appearance, subject to scheduling and availability. If a slot
            cannot be arranged within a reasonable time, we will reschedule or refund that portion of the order.
          </li>
          <li>Extra keepsake cards for the same finished memory can be added at checkout at the price shown.</li>
          <li>
            Curated orders are personalised and made to order. By ordering, you ask us to begin work immediately and
            acknowledge that once production has started the order cannot be cancelled or refunded, and (where a statutory
            cancellation right would otherwise apply) that right is lost once we have begun.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="9. Delivery">
        <p>
          Delivery options are shown at checkout (for the standard cards: Physical + Digital, Digital only, or Split; for
          Curated: physical or digital). Shipping times are estimates only and are not guaranteed.
        </p>
      </LegalSection>

      <LegalSection heading="10. Refunds &amp; cancellation">
        <ul className={bullet}>
          <li>Digital access codes and delivered digital Moments are non-refundable once issued.</li>
          <li>Unused physical cards may be returned in line with the return details provided with your order.</li>
          <li>Personalised and Curated items are non-refundable once production has begun (see section 8).</li>
          <li>Nothing here limits a refund we are required to give for a faulty or misdescribed product.</li>
        </ul>
        <p>
          <span className="font-medium text-[#22323A]">Consumers in the EU/EEA and UK:</span> distance-selling law gives
          you a 14-day right to withdraw from most online purchases. That right does <span className="font-medium text-[#22323A]">not</span>{' '}
          apply to goods made to your specification or clearly personalised, or to digital content once its creation or
          delivery has begun with your prior express consent — which covers UNIKMO Moments, personalised cards and Curated
          orders. Where the right does apply, contact us within 14 days of delivery.
        </p>
      </LegalSection>

      <LegalSection heading="11. Anti-fraud">
        <ul className={bullet}>
          <li>Access codes are only ever sent to the buyer.</li>
          <li>We will never ask a recipient for payment or personal or financial details to open a Moment.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="12. Limitation of liability">
        <p>
          To the fullest extent permitted by law, UNIKMO is not liable for loss of content, unauthorised access,
          service interruptions, or indirect, incidental or consequential damages (including emotional distress). Our
          total liability for any claim is limited to the amount you paid for the order giving rise to the claim. Some
          jurisdictions do not allow certain limitations, so parts of this section may not apply to you.
        </p>
      </LegalSection>

      <LegalSection heading="13. Changes to these Terms">
        <p>
          We may update these Terms. Changes take effect when posted, and the &ldquo;last updated&rdquo; date above will
          change. Your continued use after a change means you accept the updated Terms.
        </p>
      </LegalSection>

      <LegalSection heading="14. Governing law &amp; disputes">
        <p>
          These Terms are governed by the laws of {COMPANY.governingLaw}, without regard to its conflict-of-law rules.
          The state and federal courts located in Wyoming have exclusive jurisdiction over any dispute, and you consent
          to venue there.
        </p>
        <p>
          If you are a consumer resident outside the United States, this choice of law and venue does not deprive you of
          the protection of mandatory consumer-protection provisions of the country in which you habitually reside, and
          you may also be able to bring proceedings in your local courts.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
