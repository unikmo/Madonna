'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

type Product = {
  id: string;
  title: string;
  image?: string | null;
  imageAlt?: string | null;
  variantId?: string | null;
  price?: string | null;
  currencyCode?: string | null;
};

type ProductsResponse = { products?: Product[]; storeDomain?: string };

const slides = [
  { image: '/story/matt-writes.png', caption: 'A thought becomes something worth keeping.', position: 'object-[50%_25%]' },
  { image: '/story/matt-seals.png', caption: 'Made personal before it ever reaches their hands.', position: 'object-[50%_25%]' },
  { image: '/story/she-opens.png', caption: 'The moment begins before a screen ever appears.', position: 'object-[30%_20%]' },
  { image: '/story/she-scans.png', caption: 'One scan unlocks the private memory.', position: 'object-[35%_20%]' },
  { image: '/story/she-watches.png', caption: 'And the feeling can be revisited.', position: 'object-[42%_20%]' },
];

const occasions = [
  {
    title: 'Birthday',
    image: '/occasions/birthday.png',
    position: 'object-[50%_8%]',
    headline: 'Say the part a birthday card cannot hold.',
    copy: 'Record the message you would normally try to squeeze into a few lines, then give them a card they can scan and return to later.',
  },
  {
    title: 'Anniversary',
    image: '/occasions/anniversary.png',
    position: 'object-[50%_8%]',
    headline: 'Give your shared story somewhere to live.',
    copy: 'Turn a voice note, video, photo or written memory into something physical they can keep with the date and the feeling attached.',
  },
  {
    title: 'Long-distance love',
    image: '/occasions/long-distance-love.png',
    position: 'object-[50%_10%]',
    headline: 'Keep something personal close when you cannot be.',
    copy: 'Send a private moment they can unlock on the hard days, the good days, or whenever hearing from you matters most.',
  },
  {
    title: 'Just because',
    image: '/occasions/just-because.png',
    position: 'object-[50%_8%]',
    headline: 'Some gifts matter because no occasion required them.',
    copy: 'Create a small surprise around a memory, thank-you, apology or message that deserves more weight than another text.',
  },
];

function formatCurrency(price?: string | null, currency?: string | null) {
  if (!price) return '';
  const code = currency?.toUpperCase();
  const symbol = code === 'EUR' ? '€' : code === 'USD' ? '$' : code || '';
  return `${symbol}${Number(price).toFixed(2)}`;
}

function normalizedProductName(title: string) {
  const t = title.toLowerCase();
  if (t.includes('7') || t.includes('seven')) return '7-Key Bundle';
  if (t.includes('4') || t.includes('four')) return '4-Key Bundle';
  return 'Single Key';
}

