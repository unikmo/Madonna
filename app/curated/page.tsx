import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import CuratedInquiryForm from '@/components/CuratedInquiryForm';

export const metadata: Metadata = {
  title: 'Curated UNIKMO | Keep It, Show It, Share It',
  description:
    'Send us the moments you choose. We professionally curate them into a finished UNIKMO memory, with an optional Times Square Edition and extra physical keepsakes.',
  alternates: { canonical: 'https://www.unikmo.com/curated' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Curated UNIKMO | Keep It, Show It, Share It',
    description:
      'Professional memory curation, an optional Times Square appearance, and additional physical UNIKMO keepsakes.',
    url: 'https://www.unikmo.com/curated',
    siteName: 'UNIKMO',
    images: ['https://www.unikmo.com/og-image.jpg'],
    type: 'website',
  },
};

const choices = [
  {
    number: '01',
    label: 'KEEP IT',
    title: 'Keep It — Curated',
    description:
      'You send the photos, videos and messages you want us to work with. We select, sequence and edit them into one finished memory worth keeping.',
    points: [
      'Professional curation and editing',
      'One completed UNIKMO memory',
      'Digital delivery or 1 personalized physical card',
      'Customer approval before finalization',
    ],
  },
  {
    number: '02',
    label: 'SHOW IT',
    title: 'Show It + Keep It',
    subtitle: 'Times Square Edition',
    description:
      'Take the finished moment public. We prepare the Times Square creative, coordinate the appearance, capture it, and incorporate that public moment into the finished UNIKMO memory.',
    points: [
      'Everything in Curated',
      'Times Square creative preparation',
      'Times Square appearance, subject to availability',
      'Display capture incorporated into the finished memory',
    ],
  },
  {
    number: '03',
    label: 'SHARE IT',
    title: 'Extra Keepsakes',
    description:
      'Give the same finished curated memory to family, friends, colleagues or employees who were part of it.',
    points: [
      '$12 per additional physical UNIKMO card',
      '3 additional cards = $36',
      'Same finished curated memory',
      'Larger quantities can be requested in the brief',
    ],
  },
] as const;

const faqs = [
  {
    question: 'What is Curated UNIKMO?',
    answer:
      'Curated UNIKMO is an optional concierge service. You intentionally send UNIKMO the photos, videos and messages you want professionally assembled into one finished memory.',
  },
  {
    question: 'What is the Times Square Edition?',
    answer:
      'Times Square Edition adds a public Times Square appearance to the curated service. The appearance is captured and incorporated into the finished UNIKMO memory, subject to scheduling and availability.',
  },
  {
    question: 'Can Curated UNIKMO be delivered digitally?',
    answer:
      'Yes. The curated experience can be requested with digital delivery or with a personalized physical UNIKMO card.',
  },
  {
    question: 'How much are extra Curated UNIKMO cards?',
    answer:
      'Additional physical keepsake cards for the same finished curated memory are $12 each. Three additional cards are $36.',
  },
  {
    question: 'Does Curated UNIKMO change the standard private UNIKMO experience?',
    answer:
      'No. Standard UNIKMO remains a self-created experience. Curated UNIKMO is optional and only uses the materials you intentionally submit for curation.',
  },
];

