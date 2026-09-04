import type { Metadata } from 'next';
import LegalPageShell from '@/components/LegalPageShell';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact | UNIKMO',
  description: 'Get in touch with the UNIKMO team about an order, a lost access code, Curated UNIKMO, or a privacy request.',
  alternates: { canonical: 'https://www.unikmo.com/contact' },
};

export default function ContactPage() {
  return (
    <LegalPageShell
      eyebrow="Get in touch"
      title="Contact"
      intro="Questions about an order, a lost access code, Curated UNIKMO, or a privacy request — send us a message and we'll reply by email."
    >
      <ContactForm />

      <div className="text-[13px] leading-[1.75] text-[#22323A]/70">
        <p>
          You can also email us directly at{' '}
          <a href="mailto:hello@planethike.org" className="underline decoration-[#B38846]/50 underline-offset-4 hover:text-[#B38846]">
            hello@planethike.org
          </a>
          .
        </p>
        <p className="mt-3">
          UNIKMO is a product of PlanetHike OÜ, Järvevana tee 9, 11314 Tallinn, Estonia. Full operator details are on the{' '}
          <a href="/imprint" className="underline decoration-[#B38846]/50 underline-offset-4 hover:text-[#B38846]">
            imprint
          </a>{' '}
          page.
        </p>
      </div>
    </LegalPageShell>
  );
}
