'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

type Product = {
  id: string;
  title: string;
  price?: string | null;
  currencyCode?: string | null;
};

type ProductsResponse = { products?: Product[] };

const slides = [
  { image: '/story/matt-writes.png', caption: 'A thought becomes something worth keeping.', position: 'object-[50%_25%]' },
  { image: '/story/matt-seals.png', caption: 'Made personal before it ever reaches their hands.', position: 'object-[50%_25%]' },
  { image: '/story/she-opens.png', caption: 'The moment begins before a screen ever appears.', position: 'object-[30%_20%]' },
  { image: '/story/she-scans.png', caption: 'One scan unlocks the private memory.', position: 'object-[35%_20%]' },
  { image: '/story/she-watches.png', caption: 'And the feeling can be revisited.', position: 'object-[42%_20%]' },
];

// Use only UNIKMO-owned story imagery here. The previous occasion images
// showed unrelated cards, which undermined product trust.
const occasions = [
  { title: 'Birthday', image: '/story/she-opens.png', position: 'object-[32%_20%]' },
  { title: 'Anniversary', image: '/story/she-watches.png', position: 'object-[44%_20%]' },
  { title: 'Long-distance love', image: '/story/she-scans.png', position: 'object-[38%_20%]' },
  { title: 'Just because', image: '/story/matt-writes.png', position: 'object-[50%_24%]' },
];

function formatCurrency(price?: string | null, currency?: string | null) {
  if (!price) return '';
  const code = currency?.toUpperCase();
  const symbol = code === 'EUR' ? '€' : code === 'USD' ? '$' : code || '';
  return `${symbol}${Number(price).toFixed(2)}`;
}

function productVisual(title: string) {
  const t = title.toLowerCase();
  if (t.includes('7') || t.includes('seven')) return '/cardfrontsite7-removebg-preview.png';
  if (t.includes('4') || t.includes('four')) return '/cardfrontsite4-removebg-preview.png';
  return '/cardfrontunikmo-removebg-preview.png';
}

