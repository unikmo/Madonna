import type { Metadata } from 'next';
import LegalPageShell, { LegalSection } from '@/components/LegalPageShell';

export const metadata: Metadata = {
  title: 'Privacy Policy | UNIKMO',
  description:
    'How UNIKMO (PlanetHike OÜ) collects, uses, stores and protects personal data, and your rights under the GDPR.',
  alternates: { canonical: 'https://www.unikmo.com/privacy' },
};

const bullet = 'list-disc space-y-1 pl-5 marker:text-[#B38846]/60';

export default function PrivacyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      intro="UNIKMO is operated by PlanetHike OÜ, registered in Tallinn, Estonia. This policy is governed by Estonian law and the EU General Data Protection Regulation (GDPR)."
      updated="September 2026"
    >
      <LegalSection heading="1. Data we collect">
        <p>We collect only what is necessary:</p>
        <ul className={bullet}>
          <li>Email address (for purchase and delivery).</li>
          <li>Order data.</li>
          <li>Uploaded content (your Moment media).</li>
        </ul>
        <p>No accounts and no tracking profiles.</p>
      </LegalSection>

      <LegalSection heading="2. How data is used">
        <p>We use data to:</p>
        <ul className={bullet}>
          <li>Deliver private access codes.</li>
          <li>Store Moments.</li>
          <li>Provide support.</li>
        </ul>
        <p>We do not sell personal data.</p>
      </LegalSection>

      <LegalSection heading="3. Content privacy">
        <ul className={bullet}>
          <li>Moments are private by default.</li>
          <li>Access requires the unique private code.</li>
        </ul>
        <p>We do not view content unless required for support or required by law.</p>
      </LegalSection>

      <LegalSection heading="4. Data storage">
        <ul className={bullet}>
          <li>Media is stored via cloud object storage (for example, Amazon S3).</li>
          <li>Data is stored securely (for example, MongoDB).</li>
        </ul>
        <p>We take reasonable security measures, but no system is 100% secure.</p>
      </LegalSection>

      <LegalSection heading="5. Data retention">
        <p>Moments are stored until user deletion (future feature) or service changes.</p>
        <p>We may remove inactive content after extended periods.</p>
      </LegalSection>

      <LegalSection heading="6. Third parties">
        <p>We use Shopify (payments and orders) and cloud providers (media storage).</p>
        <p>These providers process data under their own policies.</p>
      </LegalSection>

      <LegalSection heading="7. Your rights (GDPR)">
        <p>You can request access to, correction of, and deletion of your personal data.</p>
        <p>
          Contact{' '}
          <a href="mailto:hello@planethike.org" className="underline decoration-[#B38846]/50 underline-offset-4 hover:text-[#B38846]">
            hello@planethike.org
          </a>
          , or use the <a href="/contact" className="underline decoration-[#B38846]/50 underline-offset-4 hover:text-[#B38846]">contact form</a> on this site.
        </p>
      </LegalSection>

      <LegalSection heading="8. Cookies">
        <p>We use minimal cookies for website functionality and analytics (if enabled).</p>
      </LegalSection>

      <LegalSection heading="9. Governing law &amp; supervisory authority">
        <p>
          UNIKMO is operated by PlanetHike OÜ, registered in Tallinn, Estonia. This Privacy Policy is governed by
          Estonian law and the EU General Data Protection Regulation (GDPR).
        </p>
        <p>
          If you believe your data protection rights have been violated, you may lodge a complaint with the Estonian
          Data Protection Inspectorate (Andmekaitse Inspektsioon) or the supervisory authority in your own country of
          residence.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
