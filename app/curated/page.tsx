import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import CuratedCheckout from '@/components/CuratedCheckout';
import TimesSquareRotator from '@/components/TimesSquareRotator';
import { CURATED_PRODUCTS, curatedBuyUrl } from '@/lib/curated-products';

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
    image: '/curated/curated-card.webp',
    imageAlt: 'A finished UNIKMO keepsake card beside printed photos',
    price: `$${CURATED_PRODUCTS.KEEP_IT.price}`,
    priceNote: 'Physical or digital delivery',
    href: curatedBuyUrl(CURATED_PRODUCTS.KEEP_IT.variants.physical.id),
    cta: 'Buy Keep It',
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
    image: '/curated/ts-ny.webp',
    imageAlt: 'A UNIKMO card held up in front of a Times Square billboard',
    price: `$${CURATED_PRODUCTS.SHOW_IT.price}`,
    priceNote: 'Everything in Keep It, plus Times Square',
    href: curatedBuyUrl(CURATED_PRODUCTS.SHOW_IT.variants.physical.id),
    cta: 'Buy Show It',
    description:
      'Take the finished moment public. We prepare the Times Square creative, coordinate the appearance, capture it, and incorporate that public moment into the finished UNIKMO memory.',
    points: [
      'Everything in Keep It — Curated',
      'Times Square creative preparation',
      'Times Square appearance, subject to availability',
      'Display capture incorporated into the finished memory',
    ],
  },
  {
    number: '03',
    label: 'SHARE IT',
    title: 'Extra Keepsakes',
    image: '/curated/curated-manycards.webp',
    imageAlt: 'Four people holding matching UNIKMO keepsake cards',
    price: `$${CURATED_PRODUCTS.EXTRA_KEEPSAKES.pricePerCard} each`,
    priceNote: 'Add any quantity at checkout',
    href: curatedBuyUrl(CURATED_PRODUCTS.EXTRA_KEEPSAKES.variants.standard.id),
    cta: 'Buy an extra card',
    description:
      'Give the same finished curated memory to family, friends, colleagues or employees who were part of it.',
    points: [
      '$12 per additional physical UNIKMO card',
      'Same finished curated memory',
      'Add several during checkout',
      'Larger quantities can be requested after ordering',
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
    question: 'How much does Curated UNIKMO cost?',
    answer:
      'Keep It — Curated is $199. Show It — Times Square Edition is $399 and includes everything in Keep It plus the Times Square appearance and its capture. Additional physical keepsake cards are $12 each and can be added at checkout. Prices are in USD.',
  },
  {
    question: 'What is the Times Square Edition?',
    answer:
      'Times Square Edition adds a public Times Square appearance to the curated service. The appearance is captured and incorporated into the finished UNIKMO memory, subject to scheduling and availability.',
  },
  {
    question: 'Can Curated UNIKMO be delivered digitally?',
    answer:
      'Yes. Choose digital delivery or a personalized physical UNIKMO card at checkout — the price is the same either way.',
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
    offers: [
      { '@type': 'Offer', name: 'Keep It — Curated', price: String(CURATED_PRODUCTS.KEEP_IT.price), priceCurrency: 'USD' },
      { '@type': 'Offer', name: 'Show It — Times Square Edition', price: String(CURATED_PRODUCTS.SHOW_IT.price), priceCurrency: 'USD' },
      { '@type': 'Offer', name: 'Extra Keepsake Card', price: String(CURATED_PRODUCTS.EXTRA_KEEPSAKES.pricePerCard), priceCurrency: 'USD' },
    ],
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
          <a href="#order" className="ml-auto rounded-lg bg-[#B38846] px-5 py-3 text-[11px] font-medium text-white transition hover:bg-[#9D773D] md:ml-8">Start Curated</a>
        </div>
      </header>

      <main>
        <section className="px-5 pb-14 pt-12 text-center sm:px-8 sm:pb-16 sm:pt-16 lg:pt-20">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B38846]">Curated UNIKMO</p>
          <h1 className="mx-auto mt-4 max-w-[980px] font-serif text-[39px] leading-[1.03] tracking-[-0.025em] sm:text-[52px] lg:text-[62px]">
            You bring the moments. We make the memory.
          </h1>

          <div className="mx-auto mt-9 grid max-w-[1180px] gap-5 lg:grid-cols-2">
            <TimesSquareRotator className="aspect-[3/2] overflow-hidden rounded-[24px] border border-[#22323A]/[0.06] bg-[#EDE4D8]" />
            <div className="relative aspect-[3/2] overflow-hidden rounded-[24px] border border-[#22323A]/[0.06] bg-[#EDE4D8]">
              <Image
                src="/curated/curated-card.webp"
                alt="A finished UNIKMO keepsake card beside printed photos"
                fill
                priority
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
            </div>
          </div>

          <p className="mx-auto mt-7 max-w-[820px] text-[15px] leading-[1.75] text-[#22323A]/68 sm:text-[17px]">
            Send us the photos, videos and messages you choose. We professionally assemble them into one finished
            UNIKMO memory — then you decide whether to keep it private, show it in Times Square, or share extra
            keepsakes.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <a href="#order" className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-[#B38846] px-7 text-[11px] font-medium text-white transition hover:bg-[#9D773D]">Start Curated</a>
            <a href="#choices" className="inline-flex min-h-[44px] items-center text-[11px] font-medium text-[#22323A]/70 underline decoration-[#B38846]/50 underline-offset-4">See the three choices</a>
          </div>
          <p className="mt-5 text-[11px] leading-[1.6] text-[#22323A]/45">Curated is optional. Standard UNIKMO remains self-created and private by design.</p>
        </section>

        <section id="choices" className="border-y border-[#22323A]/[0.06] bg-[#F8F2EB] px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-[1120px]">
            <div className="mx-auto max-w-[720px] text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B38846]">Keep it. Show it. Share it.</p>
              <h2 className="mt-3 font-serif text-[32px] sm:text-[42px]">One memory. Three ways to take it further.</h2>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {choices.map((choice) => (
                <article key={choice.number} className="flex flex-col overflow-hidden rounded-[20px] border border-[#22323A]/[0.08] bg-[#FCF9F4] shadow-[0_14px_38px_rgba(34,50,58,.04)]">
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#EDE4D8]">
                    <Image src={choice.image} alt={choice.imageAlt} fill className="object-cover" sizes="(max-width:1024px) 100vw, 360px" />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#B38846]/40 text-[10px] font-semibold text-[#B38846]">{choice.number}</span>
                      <span className="text-[9px] font-semibold tracking-[0.2em] text-[#B38846]">{choice.label}</span>
                    </div>
                    <h3 className="mt-5 font-serif text-[27px] leading-[1.12]">{choice.title}</h3>
                    {'subtitle' in choice && choice.subtitle ? <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[#B38846]">{choice.subtitle}</p> : null}
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="font-serif text-[26px] leading-none">{choice.price}</span>
                      <span className="text-[11px] text-[#22323A]/50">{choice.priceNote}</span>
                    </div>
                    <p className="mt-4 text-[13px] leading-[1.7] text-[#22323A]/62">{choice.description}</p>
                    <ul className="mt-6 space-y-3 border-t border-[#22323A]/[0.07] pt-5">
                      {choice.points.map((point) => (
                        <li key={point} className="flex items-start gap-3 text-[12px] leading-[1.55] text-[#22323A]/65">
                          <span className="mt-[2px] flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full border border-[#B38846]/45 text-[10px] font-semibold text-[#B38846]">✓</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex flex-1 flex-col justify-end gap-3 pt-1">
                      <a href={choice.href} className="inline-flex min-h-[46px] items-center justify-center rounded-lg bg-[#B38846] px-6 text-[11px] font-medium text-white transition hover:bg-[#9D773D]">{choice.cta}</a>
                      <a href="#order" className="text-center text-[11px] font-medium text-[#22323A]/60 underline decoration-[#B38846]/45 underline-offset-4">Configure delivery &amp; extras</a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <p className="mx-auto mt-8 max-w-[640px] text-center text-[11px] leading-[1.6] text-[#22323A]/45">
              Prices are in USD. Checkout is handled securely by Shopify. Digital delivery is available for the same price at checkout.
            </p>
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
            <p className="mt-4 text-center text-[10px] leading-[1.6] text-[#22323A]/45">After checkout we confirm Times Square scheduling and capture with you before any files are submitted.</p>
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

        <section id="order" className="px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-[900px]">
            <div className="mx-auto max-w-[680px] text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B38846]">Order your curated memory</p>
              <h2 className="mt-3 font-serif text-[32px] sm:text-[42px]">Choose it, then check out.</h2>
              <p className="mx-auto mt-4 max-w-[620px] text-[13px] leading-[1.7] text-[#22323A]/60 sm:text-[14px]">Pick your experience, delivery and any extra keepsake cards. Payment is handled securely by Shopify. Right after checkout we email you to collect your photos, videos and messages.</p>
            </div>
            <div className="mt-9"><CuratedCheckout /></div>
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
