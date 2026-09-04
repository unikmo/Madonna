import Image from 'next/image';
import Link from 'next/link';
import SiteFooter from './SiteFooter';
import type { AcquisitionPage } from '@/lib/acquisition-pages';
import { acquisitionPages } from '@/lib/acquisition-pages';

const PRODUCTS = [
  {
    name: 'Single Key',
    price: '$24',
    cards: '1 card · 1 private memory',
    image: '/cardfrontunikmo.jpg',
    cta: 'Choose Single',
    detail: 'One physical UNIKMO card unlocking one private video, voice note, photo or message.',
  },
  {
    name: '4-Key Bundle',
    price: '$64',
    cards: '4 cards · 4 private memories',
    image: '/cardfrontsite4.png',
    cta: 'Choose 4 Cards',
    detail: 'Four individual UNIKMO cards, each unlocking its own private moment.',
  },
  {
    name: '7-Key Bundle',
    price: '$72',
    cards: '7 cards · 7 private memories',
    image: '/cardfrontsite7.png',
    cta: 'Choose 7 Cards',
    detail: 'Seven individual UNIKMO cards, each unlocking its own private moment.',
  },
] as const;

function KeyMark() {
  return (
    <svg viewBox="0 0 32 52" className="h-10 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="16" cy="10" r="6" />
      <path d="M16 16v27m0-17h7m-7 8h5m-5 9h5" />
    </svg>
  );
}

function PageHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#22323A]/[0.07] bg-[#FCF9F4]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] w-full max-w-[1240px] items-center px-5 sm:px-8">
        <Link href="/" className="inline-flex items-center" aria-label="UNIKMO home">
          <Image src="/unikmo-logo-header.png" alt="UNIKMO — The Key to Your Memory" width={729} height={220} priority className="h-8 w-auto sm:h-9" />
        </Link>
        <nav className="ml-auto hidden items-center gap-7 text-[11px] text-[#22323A]/65 md:flex">
          <Link href="/#how-it-works" className="transition-colors hover:text-[#B38846]">How it works</Link>
          <Link href="/faq" className="transition-colors hover:text-[#B38846]">FAQ</Link>
        </nav>
        <Link href="/#shop" className="ml-auto rounded-lg bg-[#B38846] px-5 py-3 text-[11px] font-medium text-white shadow-[0_8px_25px_rgba(179,136,70,.16)] transition-colors hover:bg-[#9F783D] md:ml-8">
          Choose Your Card
        </Link>
      </div>
    </header>
  );
}