function getProductDetails(title: string) {
  const name = normalizedProductName(title);
  if (name === '7-Key Bundle') {
    return {
      count: '7 cards · 7 private memories',
      explanation: 'Seven individual UNIKMO cards, each unlocking its own private moment.',
      use: 'Best for a sequence of meaningful moments',
      button: 'Choose 7 Cards',
      bestValue: true,
    };
  }
  if (name === '4-Key Bundle') {
    return {
      count: '4 cards · 4 private memories',
      explanation: 'Four individual UNIKMO cards, each unlocking its own private moment.',
      use: 'Best for a multi-part gift',
      button: 'Choose 4 Cards',
      bestValue: false,
    };
  }
  return {
    count: '1 card · 1 private memory',
    explanation: 'One UNIKMO card unlocking one private video, voice note, photo or message.',
    use: 'Best for one person, one occasion',
    button: 'Choose Single',
    bestValue: false,
  };
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
        <div key={slide.image} className={`absolute inset-0 transition-opacity duration-700 ${i === index ? 'opacity-100' : 'pointer-events-none opacity-0'}`} aria-hidden={i !== index}>
          <Image src={slide.image} alt={slide.caption} fill priority={i === 0} sizes="(max-width:1100px) 94vw, 980px" className={`object-cover ${slide.position}`} />
        </div>
      ))}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#17232A]/35 to-transparent" />
      <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-6 sm:left-7 sm:right-7">
        <p className="max-w-[70%] text-left text-[11px] leading-relaxed text-white/95 sm:text-[13px]">{slides[index].caption}</p>
        <div className="flex gap-2" aria-label="Hero story slides">
          {slides.map((slide, i) => <button key={slide.image} type="button" onClick={() => setIndex(i)} aria-label={`Show story image ${i + 1}`} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`} />)}
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#22323A]/[0.06] bg-[#FCF9F4]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center px-5 sm:px-8 lg:px-12">
        <a href="#top" aria-label="UNIKMO home"><Image src="/unikmo-logo-header.png" alt="UNIKMO — The Key to Your Memory" width={729} height={220} priority className="h-8 w-auto sm:h-9" /></a>
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

function CheckLine({ children }: { children: React.ReactNode }) {
  return <li className="flex items-start gap-3 text-left text-[12px] leading-[1.55] text-[#22323A]/68"><span className="mt-[2px] flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full border border-[#B38846]/45 text-[10px] font-semibold text-[#B38846]">✓</span><span>{children}</span></li>;
}

function ProductStage({ side }: { side: 'front' | 'back' }) {
  const isFront = side === 'front';
  return (
    <figure>
      <div className="relative aspect-[1.48/1] overflow-hidden rounded-[22px] border border-[#22323A]/[0.07] bg-[radial-gradient(circle_at_50%_38%,#FFFDF9_0%,#F3EAE0_58%,#E8DDD1_100%)] shadow-[0_18px_45px_rgba(34,50,58,.08)]">
        <div className="absolute bottom-[10%] left-[14%] right-[14%] h-[8%] rounded-full bg-[#846F5B]/15 blur-xl" />
        <div className="absolute inset-[9%] overflow-hidden rounded-[8px] border border-white/55 bg-[#F8F2EA] shadow-[0_24px_45px_rgba(40,30,20,.18),0_4px_14px_rgba(40,30,20,.10)]">
          <Image src={isFront ? '/card-front.png' : '/card-back.png'} alt={isFront ? 'Front of the UNIKMO card' : 'Back of the UNIKMO card with QR code and private key'} fill className="object-cover" sizes="(min-width:768px) 42vw, 86vw" />
        </div>
      </div>
      <figcaption className="mt-3 text-center text-[11px] uppercase tracking-[0.18em] text-[#22323A]/55">{isFront ? 'Front' : 'Back'}</figcaption>
    </figure>
  );
}

export default function TestPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [storeDomain, setStoreDomain] = useState('');
  const [activeOccasion, setActiveOccasion] = useState(0);

  useEffect(() => {
    fetch('/api/products')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('product fetch failed'))))
      .then((data: ProductsResponse) => { setProducts(data.products || []); setStoreDomain(data.storeDomain || ''); })
      .catch(() => { setProducts([]); setStoreDomain(''); });
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

  const active = occasions[activeOccasion];
  const fallbackProducts: Product[] = [
    { id: 'single', title: 'Single Key', image: '/cardfrontunikmo.jpg', price: '24', currencyCode: 'USD' },
    { id: 'four', title: '4-Key Bundle', image: '/cardfrontsite4.png', price: '64', currencyCode: 'USD' },
    { id: 'seven', title: '7-Key Bundle', image: '/cardfrontsite7.png', price: '72', currencyCode: 'USD' },
  ];

  return (
    <div className="min-h-screen bg-[#FCF9F4] text-[#22323A]">
      <Header />
      <main>
        <section id="top" className="px-5 pb-14 pt-12 text-center sm:px-8 sm:pb-16 sm:pt-16 lg:pt-20">
          <h1 className="mx-auto max-w-[760px] font-serif text-[30px] leading-[1.08] tracking-[-0.025em] sm:text-[38px] lg:text-[46px]">Give a moment. They’ll keep it forever.</h1>
          <p className="mx-auto mt-5 max-w-[760px] text-[15px] leading-[1.62] text-[#22323A]/72 sm:text-[17px]"><strong className="font-semibold text-[#22323A]">Turn a video, voice note, photo or message into a beautiful physical card.</strong> They scan it to unlock your private moment.</p>
          <div className="mt-7 sm:mt-9"><HeroCarousel /></div>
          <div className="mx-auto mt-6 flex max-w-[620px] flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-[#22323A]/55 sm:text-[12px]"><span>No app required</span><span aria-hidden="true">•</span><span>Private by design</span><span aria-hidden="true">•</span><span>Made to revisit</span></div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"><a href="#shop" className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-[#B38846] px-7 text-[11px] font-medium text-white transition hover:bg-[#9D773D]">Choose Your Card</a><a href="#how" className="inline-flex min-h-[44px] items-center text-[11px] font-medium text-[#22323A]/70 underline decoration-[#B38846]/50 underline-offset-4">See how it works</a></div>
        </section>

        <section className="border-y border-[#22323A]/[0.06] bg-[#F8F2EB] px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-[1120px]">
            <div className="text-center"><p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B38846]">One card. Two sides.</p><h2 className="mt-3 font-serif text-[31px] sm:text-[40px]">The card is the key. The memory is the gift.</h2><p className="mx-auto mt-3 max-w-[560px] text-[13px] leading-relaxed text-[#22323A]/60 sm:text-[14px]">The real UNIKMO card — front and back.</p></div>
            <div className="mt-10 grid gap-6 md:grid-cols-2"><ProductStage side="front" /><ProductStage side="back" /></div>
          </div>
        </section>

        <section id="how" className="px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-[1120px]"><p className="text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B38846]">How it works</p><div className="mt-9 grid gap-7 md:grid-cols-4">{[
            ['01', 'Create', 'Add a private video, voice note, photo or message.'],
            ['02', 'Give', 'Your memory is connected to the physical UNIKMO card.'],
            ['03', 'Scan', 'They scan the QR code and enter the private key.'],
            ['04', 'Feel', 'The moment opens — and can be revisited later.'],
          ].map(([n, title, body]) => <article key={n} className="text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#B38846]/40 text-[11px] font-semibold text-[#B38846]">{n}</div><h3 className="mt-4 font-serif text-[22px]">{title}</h3><p className="mx-auto mt-2 max-w-[220px] text-[12px] leading-relaxed text-[#22323A]/58">{body}</p></article>)}</div></div>
        </section>

        <section id="moments" className="bg-[#F8F2EB] px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-[1160px]">
            <div className="text-center"><p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B38846]">Picture who it is for</p><h2 className="mt-3 font-serif text-[31px] sm:text-[40px]">For life’s meaningful moments.</h2></div>
            <div className="mx-auto mt-8 grid max-w-[860px] grid-cols-2 gap-2 rounded-[16px] border border-[#22323A]/[0.07] bg-[#FCF9F4]/70 p-2 sm:grid-cols-4">{occasions.map((occasion, index) => <button key={occasion.title} type="button" onClick={() => setActiveOccasion(index)} aria-pressed={activeOccasion === index} className={`min-h-[48px] rounded-[11px] px-3 py-2 text-[10px] font-medium uppercase tracking-[0.12em] transition ${activeOccasion === index ? 'bg-[#22323A] text-white shadow-sm' : 'text-[#22323A]/58 hover:bg-white hover:text-[#22323A]'}`}>{occasion.title}</button>)}</div>
            <div className="mt-6 overflow-hidden rounded-[22px] border border-[#22323A]/[0.07] bg-[#FCF9F4] shadow-[0_18px_55px_rgba(34,50,58,.07)]">
              <div className="grid lg:grid-cols-[1.35fr_.85fr]">
                <div className="relative aspect-[16/10] min-h-[300px] overflow-hidden lg:aspect-auto lg:min-h-[480px]">
                  <Image key={active.image} src={active.image} alt={`${active.title} gifting moment`} fill className={`object-cover scale-[1.18] ${active.position}`} style={{ filter: 'saturate(.84) contrast(.96) brightness(1.03)' }} sizes="(max-width:1024px) 100vw, 62vw" />
                  <div className="absolute inset-0 bg-[#D8C8B8]/[0.035] mix-blend-multiply" />
                </div>
                <div className="flex items-center p-7 text-left sm:p-10 lg:p-12"><div><p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#B38846]">{active.title}</p><h3 className="mt-4 max-w-[390px] font-serif text-[28px] leading-[1.15] sm:text-[34px]">{active.headline}</h3><p className="mt-5 max-w-[410px] text-[13px] leading-[1.75] text-[#22323A]/62 sm:text-[14px]">{active.copy}</p><a href="#shop" className="mt-7 inline-flex items-center gap-2 text-[11px] font-medium text-[#22323A] underline decoration-[#B38846]/55 underline-offset-4">Choose a card <span aria-hidden="true">→</span></a></div></div>
              </div>
            </div>
          </div>
        </section>

        <section id="stories" className="px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-[900px]">
            <div className="text-center"><p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B38846]">Trust comes from people</p><h2 className="mt-3 font-serif text-[31px] sm:text-[40px]">The feeling is the proof.</h2></div>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <article className="overflow-hidden rounded-[20px] border border-[#22323A]/[0.07] bg-white/45"><div className="relative aspect-[4/3]"><Image src="/testimonials/customer-london.jpg" alt="Matt L., London" fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" /></div><div className="p-6"><blockquote className="font-serif text-[20px] leading-[1.42]">“I gave it to my partner for her birthday. <strong className="font-semibold text-[#17232A]">She cried within seconds.</strong> It felt deeply personal — not just another gift.”</blockquote><p className="mt-4 text-[11px] text-[#22323A]/55">— Matt L., London</p></div></article>
              <article className="overflow-hidden rounded-[20px] border border-[#22323A]/[0.07] bg-white/45"><div className="relative aspect-[4/3]"><Image src="/testimonials/customer-newyork.jpg" alt="Sophie M., New York" fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" /></div><div className="p-6"><blockquote className="font-serif text-[20px] leading-[1.42]">“Such a simple idea, but <strong className="font-semibold text-[#17232A]">incredibly powerful.</strong> The moment we unlocked the message together, it became something we’ll remember.”</blockquote><p className="mt-4 text-[11px] text-[#22323A]/55">— Sophie M., New York</p></div></article>
            </div>
          </div>
        </section>

        <section id="shop" className="bg-[#F8F2EB] px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-[1240px]">
            <div className="text-center"><p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B38846]">Choose your card</p><h2 className="mt-3 font-serif text-[31px] sm:text-[40px]">Pick the way you want to give it.</h2><p className="mx-auto mt-3 max-w-[610px] text-[13px] leading-relaxed text-[#22323A]/60 sm:text-[14px]">Same UNIKMO experience. Choose how many separate cards — and private memories — you want to give.</p></div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">{(orderedProducts.length ? orderedProducts : fallbackProducts).map((product) => {
              const details = getProductDetails(product.title);
              const displayName = normalizedProductName(product.title);
              const checkoutHref = product.variantId && storeDomain ? `https://${storeDomain}/cart/${product.variantId}:1` : '#shop';
              return <article key={product.id} className="relative rounded-[20px] border border-[#22323A]/[0.07] bg-white/60 p-6 text-center shadow-[0_14px_40px_rgba(34,50,58,.04)]">{details.bestValue ? <span className="absolute right-4 top-4 z-10 rounded-full bg-[#22323A] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-white">Best value</span> : null}<div className="relative mx-auto aspect-[3/2] w-full max-w-[390px] overflow-hidden rounded-[16px] bg-[#FAF6F1]">{product.image ? <Image src={product.image} alt={product.imageAlt || displayName} fill unoptimized={product.image.startsWith('http')} className="object-contain p-2" sizes="390px" /> : null}</div><h3 className="mt-5 font-serif text-[24px]">{displayName}</h3><p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[#B38846]">{details.count}</p>{product.price ? <p className="mt-3 text-[18px] font-medium text-[#22323A]">{formatCurrency(product.price, product.currencyCode)}</p> : null}<ul className="mx-auto mt-5 max-w-[300px] space-y-3 border-t border-[#22323A]/[0.07] pt-5"><CheckLine>{details.explanation}</CheckLine><CheckLine>QR code + private access code on every card</CheckLine><CheckLine>{details.use}</CheckLine></ul><a href={checkoutHref} className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[#22323A] px-6 text-[11px] font-medium text-white transition hover:bg-[#17232A]">{details.button}</a></article>;
            })}</div>
          </div>
        </section>

        <section className="border-t border-[#22323A]/[0.06] bg-[#FCF9F4] px-5 py-8 sm:px-8"><div className="mx-auto grid max-w-[1180px] gap-5 sm:grid-cols-2 lg:grid-cols-4">{[
          ['lock', 'Private & secure', 'Your moments stay private.'],
          ['phone', 'No app required', 'They open it in the browser.'],
          ['leaf', 'A tree planted', 'For every order.'],
          ['quality', 'Premium quality', 'Made to be kept.'],
        ].map(([kind, title, body]) => <div key={title} className="flex items-center gap-4"><div className="text-[#B38846]"><TrustIcon kind={kind as 'lock' | 'phone' | 'leaf' | 'quality'} /></div><div><p className="text-[12px] font-medium">{title}</p><p className="mt-1 text-[11px] text-[#22323A]/55">{body}</p></div></div>)}</div></section>
      </main>
      <footer className="border-t border-[#22323A]/[0.07] bg-[#F8F2EB] px-5 py-10 sm:px-8"><div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left"><Image src="/unikmo-logo-header.png" alt="UNIKMO" width={729} height={220} className="h-8 w-auto" /><p className="text-[11px] text-[#22323A]/50">Test page only — production unchanged.</p></div></footer>
    </div>
  );
}
