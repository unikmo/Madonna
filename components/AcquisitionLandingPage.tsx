import Image from 'next/image';
import Link from 'next/link';
import type { AcquisitionPage } from '@/lib/acquisition-pages';
import { acquisitionPages } from '@/lib/acquisition-pages';

const PRODUCTS = [
  { name: 'Single Memory Card', price: '$24', cards: '1 card' },
  { name: '4-Card Set', price: '$64', cards: '4 cards' },
  { name: '7-Card Collection', price: '$72', cards: '7 cards' },
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
    <header className="border-b border-[#22323A]/[0.08] bg-[#FCF9F4]">
      <div className="mx-auto flex h-[72px] w-full max-w-[1180px] items-center px-5 sm:px-8">
        <Link href="/" className="inline-flex items-center" aria-label="UNIKMO home">
          <Image
            src="/unikmo-logo-header.png"
            alt="UNIKMO — The Key to Your Memory"
            width={729}
            height={220}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </Link>
        <nav className="ml-auto hidden items-center gap-7 text-[12px] text-[#22323A]/70 md:flex">
          <Link href="/#how-it-works" className="transition-colors hover:text-[#B38846]">How It Works</Link>
          <Link href="/#shop" className="transition-colors hover:text-[#B38846]">Pricing</Link>
          <Link href="/" className="transition-colors hover:text-[#B38846]">Main Product Page</Link>
        </nav>
        <Link
          href="/#shop"
          className="ml-auto rounded-lg bg-[#B38846] px-5 py-3 text-[11px] font-medium text-white shadow-[0_8px_25px_rgba(179,136,70,.18)] transition-colors hover:bg-[#9F783D] md:ml-8"
        >
          Create Your Moment
        </Link>
      </div>
    </header>
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
        <section className="border-b border-[#22323A]/[0.06] py-12 sm:py-16 lg:py-20">
          <div className="mx-auto grid w-full max-w-[1180px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.02fr_.98fr] lg:gap-14">
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B38846]">{page.eyebrow}</p>
              <h1 className="max-w-[720px] font-serif text-[48px] leading-[.98] tracking-[-.025em] text-[#22323A] sm:text-[60px] lg:text-[68px]">
                {page.title}
              </h1>
              <p className="mt-7 max-w-[680px] text-[17px] leading-[1.7] text-[#22323A]/72">{page.intro}</p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="/#shop" className="rounded-lg bg-[#B38846] px-7 py-3.5 text-[12px] font-medium text-white shadow-[0_10px_28px_rgba(179,136,70,.20)] transition-colors hover:bg-[#9F783D]">
                  Create Your Moment
                </Link>
                <Link href="/" className="px-2 py-3 text-[12px] font-medium text-[#22323A]/70 transition-colors hover:text-[#B38846]">
                  See the main UNIKMO page →
                </Link>
              </div>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-[#22323A]/55">
                <span>Private by design</span>
                <span>No recipient app</span>
                <span>Physical card + digital moment</span>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[24px] border border-[#22323A]/[0.08] bg-[#EEE5DA] shadow-[0_20px_55px_rgba(34,50,58,.10)]">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/images/unikmo-lifestyle.jpg"
                  alt={`UNIKMO ${page.primaryKeyword} experience`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover object-center"
                />
              </div>
              <div className="grid grid-cols-3 border-t border-[#22323A]/[0.08] bg-[#FCF9F4]/95">
                {PRODUCTS.map((product) => (
                  <div key={product.name} className="px-3 py-4 text-center [&+&]:border-l [&+&]:border-[#22323A]/[0.08]">
                    <div className="font-serif text-[22px] text-[#B38846]">{product.price}</div>
                    <div className="mt-1 text-[9px] uppercase tracking-[0.15em] text-[#22323A]/50">{product.cards}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-20">
          <div className="mx-auto grid w-full max-w-[1040px] gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B38846]">THE SITUATION</p>
              <h2 className="font-serif text-[38px] leading-[1.02] text-[#22323A] sm:text-[46px]">{page.situationTitle}</h2>
            </div>
            <p className="self-end text-[16px] leading-[1.75] text-[#22323A]/70">{page.situationCopy}</p>
          </div>
        </section>

        <section className="border-y border-[#22323A]/[0.06] bg-[#F7F0E8] py-14 sm:py-16">
          <div className="mx-auto w-full max-w-[1100px] px-5 sm:px-8">
            <div className="mx-auto max-w-[720px] text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B38846]">WHY UNIKMO</p>
              <h2 className="mt-3 font-serif text-[38px] leading-[1.03] sm:text-[46px]">{page.whyTitle}</h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {page.whyPoints.map((point, index) => (
                <article key={point.title} className="rounded-[18px] border border-[#22323A]/[0.07] bg-[#FCF9F4] p-6 text-center shadow-[0_8px_26px_rgba(34,50,58,.04)]">
                  <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-[#B38846]/35 text-[#B38846]">
                    {index === 1 ? <KeyMark /> : <span className="font-serif text-[21px]">{index + 1}</span>}
                  </div>
                  <h3 className="font-serif text-[25px] leading-[1.05]">{point.title}</h3>
                  <p className="mt-3 text-[13px] leading-[1.65] text-[#22323A]/65">{point.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-20">
          <div className="mx-auto w-full max-w-[1080px] px-5 sm:px-8">
            <div className="max-w-[720px]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B38846]">WHAT TO PUT INSIDE</p>
              <h2 className="mt-3 font-serif text-[39px] leading-[1.02] sm:text-[47px]">{page.examplesTitle}</h2>
              <p className="mt-4 max-w-[660px] text-[15px] leading-[1.7] text-[#22323A]/66">{page.examplesIntro}</p>
            </div>
            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {page.examples.map((example) => (
                <article key={example.title} className="rounded-[18px] border border-[#22323A]/[0.08] bg-white/55 p-6">
                  <h3 className="font-serif text-[25px] leading-[1.08] text-[#22323A]">{example.title}</h3>
                  <p className="mt-3 text-[13px] leading-[1.65] text-[#22323A]/64">{example.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[#22323A]/[0.06] bg-[#F7F0E8] py-14 sm:py-16">
          <div className="mx-auto w-full max-w-[1100px] px-5 sm:px-8">
            <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B38846]">CHOOSE YOUR FORMAT</p>
              <h2 className="mt-3 font-serif text-[39px] leading-[1.02] sm:text-[47px]">Three ways to give the moment.</h2>
              <p className="mx-auto mt-4 max-w-[620px] text-[14px] leading-[1.7] text-[#22323A]/64">All three options use the same private UNIKMO experience. Choose the number of physical cards that fits the story you want to tell.</p>
            </div>
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {PRODUCTS.map((product, index) => (
                <article key={product.name} className="flex min-h-[310px] flex-col rounded-[20px] border border-[#22323A]/[0.08] bg-[#FCF9F4] p-7 shadow-[0_10px_28px_rgba(34,50,58,.04)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.17em] text-[#B38846]">{product.cards}</p>
                      <h3 className="mt-2 font-serif text-[30px] leading-[1.03]">{product.name}</h3>
                    </div>
                    <div className="font-serif text-[34px] text-[#B38846]">{product.price}</div>
                  </div>
                  <p className="mt-6 text-[14px] leading-[1.65] text-[#22323A]/66">{page.productFit[index]}</p>
                  <div className="mt-auto pt-8">
                    <Link href="/#shop" className="inline-flex w-full items-center justify-center rounded-lg bg-[#22323A] px-5 py-3.5 text-[11px] font-medium text-white transition-colors hover:bg-[#34464F]">
                      Create with {product.cards} →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-20">
          <div className="mx-auto w-full max-w-[960px] px-5 sm:px-8">
            <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B38846]">QUESTIONS</p>
              <h2 className="mt-3 font-serif text-[39px] leading-[1.02] sm:text-[47px]">Questions specific to {page.primaryKeyword}.</h2>
            </div>
            <div className="mt-9 divide-y divide-[#22323A]/[0.08] border-y border-[#22323A]/[0.08]">
              {page.faqs.map((faq) => (
                <details key={faq.question} className="group py-1">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[15px] font-medium text-[#22323A]">
                    {faq.question}
                    <span className="text-[#B38846] transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="max-w-[760px] pb-6 pr-12 text-[14px] leading-[1.7] text-[#22323A]/65">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[#22323A]/[0.06] bg-[#F7F0E8] py-12 sm:py-14">
          <div className="mx-auto w-full max-w-[1080px] px-5 text-center sm:px-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B38846]">EXPLORE RELATED GIFT IDEAS</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {page.related.map((slug) => {
                const related = acquisitionPages[slug];
                return (
                  <Link key={slug} href={`/${slug}`} className="rounded-full border border-[#22323A]/[0.10] bg-[#FCF9F4] px-5 py-2.5 text-[12px] text-[#22323A]/70 transition-colors hover:border-[#B38846]/50 hover:text-[#B38846]">
                    {related.primaryKeyword}
                  </Link>
                );
              })}
            </div>
            <div className="mt-8">
              <Link href="/" className="text-[12px] font-medium text-[#22323A]/65 underline decoration-[#B38846]/40 underline-offset-4 transition-colors hover:text-[#B38846]">
                Return to the main UNIKMO product page
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#22323A]/[0.08] bg-[#FCF9F4] py-8">
        <div className="mx-auto flex w-full max-w-[1080px] flex-col items-center justify-center gap-4 px-5 text-center text-[10px] uppercase tracking-[0.18em] text-[#22323A]/48 sm:px-8">
          <span>UNIKMO © {new Date().getFullYear()}</span>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            <Link href="/faq" className="hover:text-[#22323A]">FAQ</Link>
            <Link href="/" className="hover:text-[#22323A]">Main Product Page</Link>
            <Link href="/#shop" className="hover:text-[#22323A]">Create Your Moment</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
