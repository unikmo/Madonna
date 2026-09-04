import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'How UNIKMO Works | Physical Memory Cards for Private Messages',
  description:
    'UNIKMO is a physical keepsake card that unlocks a private video, voice note, photo, or written message using a QR code and private access code. No app required.',
  alternates: { canonical: 'https://www.unikmo.com/how-unikmo-works' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'How UNIKMO Works | Physical Memory Cards for Private Messages',
    description:
      'A physical UNIKMO card gives someone a private route back to your video, voice note, photo, or written message.',
    url: 'https://www.unikmo.com/how-unikmo-works',
    siteName: 'UNIKMO',
    images: ['https://www.unikmo.com/og-image.jpg'],
    type: 'website',
  },
};

const facts = [
  ['Product type', 'Physical keepsake card'],
  ['What it can unlock', 'Video, voice note, photo, or written message'],
  ['Recipient access', 'QR code plus the card’s private access code'],
  ['App required', 'No'],
  ['Recipient account required', 'No'],
  ['Card options', 'Single Key, 4-Key Bundle, and 7-Key Bundle'],
] as const;

const faqs = [
  {
    question: 'What is UNIKMO?',
    answer:
      'UNIKMO is a physical keepsake card connected to a private digital memory. The memory can be a video, voice note, photo, or written message.',
  },
  {
    question: 'How does someone open a UNIKMO memory?',
    answer:
      'The recipient scans the QR code on the card and enters the card’s private access code. The memory opens in the browser.',
  },
  {
    question: 'Does the recipient need an app or account?',
    answer:
      'No. The recipient does not need to download an app or create an account to open the memory.',
  },
  {
    question: 'What are the UNIKMO card options?',
    answer:
      'Single Key includes one card and one private memory. 4-Key Bundle includes four cards and four separate private memories. 7-Key Bundle includes seven cards and seven separate private memories.',
  },
  {
    question: 'Is a UNIKMO memory private?',
    answer:
      'Memories are private by default. Access requires the UNIKMO link and the card’s private access code, so the card and code should be shared only with the intended recipient.',
  },
  {
    question: 'Is storage guaranteed forever?',
    answer:
      'No. UNIKMO aims to provide long-term access but does not promise permanent storage. The FAQ contains the current storage policy.',
  },
];

