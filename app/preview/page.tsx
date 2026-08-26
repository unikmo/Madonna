'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

type ProductVariant = {
  id?: string | null;
  title?: string | null;
  price?: string | null;
};

type Product = {
  id: string;
  title: string;
  handle?: string;
  variantId?: string | null;
  price?: string | null;
  currencyCode?: string | null;
  variants?: ProductVariant[];
};

type ProductsResponse = {
  products?: Product[];
  storeDomain?: string;
};

const GOLD = '#B38846';
const NAVY = '#22323A';
const CREAM = '#FCF9F4';

function formatCurrency(price?: string | null, currency?: string | null) {
  if (!price) return '';
  const code = currency?.toUpperCase();
  const symbol = code === 'EUR' ? '€' : code === 'USD' ? '$' : code || '';
  return `${symbol}${Number(price).toFixed(2)}`;
}

function KeyMark({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 72" fill="none" aria-hidden>
      <path d="M16 2C8.8 2 3 7.8 3 15c0 5.7 3.7 10.6 8.8 12.3V70h8.4V48h7v-8h-7v-5h9v-8h-9v-.7C25.3 24.6 29 19.7 29 14 29 7.4 23.2 2 16 2Zm0 8a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z" fill={GOLD}/>
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="6.5" y="2" width="11" height="20" rx="2" />
      <path d="M10 18.5h4" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <circle cx="12" cy="7" r="4" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}

function StepIcon({ kind }: { kind: 'create' | 'make' | 'unlock' }) {
  if (kind === 'create') {
    return (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
        <path d="m4 20 4.2-1 10-10-3.2-3.2-10 10L4 20Z" /><path d="m13.8 7 3.2 3.2" />
      </svg>
    );
  }
  if (kind === 'make') {
    return (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
        <path d="m12 2 8 4-8 4-8-4 8-4Z" /><path d="m4 10 8 4 8-4M4 14l8 4 8-4" />
      </svg>
    );
  }
  return <LockIcon />;
}

function CardStack({ count }: { count: 1 | 4 | 7 }) {
  const visible = count === 1 ? 1 : count === 4 ? 4 : 6;
  return (
    <div className="relative mx-auto h-[230px] w-[290px] sm:h-[250px] sm:w-[320px]" aria-label={`${count} UNIKMO card${count > 1 ? 's' : ''}`}>
      {Array.from({ length: visible }).map((_, i) => {
        const centered = i - (visible - 1) / 2;
        const rotate = count === 1 ? 0 : centered * 3.2;
        const x = count === 1 ? 0 : centered * 15;
        const y = Math.abs(centered) * 2.5;
        return (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 h-[184px] w-[272px] overflow-hidden rounded-[15px] border border-[#22323A]/[0.07] bg-[#EFE5DA] shadow-[0_16px_32px_rgba(34,50,58,0.12)]"
            style={{
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${rotate}deg)`,
              zIndex: i + 1,
            }}
          >
            <Image src="/card-front.png" alt="" fill className="object-cover" sizes="272px" />
          </div>
        );
      })}
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#22323A]/[0.06] bg-[#FCF9F4]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center px-5 sm:px-8 lg:px-12">
        <a href="#top" className="inline-flex items-center gap-3" aria-label="UNIKMO home">
          <KeyMark className="h-9 w-4" />
          <span className="font-serif text-[23px] tracking-[0.24em] text-[#22323A]">UNIKMO</span>
        </a>
        <nav className="ml-auto hidden items-center gap-8 text-[11px] text-[#22323A]/70 md:flex">
          <a href="#how" className="hover:text-[#B38846]">How it works</a>
          <a href="#occasions" className="hover:text-[#B38846]">Occasions</a>
          <a href="#stories" className="hover:text-[#B38846]">Stories</a>
          <a href="/faq" className="hover:text-[#B38846]">FAQ</a>
        </nav>
        <a href="#shop" className="ml-auto rounded-lg bg-[#B38846] px-5 py-3 text-[11px] font-medium text-white shadow-[0_9px_25px_rgba(179,136,70,.22)] transition hover:bg-[#9D773D] md:ml-8">
          Choose Your Card
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-[#FCF9F4] px-5 pb-10 pt-14 sm:px-8 sm:pt-20 lg:pt-24">
      <div className="mx-auto max-w-[1120px] text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#B38846]">The key to your memory</p>
        <h1 className="mx-auto mt-5 max-w-[900px] font-serif text-[48px] leading-[0.98] tracking-[-0.035em] text-[#22323A] sm:text-[64px] lg:text-[78px]">
          A card that unlocks<br />a private memory.
        </h1>
        <p className="mx-auto mt-6 max-w-[620px] text-[15px] leading-[1.7] text-[#22323A]/68 sm:text-[17px]">
          Turn a private video, voice note, photo or message into a beautifully made card they can hold — and return to whenever it matters.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="#shop" className="inline-flex min-h-[50px] items-center justify-center rounded-lg bg-[#B38846] px-7 text-[12px] font-medium text-white transition hover:bg-[#9D773D]">Choose Your Card</a>
          <a href="#how" className="inline-flex min-h-[50px] items-center justify-center rounded-lg border border-[#22323A]/20 bg-white/40 px-7 text-[12px] font-medium text-[#22323A] transition hover:border-[#B38846]/45">See how it works</a>
        </div>

        <div className="relative mx-auto mt-11 h-[370px] max-w-[720px] sm:h-[430px]">
          <div className="absolute bottom-3 left-1/2 h-[54px] w-[78%] -translate-x-1/2 rounded-[50%] bg-[#D7CCBE]/70 blur-[1px]" />
          <div className="absolute bottom-[38px] left-1/2 h-[58px] w-[70%] -translate-x-1/2 rounded-[50%] border border-[#CFC2B3] bg-[#EEE5DB] shadow-[0_14px_35px_rgba(34,50,58,.09)]" />
          <div className="absolute left-1/2 top-0 h-[310px] w-[460px] max-w-[86vw] -translate-x-1/2 overflow-hidden rounded-[19px] border border-[#22323A]/[0.07] bg-[#EEE3D7] shadow-[0_26px_55px_rgba(34,50,58,.14)] sm:h-[350px] sm:w-[520px]">
            <Image src="/card-front.png" alt="Front of the UNIKMO card with the gold key design" fill priority className="object-cover" sizes="520px" />
          </div>
        </div>
      </div>
    </section>
  );
}

const trust = [
  { icon: <LockIcon />, title: 'Private by default', body: 'Only the people you share with can access.' },
  { icon: <PhoneIcon />, title: 'No app required', body: 'Works instantly on any browser.' },
  { icon: <PersonIcon />, title: 'No recipient login', body: 'They scan and unlock your memory.' },
];

function TrustStrip() {
  return (
    <section className="border-y border-[#22323A]/[0.06] bg-white/55">
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 px-5 py-3 sm:grid-cols-3 sm:px-8">
        {trust.map((item, i) => (
          <div key={item.title} className={`flex items-center gap-4 px-3 py-4 ${i ? 'border-t border-[#22323A]/[0.06] sm:border-l sm:border-t-0' : ''}`}>
            <div className="text-[#B38846]">{item.icon}</div>
            <div>
              <h3 className="text-[12px] font-medium text-[#22323A]">{item.title}</h3>
              <p className="mt-1 text-[11px] leading-relaxed text-[#22323A]/55">{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CardExperience() {
  return (
    <section className="bg-[#F8F2EB] px-5 py-16 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-[1180px]">
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B38846]">Made to connect</p>
          <h2 className="mt-3 font-serif text-[34px] text-[#22323A] sm:text-[44px]">One card. Two sides. One private memory.</h2>
          <p className="mx-auto mt-3 max-w-[580px] text-[14px] leading-relaxed text-[#22323A]/60">The front is the keepsake. The back gives access to the private memory you created.</p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <figure>
            <div className="relative aspect-[1.48/1] overflow-hidden rounded-[20px] border border-[#22323A]/[0.07] bg-[#EFE4D9] shadow-[0_18px_45px_rgba(34,50,58,.08)]">
              <Image src="/card-front.png" alt="Front of the UNIKMO card" fill className="object-cover" sizes="(min-width:768px) 48vw, 94vw" />
            </div>
            <figcaption className="mt-4 text-center font-serif text-[19px] text-[#22323A]">Front — the keepsake</figcaption>
          </figure>
          <figure>
            <div className="relative aspect-[1.48/1] overflow-hidden rounded-[20px] border border-[#22323A]/[0.07] bg-[#F3EBE2] shadow-[0_18px_45px_rgba(34,50,58,.08)]">
              <Image src="/card-back.png" alt="Current back of the UNIKMO card with QR code and private access code" fill className="object-cover" sizes="(min-width:768px) 48vw, 94vw" />
            </div>
            <figcaption className="mt-4 text-center font-serif text-[19px] text-[#22323A]">Back — QR + private access code</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

const steps = [
  { n: '01', icon: 'create' as const, title: 'Create', body: 'Add your video, voice note, photo or message.' },
  { n: '02', icon: 'make' as const, title: 'We make it', body: 'Your memory is connected to a beautifully made UNIKMO card.' },
  { n: '03', icon: 'unlock' as const, title: 'They unlock it', body: 'They scan the QR code, enter the private code and open your memory.' },
];

function HowItWorks() {
  return (
    <section id="how" className="bg-[#FCF9F4] px-5 py-16 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-[1120px]">
        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B38846]">How it works</p>
        <div className="mt-9 grid grid-cols-1 gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <article key={step.n} className="relative rounded-[18px] border border-[#22323A]/[0.08] bg-white/45 px-7 py-8 text-center">
              <span className="absolute -top-4 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-[#B38846] text-[11px] text-white">{step.n}</span>
              <div className="mx-auto flex h-10 items-center justify-center text-[#22323A]"><StepIcon kind={step.icon} /></div>
              <h3 className="mt-3 font-serif text-[24px] text-[#22323A]">{step.title}</h3>
              <p className="mx-auto mt-2 max-w-[245px] text-[12px] leading-relaxed text-[#22323A]/58">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CheckoutModal({ product, storeDomain, onClose }: { product: Product; storeDomain: string; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [delivery, setDelivery] = useState<'physical' | 'digital'>('physical');
  const [error, setError] = useState('');

  const variantId = useMemo(() => {
    const variants = product.variants || [];
    if (!variants.length) return product.variantId || null;
    const physical = variants.find((v) => /physical/i.test(v.title || ''));
    const digital = variants.find((v) => /digital/i.test(v.title || ''));
    return (delivery === 'physical' ? physical || digital : digital || physical)?.id || variants[0]?.id || product.variantId || null;
  }, [delivery, product]);

  const buy = () => {
    const value = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!storeDomain || !variantId) {
      setError('Checkout is not available in this preview.');
      return;
    }
    const params = new URLSearchParams();
    params.set('checkout[email]', value);
    params.set('attributes[Delivery preference]', delivery === 'physical' ? 'Physical card + digital access' : 'Digital card ( Images )');
    window.location.href = `https://${storeDomain}/cart/${variantId}:1?checkout&${params.toString()}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4" onClick={onClose} role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-[22px] bg-[#FCF9F4] p-6 shadow-2xl sm:p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#B38846]">Your card</p>
            <h3 className="mt-2 font-serif text-[28px] text-[#22323A]">{product.title}</h3>
            <p className="mt-1 text-[14px] font-medium text-[#22323A]">{formatCurrency(product.price, product.currencyCode)}</p>
          </div>
          <button onClick={onClose} className="text-2xl leading-none text-[#22323A]/50" aria-label="Close">×</button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {(['physical', 'digital'] as const).map((type) => (
            <button key={type} onClick={() => setDelivery(type)} className={`rounded-xl border px-4 py-4 text-left text-[12px] transition ${delivery === type ? 'border-[#B38846] bg-[#B38846]/8' : 'border-[#22323A]/12 bg-white/45'}`}>
              <span className="block font-medium text-[#22323A]">{type === 'physical' ? 'Physical card + digital access' : 'Digital card'}</span>
              <span className="mt-1 block text-[#22323A]/55">{type === 'physical' ? 'We ship the card and email your private access code.' : 'Receive the digital card and private access code by email.'}</span>
            </button>
          ))}
        </div>

        <label className="mt-5 block text-[12px] font-medium text-[#22323A]">Email</label>
        <input value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} type="email" className="mt-2 w-full rounded-xl border border-[#22323A]/12 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#B38846]" placeholder="you@example.com" />
        {error ? <p className="mt-2 text-[12px] text-red-600">{error}</p> : null}
        <button onClick={buy} className="mt-5 w-full rounded-lg bg-[#22323A] px-5 py-4 text-[12px] font-medium text-white transition hover:bg-[#17252C]">Buy now</button>
      </div>
    </div>
  );
}

function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [storeDomain, setStoreDomain] = useState('');
  const [selected, setSelected] = useState<Product | null>(null);

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data: ProductsResponse) => {
        setProducts(data.products || []);
        setStoreDomain(data.storeDomain || '');
      })
      .catch(() => setProducts([]));
  }, []);

  const tiers = [
    { count: 1 as const, title: 'Single Card', product: products[0] },
    { count: 4 as const, title: '4-Card Set', product: products[1] },
    { count: 7 as const, title: '7-Card Set', product: products[2] },
  ];

  return (
    <section id="shop" className="bg-[#F8F2EB] px-5 py-16 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-[1240px]">
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B38846]">Choose your set</p>
          <h2 className="mt-3 font-serif text-[36px] text-[#22323A] sm:text-[46px]">Find the perfect fit.</h2>
          <p className="mx-auto mt-3 max-w-[560px] text-[14px] leading-relaxed text-[#22323A]/58">No invented packaging. Just the actual UNIKMO cards, shown as the sets you receive.</p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {tiers.map((tier) => (
            <article key={tier.count} className="group rounded-[20px] border border-[#22323A]/[0.07] bg-white/50 p-5 text-center transition hover:-translate-y-1 hover:bg-white/75 hover:shadow-[0_18px_42px_rgba(34,50,58,.08)]">
              <CardStack count={tier.count} />
              <h3 className="font-serif text-[26px] text-[#22323A]">{tier.title}</h3>
              <p className="mt-2 text-[14px] font-medium text-[#22323A]">{tier.product ? formatCurrency(tier.product.price, tier.product.currencyCode) : 'Loading price…'}</p>
              <p className="mx-auto mt-2 min-h-10 max-w-[240px] text-[12px] leading-relaxed text-[#22323A]/55">{tier.count === 1 ? 'One beautifully made card with one private memory.' : tier.count === 4 ? 'Four cards for four moments that matter most.' : 'Seven cards for a story told over time.'}</p>
              <button disabled={!tier.product} onClick={() => tier.product && setSelected(tier.product)} className="mt-5 rounded-lg bg-[#B38846] px-6 py-3 text-[11px] font-medium text-white transition hover:bg-[#9D773D] disabled:opacity-45">Choose This</button>
            </article>
          ))}
        </div>
      </div>
      {selected ? <CheckoutModal product={selected} storeDomain={storeDomain} onClose={() => setSelected(null)} /> : null}
    </section>
  );
}

