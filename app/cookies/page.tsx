import type { Metadata } from 'next';
import LegalPageShell, { LegalSection } from '@/components/LegalPageShell';
import { COMPANY } from '@/lib/company';

export const metadata: Metadata = {
  title: 'Cookie Policy | UNIKMO',
  description:
    'Which cookies UNIKMO uses, why, the legal basis under the GDPR and ePrivacy rules, and how to control them.',
  alternates: { canonical: 'https://www.unikmo.com/cookies' },
};

const bullet = 'list-disc space-y-1 pl-5 marker:text-[#B38846]/60';
const link = 'underline decoration-[#B38846]/50 underline-offset-4 hover:text-[#B38846]';

const categories: Array<{ name: string; consent: string; copy: string }> = [
  {
    name: 'Strictly necessary',
    consent: 'No consent required',
    copy: 'Needed to load the site, keep it secure, and carry your basket through to checkout. The site does not work properly without them.',
  },
  {
    name: 'Preferences / functional',
    consent: 'Consent required',
    copy: 'Would remember choices such as a dismissed banner. Not currently used.',
  },
  {
    name: 'Analytics',
    consent: 'No consent required (cookieless)',
    copy: 'We use Vercel Web Analytics to count page views and see which sites send us traffic. It sets no cookies and stores no identifier on your device, so it does not require consent. No other analytics tools are used.',
  },
  {
    name: 'Marketing',
    consent: 'Consent required',
    copy: 'Would support advertising or retargeting. Not currently used.',
  },
];

export default function CookiePolicyPage() {
  return (
    <LegalPageShell
      title="Cookie Policy"
      intro="This policy explains the cookies and similar technologies used on unikmo.com, why we use them, and how you can control them. It should be read alongside our Privacy Policy."
      updated="September 2026"
    >
      <LegalSection heading="1. What cookies are">
        <p>
          Cookies are small text files placed on your device when you visit a website. &ldquo;Similar technologies&rdquo;
          includes local storage and pixels. They can be set by the site you are visiting (first-party) or by another
          provider (third-party), and can last for a single session or persist for a set period.
        </p>
      </LegalSection>

      <LegalSection heading="2. What we currently use">
        <p>
          On unikmo.com itself we use <span className="font-medium text-[#22323A]">only strictly necessary cookies and
          equivalent local storage</span>. These keep the site running and let you complete a purchase.
        </p>
        <p>
          For traffic measurement we use <span className="font-medium text-[#22323A]">Vercel Web Analytics</span>, a
          privacy-friendly, <span className="font-medium text-[#22323A]">cookieless</span> tool. It records aggregate page
          views and referring sites. It does not set cookies, does not store any identifier on your device, does not track
          you across other websites, and is not used for advertising. Because it does not store or read information on your
          device, it does not require a consent banner.
        </p>
        <p>
          We do <span className="font-medium text-[#22323A]">not</span> use advertising, retargeting or marketing cookies.
        </p>
        <p>
          Checkout and payment take place on Shopify. When you proceed to checkout, Shopify sets its own strictly
          necessary cookies to process the order securely and prevent fraud, under Shopify&rsquo;s own cookie and privacy
          notices.
        </p>
      </LegalSection>

      <LegalSection heading="3. Cookie categories">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#22323A]/[0.12] text-[11px] uppercase tracking-[0.1em] text-[#22323A]/55">
                <th className="py-2 pr-4 font-medium">Category</th>
                <th className="py-2 pr-4 font-medium">Consent</th>
                <th className="py-2 font-medium">What it is for</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.name} className="border-b border-[#22323A]/[0.08] align-top">
                  <td className="py-3 pr-4 font-medium text-[#22323A]">{c.name}</td>
                  <td className="py-3 pr-4 text-[#22323A]/70">{c.consent}</td>
                  <td className="py-3 text-[#22323A]/70">{c.copy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection heading="4. Legal basis">
        <ul className={bullet}>
          <li>
            <span className="font-medium text-[#22323A]">Strictly necessary cookies</span> are exempt from the consent
            requirement under the EU ePrivacy rules because they are essential to provide a service you have requested.
          </li>
          <li>
            <span className="font-medium text-[#22323A]">Cookieless analytics</span> (Vercel Web Analytics) does not store
            or access information on your device, so the ePrivacy consent requirement does not apply. The limited
            aggregate data it produces is processed on the basis of our legitimate interest in understanding and
            improving the site (GDPR Art. 6(1)(f)); you can object at any time by contacting us.
          </li>
          <li>
            <span className="font-medium text-[#22323A]">Preferences and marketing cookies</span> would only be set with
            your prior consent (GDPR Art. 6(1)(a) and the ePrivacy Directive as implemented in your country). Because we
            do not use them, no consent banner is shown.
          </li>
        </ul>
        <p>
          If we introduce cookies or similar technologies that are not strictly necessary, we will first present a consent
          banner that lets you accept or reject each category before any such technology is used, and update this policy
          with the specific cookies, providers and durations.
        </p>
      </LegalSection>

      <LegalSection heading="5. How to control cookies">
        <ul className={bullet}>
          <li>
            Most browsers let you block or delete cookies and local storage in their settings. Blocking strictly
            necessary cookies may stop parts of the site or checkout from working.
          </li>
          <li>
            You can manage Shopify checkout cookies from the checkout page and through your browser.
          </li>
          <li>
            General guidance is available at{' '}
            <a href="https://www.aboutcookies.org" target="_blank" rel="noreferrer" className={link}>aboutcookies.org</a>.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="6. Contact">
        <p>
          Questions about this policy: email{' '}
          <a href={`mailto:${COMPANY.email}`} className={link}>{COMPANY.email}</a>. The controller is {COMPANY.legalName},{' '}
          {COMPANY.addressOneLine}. See also our{' '}
          <a href="/privacy" className={link}>Privacy Policy</a>.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
