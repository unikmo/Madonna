import type { Metadata } from 'next';
import LegalPageShell, { LegalSection } from '@/components/LegalPageShell';

export const metadata: Metadata = {
  title: 'Imprint | UNIKMO',
  description: 'Operator information for UNIKMO, a product of PlanetHike OÜ, Tallinn, Estonia.',
  alternates: { canonical: 'https://www.unikmo.com/imprint' },
};

const rows: Array<[string, React.ReactNode]> = [
  ['Company name', 'PlanetHike OÜ'],
  ['Product', 'UNIKMO'],
  ['Registered office', 'Järvevana tee 9, 11314 Tallinn, Estonia'],
  ['Registration number', '80656111'],
  ['Legal representative / founder', 'Tichi Mbanwie'],
  [
    'Email',
    <a key="e" href="mailto:hello@planethike.org" className="underline decoration-[#B38846]/50 underline-offset-4 hover:text-[#B38846]">
      hello@planethike.org
    </a>,
  ],
  [
    'Phone',
    <a key="p" href="tel:+491634668380" className="underline decoration-[#B38846]/50 underline-offset-4 hover:text-[#B38846]">
      +49 (0)163 4668380
    </a>,
  ],
];

export default function ImprintPage() {
  return (
    <LegalPageShell title="Imprint" intro="Information in accordance with applicable disclosure requirements.">
      <LegalSection heading="Operator information">
        <dl className="divide-y divide-[#22323A]/[0.08] border-y border-[#22323A]/[0.08]">
          {rows.map(([label, value]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[220px_1fr] sm:gap-4">
              <dt className="text-[13px] font-medium text-[#22323A]">{label}</dt>
              <dd className="text-[13px] text-[#22323A]/75">{value}</dd>
            </div>
          ))}
        </dl>
      </LegalSection>

      <LegalSection heading="Online dispute resolution">
        <p>
          The European Commission provides a platform for online dispute resolution (ODR) at{' '}
          <a
            href="https://ec.europa.eu/consumers/odr"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-[#B38846]/50 underline-offset-4 hover:text-[#B38846]"
          >
            ec.europa.eu/consumers/odr
          </a>
          . We are not obliged and generally not willing to participate in dispute resolution proceedings before a
          consumer arbitration board.
        </p>
      </LegalSection>

      <LegalSection heading="Liability for content and links">
        <p>
          The contents of this website were created with the greatest possible care. We accept no liability for the
          accuracy, completeness or timeliness of the content. Our site contains links to external websites over whose
          content we have no influence; responsibility for that content always lies with the respective provider or
          operator.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