function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative mx-auto aspect-[16/9] w-full max-w-[980px] overflow-hidden rounded-[22px] bg-[#E9E0D5] shadow-[0_24px_70px_rgba(34,50,58,.12)]">
      {slides.map((slide, i) => (
        <div
          key={slide.image}
          className={`absolute inset-0 transition-opacity duration-700 ${i === index ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          aria-hidden={i !== index}
        >
          <Image
            src={slide.image}
            alt={slide.caption}
            fill
            priority={i === 0}
            sizes="(max-width: 1100px) 94vw, 980px"
            className={`object-cover ${slide.position}`}
          />
        </div>
      ))}

      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#17232A]/35 to-transparent" />
      <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-6 sm:left-7 sm:right-7">
        <p className="max-w-[70%] text-left text-[11px] leading-relaxed text-white/95 sm:text-[13px]">
          {slides[index].caption}
        </p>
        <div className="flex gap-2" aria-label="Hero story slides">
          {slides.map((slide, i) => (
            <button
              key={slide.image}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show story image ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-[#22323A]/[0.06] bg-[#FCF9F4]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center px-5 sm:px-8 lg:px-12">
        <a href="#top" aria-label="UNIKMO home">
          <Image src="/unikmo-logo-header.png" alt="UNIKMO — The Key to Your Memory" width={729} height={220} priority className="h-8 w-auto sm:h-9" />
        </a>
        <nav className="ml-auto hidden items-center gap-8 text-[11px] text-[#22323A]/70 md:flex">
          <a href="#how" className="hover:text-[#B38846]">How it works</a>
          <a href="#moments" className="hover:text-[#B38846]">Occasions</a>
          <a href="#stories" className="hover:text-[#B38846]">Reviews</a>
        </nav>
        <a href="#shop" className="ml-auto rounded-lg bg-[#B38846] px-5 py-3 text-[11px] font-medium text-white transition hover:bg-[#9D773D] md:ml-8">Choose Your Card</a>
      </div>
    </header>
  );
}

function TrustIcon({ kind }: { kind: 'lock' | 'phone' | 'leaf' | 'quality' }) {
  if (kind === 'phone') return <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="6.5" y="2" width="11" height="20" rx="2"/><path d="M10 18.5h4"/></svg>;
  if (kind === 'leaf') return <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 4C12 4 5 8 5 15c0 3 2 5 5 5 7 0 10-8 10-16Z"/><path d="M4 21c3-6 7-9 13-12"/></svg>;
  if (kind === 'quality') return <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="8"/><path d="m9 12 2 2 4-5"/></svg>;
  return <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>;
}

export default function TestPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('product fetch failed'))))
      .then((data: ProductsResponse) => setProducts(data.products || []))
      .catch(() => setProducts([]));
  }, []);

  const orderedProducts = useMemo(() => {
    const rank = (title: string) => {
      const t = title.toLowerCase();
      if (t.includes('7') || t.includes('seven')) return 3;
      if (t.includes('4') || t.includes('four')) return 2;
      return 1;
    };
    return [...products].sort((a, b) => rank(a.title) - rank(b.title)).slice(0, 3);
  }, [products]);

  const displayedProducts = orderedProducts.length ? orderedProducts : [
    { id: 'single', title: 'Single Key', price: '24', currencyCode: 'USD' },
    { id: 'four', title: '4-Key Bundle', price: '64', currencyCode: 'USD' },
    { id: 'seven', title: '7-Key Vault', price: '72', currencyCode: 'USD' },
  ];

  return (
    <div className="min-h-screen bg-[#FCF9F4] text-[#22323A]">
      <Header />
      <main>
        <section id="top" className="px-5 pb-14 pt-12 text-center sm:px-8 sm:pb-18 sm:pt-16 lg:pt-20">
          <h1 className="mx-auto max-w-[760px] font-serif text-[30px] leading-[1.08] tracking-[-0.025em] sm:text-[38px] lg:text-[46px]">
            Give a moment. They’ll keep it forever.
          </h1>

          <div className="mt-8 sm:mt-10">
            <HeroCarousel />
          </div>

          <p className="mx-auto mt-7 max-w-[610px] text-[14px] leading-[1.7] text-[#22323A]/68 sm:text-[16px]">
            A private video, voice note, photo or message — unlocked through a real UNIKMO card they can hold and revisit.
          </p>
          <a href="#shop" className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-lg bg-[#B38846] px-7 text-[11px] font-medium text-white transition hover:bg-[#9D773D]">
            Choose Your Card
          </a>
        </section>

        <section className="border-y border-[#22323A]/[0.06] bg-[#F8F2EB] px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-[1120px]">
            <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B38846]">One card. Two sides.</p>
              <h2 className="mt-3 font-serif text-[31px] sm:text-[40px]">The card is the key. The memory is the gift.</h2>
              <p className="mx-auto mt-3 max-w-[560px] text-[13px] leading-relaxed text-[#22323A]/60 sm:text-[14px]">
                The real UNIKMO card — front and back.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <figure>
                <div className="relative aspect-[1.48/1] overflow-hidden rounded-[18px] border border-[#22323A]/[0.07] bg-[#EFE4D9] shadow-[0_18px_45px_rgba(34,50,58,.08)]">
                  <Image src="/card-front.png" alt="Front of the UNIKMO card" fill className="object-cover" sizes="(min-width:768px) 48vw, 94vw" />
                </div>
                <figcaption className="mt-3 text-center text-[11px] uppercase tracking-[0.18em] text-[#22323A]/55">Front</figcaption>
              </figure>
              <figure>
                <div className="relative aspect-[1.48/1] overflow-hidden rounded-[18px] border border-[#22323A]/[0.07] bg-[#F3EBE2] shadow-[0_18px_45px_rgba(34,50,58,.08)]">
                  <Image src="/card-back.png" alt="Back of the UNIKMO card with QR code and private key" fill className="object-cover" sizes="(min-width:768px) 48vw, 94vw" />
                </div>
                <figcaption className="mt-3 text-center text-[11px] uppercase tracking-[0.18em] text-[#22323A]/55">Back</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section id="how" className="px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-[1120px]">
            <p className="text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B38846]">How it works</p>
            <div className="mt-9 grid gap-7 md:grid-cols-4">
              {[
                ['01', 'Create', 'Add a private video, voice note, photo or message.'],
                ['02', 'Give', 'Your memory is connected to the physical UNIKMO card.'],
                ['03', 'Scan', 'They scan the QR code and enter the private key.'],
                ['04', 'Feel', 'The moment opens — and can be revisited later.'],
              ].map(([n, title, body]) => (
                <article key={n} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#B38846]/40 text-[11px] font-semibold text-[#B38846]">{n}</div>
                  <h3 className="mt-4 font-serif text-[22px]">{title}</h3>
                  <p className="mx-auto mt-2 max-w-[220px] text-[12px] leading-relaxed text-[#22323A]/58">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="moments" className="bg-[#F8F2EB] px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-[1180px]">
            <h2 className="text-center font-serif text-[31px] sm:text-[40px]">For life’s meaningful moments.</h2>
            <div className="mt-9 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {occasions.map((occasion) => (
                <article key={occasion.title} className="group relative aspect-[4/3] overflow-hidden rounded-[18px]">
                  <Image src={occasion.image} alt={occasion.title} fill className={`object-cover transition-transform duration-500 group-hover:scale-[1.03] ${occasion.position}`} sizes="(max-width:1024px) 50vw, 25vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#17232A]/60 via-transparent to-transparent" />
                  <h3 className="absolute bottom-4 left-4 right-4 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-white">{occasion.title}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="stories" className="px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-[1160px]">
            <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B38846]">Trust comes from people</p>
              <h2 className="mt-3 font-serif text-[31px] sm:text-[40px]">The feeling is the proof.</h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                { image: '/testimonials/customer-london.jpg', quote: 'I gave it to my partner for her birthday. She cried within seconds. It felt deeply personal — not just another gift.', name: 'Matt L., London' },
                { image: '/testimonials/customer-newyork.jpg', quote: 'Such a simple idea, but incredibly powerful. The moment we unlocked the message together, it became something we’ll remember.', name: 'Sophie M., New York' },
              ].map((item) => (
                <article key={item.name} className="overflow-hidden rounded-[20px] border border-[#22323A]/[0.07] bg-white/45">
                  <div className="relative aspect-[4/3]"><Image src={item.image} alt={item.name} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" /></div>
                  <div className="p-6">
                    <blockquote className="font-serif text-[20px] leading-[1.4]">“{item.quote}”</blockquote>
                    <p className="mt-4 text-[11px] text-[#22323A]/55">— {item.name}</p>
                  </div>
                </article>
              ))}

              <article className="overflow-hidden rounded-[20px] border border-[#22323A]/[0.07] bg-white/45">
                <div className="relative aspect-[4/3] bg-[#EFE8DF]">
                  <Image
                    src="/testimonials/customer-phone.jpg"
                    alt="A real UNIKMO recipient smiling while viewing a private moment on her phone"
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B38846]">Real recipient moment</p>
                  <p className="mt-3 font-serif text-[20px] leading-[1.4]">The product disappears. What remains is the reaction.</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="shop" className="bg-[#F8F2EB] px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-[1320px]">
            <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B38846]">Choose your card</p>
              <h2 className="mt-3 font-serif text-[31px] sm:text-[40px]">Pick the way you want to give it.</h2>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {displayedProducts.map((product) => (
                <article key={product.id} className="rounded-[20px] border border-[#22323A]/[0.07] bg-white/55 px-5 pb-7 pt-4 text-center sm:px-6">
                  <div className="relative mx-auto aspect-[1.48/1] w-full max-w-[430px] overflow-hidden rounded-[16px] bg-[#FAF6F1]">
                    <Image
                      src={productVisual(product.title)}
                      alt={product.title}
                      fill
                      className="object-contain scale-[1.18]"
                      sizes="(max-width:768px) 92vw, 420px"
                    />
                  </div>
                  <h3 className="mt-4 font-serif text-[25px]">{product.title}</h3>
                  {product.price ? <p className="mt-2 text-[14px] font-medium">{formatCurrency(product.price, product.currencyCode)}</p> : null}
                  <a href="/#shop" className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[#22323A] px-6 text-[11px] font-medium text-white">Choose This</a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[#22323A]/[0.06] bg-[#FCF9F4] px-5 py-8 sm:px-8">
          <div className="mx-auto grid max-w-[1180px] gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['lock', 'Private & secure', 'Your moments stay private.'],
              ['phone', 'No app required', 'They open it in the browser.'],
              ['leaf', 'A tree planted', 'For every order.'],
              ['quality', 'Premium quality', 'Made to be kept.'],
            ].map(([kind, title, body]) => (
              <div key={title} className="flex items-center gap-4">
                <div className="text-[#B38846]"><TrustIcon kind={kind as 'lock' | 'phone' | 'leaf' | 'quality'} /></div>
                <div><p className="text-[12px] font-medium">{title}</p><p className="mt-1 text-[11px] text-[#22323A]/55">{body}</p></div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-[#22323A]/[0.07] bg-[#F8F2EB] px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
          <Image src="/unikmo-logo-header.png" alt="UNIKMO" width={729} height={220} className="h-8 w-auto" />
          <p className="text-[11px] text-[#22323A]/50">Test page only — production unchanged.</p>
        </div>
      </footer>
    </div>
  );
}
