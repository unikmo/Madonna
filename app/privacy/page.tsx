import type { Metadata } from 'next';
import LegalPageShell, { LegalSection } from '@/components/LegalPageShell';
import { COMPANY } from '@/lib/company';

export const metadata: Metadata = {
  title: 'Privacy Policy | UNIKMO',
  description:
    'How UNIKMO collects, uses, stores and protects personal information, and your rights under US state privacy laws and the GDPR.',
  alternates: { canonical: 'https://www.unikmo.com/privacy' },
};

const bullet = 'list-disc space-y-1 pl-5 marker:text-[#B38846]/60';
const link = 'underline decoration-[#B38846]/50 underline-offset-4 hover:text-[#B38846]';

export default function PrivacyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      intro={`UNIKMO is operated by ${COMPANY.legalName}, a Wyoming (USA) limited liability company ("UNIKMO", "we", "us"). This policy explains what personal information we handle and the choices you have. It applies to unikmo.com and the connected upload and unlock pages.`}
      updated="September 2026"
    >
      <LegalSection heading="1. Who is responsible">
        <p>
          The controller / business responsible for your personal information is {COMPANY.legalName},{' '}
          {COMPANY.addressOneLine}. Contact:{' '}
          <a href={`mailto:${COMPANY.email}`} className={link}>{COMPANY.email}</a> or the{' '}
          <a href="/contact" className={link}>contact form</a>.
        </p>
      </LegalSection>

      <LegalSection heading="2. Information we collect">
        <p>We collect only what is necessary to provide the product:</p>
        <ul className={bullet}>
          <li>Contact and order data — your email address and the details of your order.</li>
          <li>Content you upload — the video, audio, photo or written message you attach to a Moment.</li>
          <li>
            Support messages — anything you send us through the contact form or by email.
          </li>
          <li>
            Basic technical data — standard server logs and strictly necessary cookies needed to run the site and
            checkout (see our <a href="/cookies" className={link}>Cookie Policy</a>).
          </li>
        </ul>
        <p>No accounts are required, and we do not build advertising or tracking profiles.</p>
      </LegalSection>

      <LegalSection heading="3. How we use information">
        <ul className={bullet}>
          <li>To process your order and deliver private access codes and Moments.</li>
          <li>To store your Moment so the recipient can open it.</li>
          <li>To provide customer support and respond to your requests.</li>
          <li>To operate, secure and improve the website.</li>
          <li>To comply with legal obligations and enforce our Terms.</li>
        </ul>
        <p>
          For visitors in the EEA/UK, our legal bases are performance of a contract (processing your order), our
          legitimate interests (running and securing the site), consent (any non-essential cookies), and legal
          obligation.
        </p>
        <p>We do not sell your personal information, and we do not share it for cross-context behavioural advertising.</p>
      </LegalSection>

      <LegalSection heading="4. Content privacy">
        <ul className={bullet}>
          <li>Moments are private by default.</li>
          <li>Access requires the unique private code, which only you control and share.</li>
        </ul>
        <p>We do not view uploaded content except where necessary for support, security, or where required by law.</p>
      </LegalSection>

      <LegalSection heading="5. Service providers">
        <p>We share personal information only with providers that help us run UNIKMO, under contract and on our instructions:</p>
        <ul className={bullet}>
          <li>Shopify — checkout, payments and order management.</li>
          <li>Cloud object storage (e.g. Amazon Web Services / S3) — hosting of uploaded Moment media.</li>
          <li>Database hosting (e.g. MongoDB) — order and Moment records.</li>
          <li>Email delivery — sending access codes and support replies.</li>
          <li>Hosting / CDN — serving the website.</li>
        </ul>
        <p>These providers process data under their own terms and safeguards. We do not sell data to anyone.</p>
      </LegalSection>

      <LegalSection heading="6. International transfers">
        <p>
          We are based in the United States and our providers may process data in the US and other countries. Where we
          transfer personal information out of the EEA or UK, we rely on appropriate safeguards such as the European
          Commission&rsquo;s Standard Contractual Clauses.
        </p>
      </LegalSection>

      <LegalSection heading="7. Data retention">
        <p>
          We keep order records for as long as needed for the service, accounting and legal purposes. Moment media is
          stored so the recipient can access it, and until you ask us to delete it or the service materially changes. We
          may remove inactive content after extended periods.
        </p>
      </LegalSection>

      <LegalSection heading="8. Security">
        <p>
          We take reasonable technical and organisational measures to protect personal information. No method of
          transmission or storage is completely secure, and we cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection heading="9. Your rights — EEA / UK (GDPR)">
        <p>If you are in the EEA or UK, you have the right to:</p>
        <ul className={bullet}>
          <li>access the personal data we hold about you;</li>
          <li>have inaccurate data corrected;</li>
          <li>have your data deleted;</li>
          <li>restrict or object to certain processing;</li>
          <li>data portability;</li>
          <li>withdraw consent at any time (without affecting prior processing).</li>
        </ul>
        <p>
          To exercise these rights, email <a href={`mailto:${COMPANY.email}`} className={link}>{COMPANY.email}</a>. You
          also have the right to lodge a complaint with your local data protection authority.
        </p>
      </LegalSection>

      <LegalSection heading="10. Your rights — California (CCPA/CPRA)">
        <p>
          California residents have the right to know what personal information we collect and how we use it, to request
          access to or deletion of that information, to request correction, and not to be discriminated against for
          exercising these rights.
        </p>
        <p>
          We do not &ldquo;sell&rdquo; personal information and do not &ldquo;share&rdquo; it for cross-context behavioural
          advertising as those terms are defined under California law. To make a request, email{' '}
          <a href={`mailto:${COMPANY.email}`} className={link}>{COMPANY.email}</a>. We will verify your request using the
          email associated with your order.
        </p>
      </LegalSection>

      <LegalSection heading="11. Children">
        <p>
          UNIKMO is intended for adults. It is not directed to children under 13 (or under 16 in the EEA/UK), and we do
          not knowingly collect their personal information. If you believe a child has provided us information, contact us
          and we will delete it.
        </p>
      </LegalSection>

      <LegalSection heading="12. Cookies">
        <p>
          We use only strictly necessary cookies to run the site and checkout. If we add analytics or marketing cookies
          in future, we will ask for your consent first. Details are in our{' '}
          <a href="/cookies" className={link}>Cookie Policy</a>.
        </p>
      </LegalSection>

      <LegalSection heading="13. Changes to this policy">
        <p>
          We may update this policy from time to time. Material changes will be reflected by the &ldquo;last updated&rdquo;
          date above.
        </p>
      </LegalSection>

      <LegalSection heading="14. Governing law">
        <p>
          This policy and any dispute relating to it are governed by the laws of {COMPANY.governingLaw}, without regard to
          conflict-of-law rules, and subject to the mandatory data protection and consumer laws that apply to you as a
          resident of your own country or state.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