const occasions = [
  ['Birthday', 'Say what a birthday card never quite could.'],
  ['Anniversary', 'Give your shared story somewhere to live.'],
  ['Long-distance love', 'Keep something personal close, even when you are not.'],
  ['Just because', 'Some things matter precisely because no occasion requires them.'],
];

function Occasions() {
  return (
    <section id="occasions" className="bg-[#FCF9F4] px-5 py-16 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-[1120px]">
        <h2 className="text-center font-serif text-[34px] text-[#22323A] sm:text-[44px]">Perfect for life’s meaningful moments.</h2>
        <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {occasions.map(([title, body]) => (
            <article key={title} className="rounded-[18px] border border-[#22323A]/[0.08] bg-white/35 px-5 py-7 text-center">
              <div className="mx-auto flex h-10 items-center justify-center text-[#B38846]"><HeartIcon /></div>
              <h3 className="mt-3 font-serif text-[21px] text-[#22323A]">{title}</h3>
              <p className="mt-2 text-[12px] leading-relaxed text-[#22323A]/55">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  {
    quote: 'I gave it to my partner for her birthday. She cried within seconds. It felt deeply personal — not just another gift.',
    name: 'Matt L., London',
    image: '/testimonials/customer-london.jpg',
  },
  {
    quote: "Such a simple idea, but incredibly powerful. The moment we unlocked the message together, it became something we'll remember forever.",
    name: 'Sophie M., New York',
    image: '/testimonials/customer-newyork.jpg',
  },
];

function Testimonials() {
  return (
    <section id="stories" className="bg-[#F4ECE3] px-5 py-16 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-[1160px]">
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B38846]">Their words</p>
          <h2 className="mt-3 font-serif text-[34px] text-[#22323A] sm:text-[44px]">The moment they open it is the gift.</h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {testimonials.map((item) => (
            <article key={item.name} className="grid overflow-hidden rounded-[22px] border border-[#22323A]/[0.07] bg-[#FCF9F4] sm:grid-cols-[180px_1fr]">
              <div className="relative min-h-[220px] sm:min-h-full">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="180px" />
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-8">
                <div className="font-serif text-[50px] leading-none text-[#B38846]/55">“</div>
                <blockquote className="font-serif text-[23px] leading-[1.35] text-[#22323A]">{item.quote}</blockquote>
                <p className="mt-5 text-[11px] text-[#22323A]/55">— {item.name}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-[#FCF9F4] px-5 py-16 text-center sm:px-8 lg:py-20">
      <div className="mx-auto max-w-[820px]">
        <h2 className="font-serif text-[40px] leading-[1.05] text-[#22323A] sm:text-[52px]">You already know who it’s for.</h2>
        <p className="mx-auto mt-4 max-w-[520px] text-[14px] leading-relaxed text-[#22323A]/58">Give a moment they can hold, unlock and revisit.</p>
        <a href="#shop" className="mt-7 inline-flex min-h-[48px] items-center justify-center rounded-lg bg-[#B38846] px-7 text-[12px] font-medium text-white transition hover:bg-[#9D773D]">Choose Your Card</a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#22323A]/[0.07] bg-[#F8F2EB] px-5 py-10 sm:px-8">
      <div className="mx-auto grid max-w-[1180px] gap-8 sm:grid-cols-3">
        <div>
          <div className="inline-flex items-center gap-3"><KeyMark className="h-8 w-4" /><span className="font-serif text-[21px] tracking-[0.2em] text-[#22323A]">UNIKMO</span></div>
          <p className="mt-3 max-w-[260px] text-[11px] leading-relaxed text-[#22323A]/50">The key to your memory.</p>
        </div>
        <div className="text-[11px] leading-7 text-[#22323A]/58">
          <a href="#shop" className="block hover:text-[#B38846]">Choose your card</a>
          <a href="#how" className="block hover:text-[#B38846]">How it works</a>
          <a href="/faq" className="block hover:text-[#B38846]">FAQ</a>
        </div>
        <div className="text-[11px] leading-7 text-[#22323A]/58 sm:text-right">
          <a href="/" className="block hover:text-[#B38846]">Current site</a>
          <p>Preview implementation — no production mutation.</p>
        </div>
      </div>
    </footer>
  );
}

export default function MockupOnePreview() {
  return (
    <div className="min-h-screen bg-[#FCF9F4] text-[#22323A] selection:bg-[#B38846]/25">
      <Header />
      <main>
        <Hero />
        <TrustStrip />
        <CardExperience />
        <HowItWorks />
        <Shop />
        <Occasions />
        <Testimonials />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