function ProductCard({ product, fit, featured = false }: { product: typeof PRODUCTS[number]; fit: string; featured?: boolean }) {
  return (
    <article className={`relative flex h-full flex-col overflow-hidden rounded-[22px] border bg-[#FCF9F4] shadow-[0_12px_34px_rgba(34,50,58,.05)] ${featured ? 'border-[#B38846]/45' : 'border-[#22323A]/[0.08]'}`}>
      {featured ? <span className="absolute right-4 top-4 z-10 rounded-full bg-[#22323A] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-white">Best value</span> : null}
      <div className="relative aspect-[3/2] bg-[radial-gradient(circle_at_50%_42%,#FFFDF9_0%,#F2E9DF_62%,#E6D9CC_100%)] p-5">
        <div className="relative h-full w-full overflow-hidden rounded-[14px] border border-white/55 bg-[#F9F4EE] shadow-[0_18px_34px_rgba(40,30,20,.14)]">
          <Image src={product.image} alt={`${product.name} UNIKMO card`} fill className="object-contain p-2" sizes="(max-width:1024px) 90vw, 360px" />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-[#B38846]">{product.cards}</p>
            <h3 className="mt-2 font-serif text-[27px] leading-[1.04]">{product.name}</h3>
          </div>
          <div className="font-serif text-[30px] text-[#B38846]">{product.price}</div>
        </div>
        <p className="mt-5 text-[13px] leading-[1.65] text-[#22323A]/68">{product.detail}</p>
        <p className="mt-3 text-[12px] leading-[1.6] text-[#22323A]/55">{fit}</p>
        <div className="mt-auto pt-6">
          <Link href="/#shop" className="inline-flex w-full min-h-[46px] items-center justify-center rounded-lg bg-[#22323A] px-5 text-[11px] font-medium text-white transition-colors hover:bg-[#34464F]">
            {product.cta}
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function AcquisitionLandingPage({ page }: { page: AcquisitionPage }) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'UNIKMO', item: 'https://www.unikmo.com/' },
      { '@type': 'ListItem', position: 2, name: page.primaryKeyword, item: `https://www.unikmo.com/${page.slug}` },
    ],
  };

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `UNIKMO options for ${page.primaryKeyword}`,
    itemListElement: PRODUCTS.map((product, index) => ({
      '@type': 'Product',
      position: index + 1,
      name: product.name,
      brand: { '@type': 'Brand', name: 'UNIKMO' },
      offers: {
        '@type': 'Offer',
        price: product.price.replace('$', ''),
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: 'https://www.unikmo.com/#shop',
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#FCF9F4] text-[#22323A]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <PageHeader />

      <main>
        <section className="px-5 pb-12 pt-12 text-center sm:px-8 sm:pb-16 sm:pt-16 lg:pt-20">
          <div className="mx-auto max-w-[900px]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B38846]">{page.eyebrow}</p>
            <h1 className="mx-auto mt-4 max-w-[860px] font-serif text-[35px] leading-[1.04] tracking-[-0.025em] sm:text-[44px] lg:text-[52px]">{page.title}</h1>
            <p className="mx-auto mt-5 max-w-[760px] text-[15px] leading-[1.65] text-[#22323A]/72 sm:text-[17px]">
              <strong className="font-semibold text-[#22323A]">Turn a video, voice note, photo or message into a beautiful physical card.</strong> They scan it to unlock your private moment.
            </p>
            <p className="mx-auto mt-4 max-w-[720px] text-[13px] leading-[1.7] text-[#22323A]/58 sm:text-[14px]">{page.intro}</p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              <Link href="/#shop" className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-[#B38846] px-7 text-[11px] font-medium text-white shadow-[0_10px_28px_rgba(179,136,70,.18)] transition-colors hover:bg-[#9F783D]">Choose Your Card</Link>
              <Link href="/#how-it-works" className="inline-flex min-h-[44px] items-center text-[11px] font-medium text-[#22323A]/68 underline decoration-[#B38846]/45 underline-offset-4 transition hover:text-[#22323A]">See how it works</Link>
            </div>
            <div className="mx-auto mt-6 flex max-w-[640px] flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-[#22323A]/52">
              <span>No app required</span><span aria-hidden="true">•</span><span>Private by design</span><span aria-hidden="true">•</span><span>A tree planted with every order</span>
            </div>
          </div>

          <div className="mx-auto mt-9 max-w-[820px] rounded-[24px] border border-[#22323A]/[0.07] bg-[radial-gradient(circle_at_50%_38%,#FFFDF9_0%,#F2E8DE_58%,#E4D6C8_100%)] p-5 shadow-[0_24px_70px_rgba(34,50,58,.09)] sm:p-8">
            <div className="relative mx-auto aspect-[3/2] max-w-[680px] overflow-hidden rounded-[16px] border border-white/60 bg-[#F9F4EE] shadow-[0_24px_50px_rgba(40,30,20,.16)]">
              <Image src="/cardfrontunikmo.jpg" alt="UNIKMO Single Key card" fill priority className="object-contain p-3" sizes="(max-width:900px) 86vw, 680px" />
            </div>
          </div>
        </section>

        <section className="border-y border-[#22323A]/[0.06] bg-[#F7F0E8] px-5 py-14 sm:px-8 sm:py-16">
          <div className="mx-auto max-w-[1180px]">
            <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B38846]">Choose your card</p>
              <h2 className="mt-3 font-serif text-[32px] sm:text-[40px]">One moment or a story told in parts.</h2>
            </div>
            <div className="mt-9 grid gap-5 lg:grid-cols-3">
              {PRODUCTS.map((product, index) => <ProductCard key={product.name} product={product} fit={page.productFit[index]} featured={index === 2} />)}
            </div>
          </div>
        </section>

        <section className="px-5 py-14 sm:px-8 sm:py-18 lg:py-20">
          <div className="mx-auto grid max-w-[1040px] gap-9 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B38846]">The moment</p>
              <h2 className="mt-3 font-serif text-[34px] leading-[1.04] sm:text-[42px]">{page.situationTitle}</h2>
            </div>
            <p className="self-end text-[15px] leading-[1.75] text-[#22323A]/68">{page.situationCopy}</p>
          </div>
        </section>

        <section className="border-y border-[#22323A]/[0.06] bg-[#F7F0E8] px-5 py-14 sm:px-8 sm:py-16">
          <div className="mx-auto max-w-[1100px]">
            <div className="mx-auto max-w-[720px] text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B38846]">Why UNIKMO</p>
              <h2 className="mt-3 font-serif text-[34px] leading-[1.04] sm:text-[42px]">{page.whyTitle}</h2>
            </div>
            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {page.whyPoints.map((point, index) => (
                <article key={point.title} className="rounded-[18px] border border-[#22323A]/[0.07] bg-[#FCF9F4] p-6 text-center shadow-[0_8px_26px_rgba(34,50,58,.04)]">
                  <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-[#B38846]/35 text-[#B38846]">{index === 1 ? <KeyMark /> : <span className="font-serif text-[21px]">{index + 1}</span>}</div>
                  <h3 className="font-serif text-[24px] leading-[1.08]">{point.title}</h3>
                  <p className="mt-3 text-[13px] leading-[1.65] text-[#22323A]/64">{point.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-14 sm:px-8 sm:py-18 lg:py-20">
          <div className="mx-auto max-w-[1080px]">
            <div className="max-w-[720px]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B38846]">What to put inside</p>
              <h2 className="mt-3 font-serif text-[34px] leading-[1.04] sm:text-[42px]">{page.examplesTitle}</h2>
              <p className="mt-4 max-w-[660px] text-[14px] leading-[1.7] text-[#22323A]/64">{page.examplesIntro}</p>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {page.examples.map((example) => (
                <article key={example.title} className="rounded-[18px] border border-[#22323A]/[0.08] bg-white/55 p-6">
                  <h3 className="font-serif text-[24px] leading-[1.08]">{example.title}</h3>
                  <p className="mt-3 text-[13px] leading-[1.65] text-[#22323A]/64">{example.copy}</p>
                </article>
              ))}
            </div>
            <div className="mt-9 text-center"><Link href="/#shop" className="inline-flex min-h-[46px] items-center justify-center rounded-lg bg-[#B38846] px-7 text-[11px] font-medium text-white transition-colors hover:bg-[#9F783D]">Choose Your Card</Link></div>
          </div>
        </section>

        <section className="border-y border-[#223233A]/[0.06] bg-[#F7F0E8] px-5 py-14 sm:px-8 sm:py-16">
          <div className="mx-auto max-w-[920px]">
            <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B38846]">Questions</p>
              <h2 className="mt-3 font-serif text-[34px] leading-[1.04] sm:text-[42px]">Questions about {page.primaryKeyword}.</h2>
            </div>
            <div className="mt-8 divide-y divide-[#22323A]/[0.08] border-y border-[#22323A]/[0.08]">
              {page.faqs.map((faq) => (
                <details key={faq.question} className="group py-1">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[15px] font-medium">
                    {faq.question}<span className="text-[#B38846] transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="max-w-[760px] pb-6 pr-10 text-[14px] leading-[1.7] text-[#22323A]/64">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-12 text-center sm:px-8 sm:py-14">
          <div className="mx-auto max-w-[880px]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B38846]">Explore related ideas</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {page.related.map((slug) => {
                const related = acquisitionPages[slug];
                return related ? <Link key={slug} href={`/${slug}`} className="rounded-full border border-[#22323A]/[0.10] bg-white/55 px-4 py-2 text-[11px] text-[#22323A]/65 transition hover:border-[#B38846]/40 hover:text-[#B38846]">{related.primaryKeyword}</Link> : null;
              })}
            </div>
            <h2 className="mx-auto mt-10 max-w-[680px] font-serif text-[32px] leading-[1.05] sm:text-[40px]">Give the feeling. Let the card carry it.</h2>
            <p className="mx-auto mt-4 max-w-[620px] text-[14px] leading-[1.7] text-[#22323A]/62">Choose the number of UNIKMO cards that fits the moment you want to give.</p>
            <Link href="/#shop" className="mt-7 inline-flex min-h-[48px] items-center justify-center rounded-lg bg-[#B38846] px-8 text-[11px] font-medium text-white transition-colors hover:bg-[#9F783D]">Choose Your Card</Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