export default function HowUnikmoWorksPage() {
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': 'https://www.unikmo.com/how-unikmo-works#howto',
    name: 'How UNIKMO works',
    description:
      'Create a private digital memory, connect it to a physical UNIKMO card, give the card, and let the recipient scan it to unlock the moment.',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Create',
        text: 'Add a private video, voice note, photo, or written message.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Give',
        text: 'The private memory is connected to a physical UNIKMO card that you give to the recipient.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Scan',
        text: 'The recipient scans the QR code on the card and enters the private access code.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Revisit',
        text: 'The memory opens in the browser and can be revisited later while it remains available under the current storage policy.',
      },
    ],
  };

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': 'https://www.unikmo.com/how-unikmo-works#products',
    name: 'UNIKMO card options',
    itemListElement: [
      {
        '@type': 'Product',
        position: 1,
        name: 'Single Key',
        description: 'One physical UNIKMO card connected to one private memory.',
        brand: { '@id': 'https://www.unikmo.com/#brand' },
        url: 'https://www.unikmo.com/#shop',
      },
      {
        '@type': 'Product',
        position: 2,
        name: '4-Key Bundle',
        description: 'Four physical UNIKMO cards, each connected to its own private memory.',
        brand: { '@id': 'https://www.unikmo.com/#brand' },
        url: 'https://www.unikmo.com/#shop',
      },
      {
        '@type': 'Product',
        position: 3,
        name: '7-Key Bundle',
        description: 'Seven physical UNIKMO cards, each connected to its own private memory.',
        brand: { '@id': 'https://www.unikmo.com/#brand' },
        url: 'https://www.unikmo.com/#shop',
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': 'https://www.unikmo.com/how-unikmo-works#faq',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://www.unikmo.com/how-unikmo-works#webpage',
    url: 'https://www.unikmo.com/how-unikmo-works',
    name: 'How UNIKMO Works',
    description:
      'A factual guide to the UNIKMO physical card, private digital memories, recipient access, and card options.',
    isPartOf: { '@id': 'https://www.unikmo.com/#website' },
    about: { '@id': 'https://www.unikmo.com/#brand' },
    inLanguage: 'en',
  };

  return (
    <div className="min-h-screen bg-[#FCF9F4] text-[#22323A]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="sticky top-0 z-40 border-b border-[#22323A]/[0.07] bg-[#FCF9F4]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1240px] items-center px-5 sm:px-8">
          <Link href="/" aria-label="UNIKMO home">
            <Image
              src="/unikmo-logo-header.png"
              alt="UNIKMO — The Key to Your Memory"
              width={729}
              height={220}
              priority
              className="h-8 w-auto sm:h-9"
            />
          </Link>
          <nav className="ml-auto hidden items-center gap-7 text-[11px] text-[#22323A]/65 md:flex">
            <Link href="/faq" className="hover:text-[#B38846]">FAQ</Link>
          </nav>
          <Link
            href="/#shop"
            className="ml-auto rounded-lg bg-[#B38846] px-5 py-3 text-[11px] font-medium text-white transition hover:bg-[#9F783D] md:ml-8"
          >
            Choose Your Card
          </Link>
        </div>
      </header>

      <main>
        <section className="px-5 pb-14 pt-14 text-center sm:px-8 sm:pb-16 sm:pt-18 lg:pt-20">
          <div className="mx-auto max-w-[860px]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B38846]">The factual guide</p>
            <h1 className="mt-4 font-serif text-[38px] leading-[1.04] tracking-[-0.025em] sm:text-[48px] lg:text-[56px]">How UNIKMO works.</h1>
            <p className="mx-auto mt-5 max-w-[760px] text-[16px] leading-[1.68] text-[#22323A]/72 sm:text-[18px]">
              <strong className="font-semibold text-[#22323A]">UNIKMO is a physical keepsake card that unlocks a private digital memory.</strong> The memory can be a video, voice note, photo, or written message.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              <Link href="/#shop" className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-[#B38846] px-7 text-[11px] font-medium text-white transition hover:bg-[#9F783D]">Choose Your Card</Link>
              <Link href="/faq" className="inline-flex min-h-[44px] items-center text-[11px] font-medium text-[#22323A]/68 underline decoration-[#B38846]/45 underline-offset-4">Read the FAQ</Link>
            </div>
          </div>

          <div className="mx-auto mt-10 grid max-w-[980px] gap-5 md:grid-cols-2">
            <div className="rounded-[22px] border border-[#22323A]/[0.07] bg-[radial-gradient(circle_at_50%_38%,#FFFDF9_0%,#F3EAE0_58%,#E8DDD1_100%)] p-6 shadow-[0_18px_45px_rgba(34,50,58,.08)]">
              <div className="relative aspect-[1.48/1] overflow-hidden rounded-[12px] bg-[#F8F2EA] shadow-[0_22px_42px_rgba(40,30,20,.15)]">
                <Image src="/card-front.png" alt="Front of the UNIKMO physical card" fill className="object-cover" sizes="(max-width:768px) 86vw, 430px" />
              </div>
            </div>
            <div className="rounded-[22px] border border-[#22323A]/[0.07] bg-[radial-gradient(circle_at_50%_38%,#FFFDF9_0%,#F3EAE0_58%,#E8DDD1_100%)] p-6 shadow-[0_18px_45px_rgba(34,50,58,.08)]">
              <div className="relative aspect-[1.48/1] overflow-hidden rounded-[12px] bg-[#F8F2EA] shadow-[0_22px_42px_rgba(40,30,20,.15)]">
                <Image src="/card-back.png" alt="Back of the UNIKMO physical card with QR code and private key" fill className="object-cover" sizes="(max-width:768px) 86vw, 430px" />
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#22323A]/[0.06] bg-[#F7F0E8] px-5 py-14 sm:px-8 sm:py-16">
          <div className="mx-auto max-w-[1040px]">
            <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B38846]">UNIKMO at a glance</p>
              <h2 className="mt-3 font-serif text-[32px] sm:text-[40px]">The core product facts.</h2>
            </div>
            <dl className="mt-9 grid overflow-hidden rounded-[20px] border border-[#22323A]/[0.08] bg-[#FCF9F4] sm:grid-cols-2">
              {facts.map(([term, value]) => (
                <div key={term} className="border-b border-[#22323A]/[0.07] p-6 sm:[&:nth-last-child(-n+2)]:border-b-0">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#B38846]">{term}</dt>
                  <dd className="mt-2 text-[14px] leading-[1.65] text-[#22323A]/72">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="px-5 py-14 sm:px-8 sm:py-16">
          <div className="mx-auto max-w-[1080px]">
            <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B38846]">Four simple steps</p>
              <h2 className="mt-3 font-serif text-[32px] sm:text-[40px]">Create. Give. Scan. Revisit.</h2>
            </div>
            <div className="mt-9 grid gap-6 md:grid-cols-4">
              {[
                ['01', 'Create', 'Add a private video, voice note, photo, or written message.'],
                ['02', 'Give', 'Your memory is connected to the physical UNIKMO card you give.'],
                ['03', 'Scan', 'They scan the QR code and enter the private access code.'],
                ['04', 'Revisit', 'The memory opens in the browser and can be revisited later.'],
              ].map(([number, title, copy]) => (
                <article key={number} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#B38846]/40 text-[11px] font-semibold text-[#B38846]">{number}</div>
                  <h3 className="mt-4 font-serif text-[24px]">{title}</h3>
                  <p className="mx-auto mt-2 max-w-[230px] text-[13px] leading-[1.65] text-[#22323A]/62">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[#22323A]/[0.06] bg-[#F7F0E8] px-5 py-14 sm:px-8 sm:py-16">
          <div className="mx-auto max-w-[1040px]">
            <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B38846]">Card options</p>
              <h2 className="mt-3 font-serif text-[32px] sm:text-[40px]">Choose how many moments you want to give.</h2>
            </div>
            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {[
                ['Single Key', '1 card · 1 private memory', '/cardfrontunikmo.jpg'],
                ['4-Key Bundle', '4 cards · 4 private memories', '/cardfrontsite4.png'],
                ['7-Key Bundle', '7 cards · 7 private memories', '/cardfrontsite7.png'],
              ].map(([name, detail, image]) => (
                <article key={name} className="overflow-hidden rounded-[20px] border border-[#22323A]/[0.08] bg-[#FCF9F4] text-center">
                  <div className="relative aspect-[3/2] bg-[#F6EEE5] p-4">
                    <Image src={image} alt={`${name} UNIKMO card`} fill className="object-contain p-4" sizes="(max-width:768px) 90vw, 320px" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-[26px]">{name}</h3>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-[#B38846]">{detail}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/#shop" className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-[#22323A] px-7 text-[11px] font-medium text-white transition hover:bg-[#34464F]">Choose Your Card</Link>
            </div>
          </div>
        </section>

        <section className="px-5 py-14 sm:px-8 sm:py-16">
          <div className="mx-auto max-w-[900px]">
            <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B38846]">Clear answers</p>
              <h2 className="mt-3 font-serif text-[32px] sm:text-[40px]">Frequently asked questions.</h2>
            </div>
            <div className="mt-8 divide-y divide-[#22323A]/[0.08] border-y border-[#22323A]/[0.08]">
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
            <p className="mt-7 text-center text-[12px] leading-[1.7] text-[#22323A]/55">
              For delivery, storage, recovery, and other operational details, read the <Link href="/faq" className="underline decoration-[#B38846]/45 underline-offset-4">full UNIKMO FAQ</Link>.
            </p>
          </div>
        </section>

        <section className="bg-[#22323A] px-5 py-14 text-center text-white sm:px-8 sm:py-16">
          <div className="mx-auto max-w-[760px]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D7B77C]">The card is the key</p>
            <h2 className="mt-3 font-serif text-[34px] leading-[1.05] sm:text-[42px]">The memory is the gift.</h2>
            <p className="mx-auto mt-4 max-w-[620px] text-[14px] leading-[1.7] text-white/68">Choose a card, make it personal, and give someone a moment they can return to.</p>
            <Link href="/#shop" className="mt-7 inline-flex min-h-[48px] items-center justify-center rounded-lg bg-[#B38846] px-8 text-[11px] font-medium text-white transition hover:bg-[#9F783D]">Choose Your Card</Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
