import type { Metadata } from 'next';
import LegalPageShell, { LegalSection } from '@/components/LegalPageShell';
import { COMPANY } from '@/lib/company';

export const metadata: Metadata = {
  title: 'Legal Notice | UNIKMO',
  description: `Company and contact information for UNIKMO, operated by ${COMPANY.legalName} (Wyoming, USA). Also serves as the imprint for visitors in the EU/EEA.`,
  alternates: { canonical: 'https://www.unikmo.com/imprint' },
};

const rows: Array<[string, React.ReactNode]> = [
  ['Company', COMPANY.legalName],
  ['Entity type', 'Limited Liability Company (LLC)'],
  ['Product', COMPANY.product],
  ['State of formation', `${COMPANY.formationState}, ${COMPANY.formationCountry}`],
  ['Wyoming Secretary of State filing ID', COMPANY.filingId],
  ['Principal / mailing address', COMPANY.addressOneLine],
  ['Registered agent', COMPANY.registeredAgent],
  ['Represented by', COMPANY.founder],
  [
    'Email',
    <a key="e" href={`mailto:${COMPANY.email}`} className="underline decoration-[#B38846]/50 underline-offset-4 hover:text-[#B38846]">
      {COMPANY.email}
    </a>,
  ],
];

export default function LegalNoticePage() {
  return (
    <LegalPageShell
      title="Legal Notice"
      intro={`UNIKMO is a product of ${COMPANY.legalName}, a Wyoming limited liability company. This page also serves as the imprint (Impressum) for visitors in the EU/EEA.`}
    >
      <LegalSection heading="Company information">
        <dl className="divide-y divide-[#22323A]/[0.08] border-y border-[#22323A]/[0.08]">
          {rows.map(([label, value]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[260px_1fr] sm:gap-4">
              <dt className="text-[13px] font-medium text-[#22323A]">{label}</dt>
              <dd className="text-[13px] text-[#22323A]/75">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="text-[13px] text-[#22323A]/70">
          For all enquiries — orders, a lost access code, Curated UNIKMO, press, or a data request — email{' '}
          <a href={`mailto:${COMPANY.email}`} className="underline decoration-[#B38846]/50 underline-offset-4 hover:text-[#B38846]">
            {COMPANY.email}
          </a>{' '}
          or use the <a href="/contact" className="underline decoration-[#B38846]/50 underline-offset-4 hover:text-[#B38846]">contact form</a>.
        </p>
      </LegalSection>

      <LegalSection heading="EU/EEA online dispute resolution">
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
          . We are not obliged, and are not generally willing, to participate in dispute resolution proceedings before a
          consumer arbitration board.
        </p>
      </LegalSection>

      <LegalSection heading="Liability for content and links">
        <p>
          The content of this website was prepared with care. We make no warranty as to its accuracy, completeness or
          timeliness. This site contains links to external websites over whose content we have no control; responsibility
          for that content lies with the respective operator.
        </p>
      </LegalSection>

      <LegalSection heading="Related">
        <p>
          See our{' '}
          <a href="/privacy" className="underline decoration-[#B38846]/50 underline-offset-4 hover:text-[#B38846]">Privacy Policy</a>,{' '}
          <a href="/cookies" className="underline decoration-[#B38846]/50 underline-offset-4 hover:text-[#B38846]">Cookie Policy</a> and{' '}
          <a href="/terms" className="underline decoration-[#B38846]/50 underline-offset-4 hover:text-[#B38846]">Terms &amp; Conditions</a>.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