export default function CuratedPage() {
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://www.unikmo.com/curated#webpage',
    url: 'https://www.unikmo.com/curated',
    name: 'Curated UNIKMO',
    description:
      'An optional UNIKMO concierge service for professional memory curation, a Times Square Edition, and additional physical keepsakes.',
    isPartOf: { '@id': 'https://www.unikmo.com/#website' },
    about: { '@id': 'https://www.unikmo.com/#brand' },
    inLanguage: 'en',
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': 'https://www.unikmo.com/curated#service',
    name: 'Curated UNIKMO',
    serviceType: 'Professional memory curation and keepsake delivery',
    provider: { '@id': 'https://www.unikmo.com/#organization' },
    url: 'https://www.unikmo.com/curated',
    description:
      'Customers intentionally submit selected photos, videos and messages for professional curation into a finished UNIKMO memory, with an optional Times Square Edition and additional physical keepsakes.',
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': 'https://www.unikmo.com/curated#faq',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <div className="min-h-screen bg-[#FCF9F4] text-[#22323A]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="sticky top-0 z-40 border-b border-[#22323A]/[0.07] bg-[#FCF9F4]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1240px] items-center px-5 sm:px-8">
          <Link href="/" aria-label="UNIKMO home">
            <Image src="/unikmo-logo-header.png" alt="UNIKMO — The Key to Your Memory" width={729} height={220} priority className="h-8 w-auto sm:h-9" />
          </Link>
          <nav className="ml-auto hidden items-center gap-7 text-[11px] text-[#22323A]/65 md:flex">
            <Link href="/how-unikmo-works" className="hover:text-[#B38846]">How it works</Link>
            <Link href="/faq" className="hover:text-[#B38846]">FAQ</Link>
          </nav>
          <a href="#brief" className="ml-auto rounded-lg bg-[#B38846] px-5 py-3 text-[11px] font-medium text-white transition hover:bg-[#9D773D] md:ml-8">Start Curated</a>
        </div>
      </header>

      <main>
        <section className="px-5 pb-14 pt-14 sm:px-8 sm:pb-16 sm:pt-18 lg:pt-20">
          <div className="mx-auto grid max-w-[1120px] items-center gap-10 lg:grid-cols-[1fr_.9fr] lg:gap-14">
            <div className="text-center lg:text-left">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B38846]">Curated UNIKMO</p>
              <h1 className="mt-4 font-serif text-[39px] leading-[1.04] tracking-[-0.025em] sm:text-[50px] lg:text-[58px]">You bring the moments. We make the memory.</h1>
              <p className="mt-5 max-w-[670px] text-[15px] leading-[1.75] text-[#22323A]/68 sm:text-[17px]">
                Send us the photos, videos and messages you choose. We professionally assemble them into one finished UNIKMO memory — then you decide whether to keep it private, show it in Times Square, or share extra keepsakes.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start">
                <a href="#brief" className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-[#B38846] px-7 text-[11px] font-medium text-white transition hover:bg-[#9D773D]">Start Curated</a>
                <a href="#choices" className="inline-flex min-h-[44px] items-center text-[11px] font-medium text-[#22323A]/70 underline decoration-[#B38846]/50 underline-offset-4">See the three choices</a>
              </div>
              <p className="mt-5 text-[11px] leading-[1.6] text-[#22323A]/45">Curated is optional. Standard UNIKMO remains self-created and private by design.</p>
            </div>

            <div className="rounded-[24px] border border-[#22323A]/[0.07] bg-[radial-gradient(circle_at_50%_30%,#FFFDF9_0%,#F3EAE0_58%,#E6D9CC_100%)] p-6 shadow-[0_22px_60px_rgba(34,50,58,.09)] sm:p-8">
              <div className="relative aspect-[1.48/1] overflow-hidden rounded-[12px] border border-white/60 bg-[#F8F2EA] shadow-[0_24px_48px_rgba(40,30,20,.16)]">
                <Image src="/card-front.png" alt="UNIKMO physical keepsake card" fill className="object-cover" sizes="(max-width:1024px) 86vw, 480px" />
              </div>
              <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                {[
                  ['KEEP', 'Curate'],
                  ['SHOW', 'Times Square'],
                  ['SHARE', '$12 each'],
                ].map(([label, text]) => (
                  <div key={label} className="rounded-[12px] border border-[#22323A]/[0.07] bg-[#FCF9F4]/75 px-2 py-4">
                    <p className="text-[9px] font-semibold tracking-[0.18em] text-[#B38846]">{label}</p>
                    <p className="mt-1 text-[11px] text-[#22323A]/62">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="choices" className="border-y border-[#22323A]/[0.06] bg-[#F8F2EB] px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-[1120px]">
            <div className="mx-auto max-w-[720px] text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B38846]">Keep it. Show it. Share it.</p>
              <h2 className="mt-3 font-serif text-[32px] sm:text-[42px]">One memory. Three ways to take it further.</h2>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {choices.map((choice) => (
                <article key={choice.number} className="rounded-[20px] border border-[#22323A]/[0.08] bg-[#FCF9F4] p-7 shadow-[0_14px_38px_rgba(34,50,58,.04)]">
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#B38846]/40 text-[10px] font-semibold text-[#B38846]">{choice.number}</span>
                    <span className="text-[9px] font-semibold tracking-[0.2em] text-[#B38846]">{choice.label}</span>
                  </div>
                  <h3 className="mt-5 font-serif text-[27px] leading-[1.12]">{choice.title}</h3>
                  {'subtitle' in choice && choice.subtitle ? <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[#B38846]">{choice.subtitle}</p> : null}
                  <p className="mt-4 text-[13px] leading-[1.7] text-[#22323A]/62">{choice.description}</p>
                  <ul className="mt-6 space-y-3 border-t border-[#22323A]/[0.07] pt-5">
                    {choice.points.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-[12px] leading-[1.55] text-[#22323A]/65">
                        <span className="mt-[2px] flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full border border-[#B38846]/45 text-[10px] font-semibold text-[#B38846]">✓</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-[980px]">
            <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B38846]">Times Square Edition</p>
              <h2 className="mt-3 font-serif text-[32px] sm:text-[42px]">POP. Go public. Keep it.</h2>
              <p className="mx-auto mt-4 max-w-[700px] text-[14px] leading-[1.75] text-[#22323A]/62 sm:text-[15px]">
                The public moment can begin with your own POP — confetti, a cork, a team cheer or another celebration burst. We curate the submitted material, the Times Square appearance and its capture into the finished memory.
              </p>
            </div>

            <div className="mt-10 grid overflow-hidden rounded-[20px] border border-[#22323A]/[0.08] bg-[#22323A] text-white md:grid-cols-3">
              {[
                ['POP', 'Capture the celebration in your own way.'],
                ['TIMES SQUARE', 'Take the finished moment public.'],
                ['UNIKMO', 'Preserve the public moment inside the curated memory.'],
              ].map(([title, copy], index) => (
                <div key={title} className={`p-8 text-center ${index ? 'border-t border-white/10 md:border-l md:border-t-0' : ''}`}>
                  <p className="text-[10px] font-semibold tracking-[0.22em] text-[#D7B77C]">{title}</p>
                  <p className="mx-auto mt-3 max-w-[240px] text-[13px] leading-[1.65] text-white/62">{copy}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-[10px] leading-[1.6] text-[#22323A]/45">Times Square scheduling and capture are confirmed during the concierge brief before files are submitted.</p>
          </div>
        </section>

        <section className="border-y border-[#22323A]/[0.06] bg-[#F8F2EB] px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-[920px]">
            <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B38846]">Digital or physical</p>
              <h2 className="mt-3 font-serif text-[32px] sm:text-[42px]">Choose how the finished memory arrives.</h2>
            </div>
            <div className="mt-9 grid gap-5 md:grid-cols-2">
              <article className="rounded-[20px] border border-[#22323A]/[0.08] bg-[#FCF9F4] p-7 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#B38846]">Digital delivery</p>
                <h3 className="mt-3 font-serif text-[27px]">Fast and easy to send.</h3>
                <p className="mx-auto mt-3 max-w-[350px] text-[13px] leading-[1.7] text-[#22323A]/62">Choose digital delivery when the finished curated memory needs to reach someone without a physical card.</p>
              </article>
              <article className="rounded-[20px] border border-[#22323A]/[0.08] bg-[#FCF9F4] p-7 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#B38846]">Physical delivery</p>
                <h3 className="mt-3 font-serif text-[27px]">A memory they can hold.</h3>
                <p className="mx-auto mt-3 max-w-[350px] text-[13px] leading-[1.7] text-[#22323A]/62">Receive a personalized UNIKMO card, then add extra physical keepsakes for $12 each when more people should have the same finished memory.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="brief" className="px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-[900px]">
            <div className="mx-auto max-w-[680px] text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B38846]">Start with a short brief</p>
              <h2 className="mt-3 font-serif text-[32px] sm:text-[42px]">Tell us how far you want to take it.</h2>
              <p className="mx-auto mt-4 max-w-[620px] text-[13px] leading-[1.7] text-[#22323A]/60 sm:text-[14px]">No files and no payment yet. Choose the experience and delivery you have in mind. We confirm scope, timing and price first.</p>
            </div>
            <div className="mt-9"><CuratedInquiryForm /></div>
          </div>
        </section>

        <section className="border-t border-[#22323A]/[0.06] bg-[#F8F2EB] px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-[900px]">
            <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B38846]">Clear distinction</p>
              <h2 className="mt-3 font-serif text-[32px] sm:text-[42px]">Curated when you want help. Standard when you do not.</h2>
              <p className="mx-auto mt-4 max-w-[680px] text-[14px] leading-[1.75] text-[#22323A]/62">With standard UNIKMO, you create the private memory yourself. With Curated UNIKMO, you intentionally submit selected materials for us to assemble into the finished story.</p>
              <Link href="/#shop" className="mt-7 inline-flex min-h-[46px] items-center justify-center text-[11px] font-medium text-[#22323A] underline decoration-[#B38846]/55 underline-offset-4">Choose standard UNIKMO instead</Link>
            </div>

            <div className="mt-10 divide-y divide-[#22323A]/[0.08] border-y border-[#22323A]/[0.08]">
              {faqs.map((faq) => (
                <details key={faq.question} className="group py-1">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-serif text-[20px] leading-[1.25] sm:text-[22px]">
                    {faq.question}
                    <span className="shrink-0 text-[#B38846] transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="max-w-[760px] pb-6 pr-10 text-[14px] leading-[1.75] text-[#22323A]/66 sm:text-[15px]">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#22323A]/[0.08] bg-[#FCF9F4] py-8">
        <div className="mx-auto flex max-w-[1080px] flex-col items-center justify-between gap-4 px-5 text-center sm:flex-row sm:px-8 sm:text-left">
          <Image src="/unikmo-logo-header.png" alt="UNIKMO" width={729} height={220} className="h-8 w-auto" />
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.14em] text-[#22323A]/48">
            <Link href="/">UNIKMO</Link>
            <Link href="/how-unikmo-works">How it works</Link>
            <Link href="/faq">FAQ</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
