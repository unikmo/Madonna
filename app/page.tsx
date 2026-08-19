'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type ReactNode } from 'react';

/** Matches cream in product card photography — avoids white letterboxing around images */
const PRODUCT_IMAGE_BG = '#FAF6F1';
const productImageFrameClass =
  'relative mx-auto w-full max-w-[460px] sm:max-w-[500px] lg:max-w-[560px] aspect-[3/2] mb-6 overflow-hidden rounded-[18px]';
const productImageClass =
  'absolute inset-0 w-full h-full object-contain object-center p-3 sm:p-5 drop-shadow-[0_14px_18px_rgba(0,0,0,0.12)] group-hover:scale-[1.02] transition-transform duration-500';

function formatCurrency(price?: string | null, currencyCode?: string | null): string {
  if (price == null) return '';
  const symbol =
    currencyCode?.toUpperCase?.() === 'EUR' ? '€' : currencyCode?.toUpperCase?.() === 'USD' ? '$' : (currencyCode ?? '');
  return `${symbol}${Number(price).toFixed(2)}`;
}

/** Plain price display. No discount math — pricing is the real Shopify price everywhere it appears. */
function ProductPrice({ price, currencyCode }: { price?: string | null; currencyCode?: string | null }) {
  if (price == null) return null;
  return (
    <p className="mt-2 text-[15px] sm:text-[16px] font-semibold text-[#2D2926]">
      {formatCurrency(price, currencyCode)}
    </p>
  );
}

const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'UNIKMO',
  url: 'https://www.unikmo.com/',
  sameAs: [
    'https://www.instagram.com/myunikmo',
    'https://www.tiktok.com/@myunikmo',
  ],
  description:
    'UNIKMO turns a private video, voice note, photo, or written message into a physical card someone can keep and revisit.',
};

const PRODUCTS_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'UNIKMO Memory Cards',
  itemListElement: [
    {
      '@type': 'Product',
      position: 1,
      name: 'Single Memory Card',
      description: 'One physical card connected to one private memory.',
      brand: { '@type': 'Brand', name: 'UNIKMO' },
      offers: { '@type': 'Offer', price: '24.00', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
    },
    {
      '@type': 'Product',
      position: 2,
      name: '4-Card Set',
      description: 'Four moments for a birthday, anniversary, or open-when story.',
      brand: { '@type': 'Brand', name: 'UNIKMO' },
      offers: { '@type': 'Offer', price: '64.00', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
    },
    {
      '@type': 'Product',
      position: 3,
      name: '7-Card Collection',
      description: 'A full memory journey told over time.',
      brand: { '@type': 'Brand', name: 'UNIKMO' },
      offers: { '@type': 'Offer', price: '72.00', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
    },
  ],
};

export default function LandingPage() {
  const [showContactModal, setShowContactModal] = useState(false);
  const [showCreateMomentModal, setShowCreateMomentModal] = useState(false);
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showImprintModal, setShowImprintModal] = useState(false);

  useEffect(() => {
    const openIfHash = () => {
      if (typeof window !== 'undefined' && window.location.hash === '#how-it-works') {
        setShowHowItWorksModal(true);
      }
    };
    openIfHash();
    window.addEventListener('hashchange', openIfHash);
    return () => window.removeEventListener('hashchange', openIfHash);
  }, []);

  const handleCreateMomentClick = () => {
    setShowCreateMomentModal(true);
  };

  return (
    <div className="min-h-screen bg-[#FDF9F5] text-[#1E1B18]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PRODUCTS_JSON_LD) }}
      />
      <SiteHeader onHowItWorksClick={() => setShowHowItWorksModal(true)} />

      <main>
        <Hero />
        <HowItWorks2 />
        <WhenToUseUnikmo />
        <ProductExperience />
        <StoryIn
          showCreateMomentModal={showCreateMomentModal}
          setShowCreateMomentModal={setShowCreateMomentModal}
        />
        <PreFooterTrustStrip />
        <SocialProof />
        <QuestionsSection onContactClick={() => setShowContactModal(true)} />
        <FinalCta onCreateMomentClick={handleCreateMomentClick} />
      </main>

      <SiteFooter
        onContactClick={() => setShowContactModal(true)}
        onPrivacyClick={() => setShowPrivacyModal(true)}
        onTermsClick={() => setShowTermsModal(true)}
        onImprintClick={() => setShowImprintModal(true)}
      />

      {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}
      {showHowItWorksModal && <HowItWorksModal onClose={() => setShowHowItWorksModal(false)} />}
      {showPrivacyModal && <PrivacyModal onClose={() => setShowPrivacyModal(false)} />}
      {showTermsModal && <TermsModal onClose={() => setShowTermsModal(false)} />}
      {showImprintModal && <ImprintModal onClose={() => setShowImprintModal(false)} />}
    </div>
  );
}

function Container({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
  );
}

function Button({
  children,
  href,
  variant = 'primary',
}: {
  children: ReactNode;
  href: string;
  variant?: 'primary' | 'ghost';
}) {
  const base =
    'inline-flex items-center justify-center rounded-full px-6 sm:px-8 py-3 sm:py-4 text-[10px] sm:text-xs tracking-[0.2em] uppercase transition-all duration-300 font-medium hover:scale-105 active:scale-95';
  const styles =
    variant === 'primary'
      ? 'bg-[#1E1B18] text-[#FDF9F5] hover:bg-[#2F2A26] shadow-lg hover:shadow-xl'
      : 'bg-transparent text-[#1E1B18] hover:bg-[#1E1B18]/5';
  return (
    <a className={`${base} ${styles}`} href={href}>
      {children}
    </a>
  );
}

function SiteHeader({
  onHowItWorksClick,
}: {
  onHowItWorksClick: () => void;
}) {
  return (
    <header className="bg-[#FCF9F4] border-b border-[#22323A]/[0.07]">
      <div className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center px-5 sm:px-8 lg:px-12">
        <a href="#top" className="shrink-0 inline-flex items-center" aria-label="UNIKMO home">
          <Image
            src="/unikmo-logo-header.png"
            alt="UNIKMO — The Key to Your Memory"
            width={729}
            height={220}
            priority
            className="h-8 sm:h-9 lg:h-10 w-auto"
          />
        </a>

        <nav className="ml-auto hidden md:flex items-center gap-7 lg:gap-9 text-[12px] text-[#22323A]/75">
          <button type="button" onClick={onHowItWorksClick} className="hover:text-[#B38846] transition-colors">
            How It Works
          </button>
          <a href="#gift-ideas" className="hover:text-[#B38846] transition-colors">Examples</a>
          <a href="#shop" className="hover:text-[#B38846] transition-colors">Pricing</a>
          <a href="#about" className="hover:text-[#B38846] transition-colors">About</a>
        </nav>

        <a
          href="#shop"
          className="ml-auto md:ml-8 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[#B38846] px-5 sm:px-6 text-[11px] sm:text-[12px] font-medium text-white shadow-[0_8px_25px_rgba(179,136,70,0.20)] hover:bg-[#9F783D] transition-colors"
        >
          Create Your Moment
        </a>
      </div>
    </header>
  );
}
const preFooterTrustItems = [
  { label: 'No app required', detail: 'They open the memory in the browser.', icon: <IconSpark /> },
  { label: 'No login', detail: 'The recipient does not need an account.', icon: <IconLock /> },
  { label: 'Private by default', detail: 'The QR code and private code protect access.', icon: <IconShield /> },
  { label: 'No ads', detail: 'Nothing interrupts their moment.', icon: <IconHeart /> },
];

const HERO_SLIDES = [
  {
    image: '/story/matt-writes.png',
    caption: 'Matt wanted to say more than he could fit in a card.',
    position: 'object-[50%_25%]',
  },
  {
    image: '/story/matt-seals.png',
    caption: 'So he turned his message into something she could hold.',
    position: 'object-[50%_25%]',
  },
  {
    image: '/story/she-opens.png',
    caption: 'She opens it — and feels the moment instantly.',
    position: 'object-[30%_20%]',
  },
  {
    image: '/story/she-scans.png',
    caption: 'She scans the card to unlock his private message.',
    position: 'object-[35%_20%]',
  },
  {
    image: '/story/she-watches.png',
    caption: 'And sees his video message, whenever she wants it.',
    position: 'object-[42%_20%]',
  },
];

function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-[360px] sm:min-h-[500px] lg:min-h-[610px] overflow-hidden rounded-[22px] bg-[#E9E0D5] shadow-[0_18px_55px_rgba(44,48,49,0.10)]">
      {HERO_SLIDES.map((slide, i) => (
        <div
          key={slide.image}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          aria-hidden={i !== index}
        >
          <Image
            src={slide.image}
            alt={slide.caption}
            fill
            priority={i === 0}
            sizes="(max-width: 1024px) 100vw, 56vw"
            className={`object-cover ${slide.position}`}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-[#17232A]/45 via-transparent to-transparent pointer-events-none" />

      <div className="absolute left-5 right-5 bottom-5 sm:left-7 sm:right-7 sm:bottom-7 flex items-end justify-between gap-4">
        <p className="max-w-[75%] rounded-2xl bg-[#FCF9F4]/90 backdrop-blur px-4 py-2.5 text-[12px] sm:text-[13px] text-[#22323A]/85 shadow-sm">
          {HERO_SLIDES[index].caption}
        </p>
        <div className="flex gap-1.5 pb-1">
          {HERO_SLIDES.map((slide, i) => (
            <button
              key={slide.image}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show step ${i + 1} of ${HERO_SLIDES.length}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-5 bg-[#FCF9F4]' : 'w-1.5 bg-[#FCF9F4]/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="bg-[#FCF9F4] py-5 sm:py-8 lg:py-10">
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.12fr_0.88fr] gap-7 lg:gap-12 xl:gap-16 items-stretch">
          <HeroCarousel />

          <div className="flex flex-col justify-center py-4 lg:py-8 xl:pr-8">
            <h1 className="font-serif text-[44px] sm:text-[58px] lg:text-[64px] xl:text-[74px] leading-[0.98] tracking-[-0.025em] text-[#22323A]">
              Some moments
              <br />
              deserve <span className="text-[#B38846]">more</span>
              <br />
              <span className="text-[#B38846]">than a message.</span>
            </h1>

            <div className="mt-7 flex items-center gap-3 max-w-[320px] text-[#B38846]" aria-hidden>
              <span className="h-px flex-1 bg-[#B38846]/40" />
              <span className="text-[11px]">♥</span>
              <span className="h-px flex-1 bg-[#B38846]/40" />
            </div>

            <p className="mt-7 max-w-[560px] text-[16px] sm:text-[18px] leading-[1.65] text-[#22323A]/80 font-light">
              Turn a private video, voice note, photo or message into a beautifully made card they can hold — and return to whenever it matters.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-7">
              <a
                href="#shop"
                className="inline-flex min-h-[50px] items-center justify-center rounded-lg bg-[#B38846] px-7 text-[12px] font-medium text-white shadow-[0_10px_28px_rgba(179,136,70,0.22)] hover:bg-[#9F783D] transition-colors"
              >
                Create Your Moment
              </a>
              <a href="#how-it-works" className="inline-flex min-h-[44px] items-center text-[12px] font-medium text-[#22323A]/75 hover:text-[#B38846] transition-colors">
                See how it works <span className="ml-2">→</span>
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-[11px] sm:text-[12px] text-[#22323A]/60">
              <span className="inline-flex items-center gap-2"><span className="text-[#B38846]">▢</span> Private by default</span>
              <span className="inline-flex items-center gap-2"><span className="text-[#B38846]">◫</span> No app</span>
              <span className="inline-flex items-center gap-2"><span className="text-[#B38846]">○</span> No recipient login</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
/** Trust bullets — blush band (same as hero / final CTA). Tree lives in <SiteFooter>, not here. */
function PreFooterTrustStrip() {
  const items = [
    {
      title: 'Private by design',
      body: 'The QR code and private access code keep the memory intended for the people you choose.',
      icon: <IconLock />,
    },
    {
      title: 'No app. No account.',
      body: 'They scan, enter the private code, and open the memory directly in their browser.',
      icon: <IconSpark />,
    },
    {
      title: 'Revisit, anytime',
      body: 'A physical card gives an important digital memory a place to return to.',
      icon: <IconHeart />,
    },
  ];

  return (
    <section aria-label="UNIKMO trust" className="bg-[#F7F0E9] border-y border-[#22323A]/[0.07]">
      <div className="mx-auto grid w-full max-w-[1260px] grid-cols-1 md:grid-cols-3 px-5 sm:px-8">
        {items.map((item, index) => (
          <div
            key={item.title}
            className={`flex gap-4 py-8 sm:py-10 md:px-8 ${index > 0 ? 'border-t md:border-t-0 md:border-l border-[#22323A]/[0.08]' : ''}`}
          >
            <div className="shrink-0 text-[#B38846]">{item.icon}</div>
            <div>
              <h3 className="font-serif text-[22px] text-[#22323A]">{item.title}</h3>
              <p className="mt-2 text-[13px] sm:text-[14px] leading-relaxed text-[#22323A]/60 font-light">{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
function WhenToUseUnikmo() {
  const occasions = [
    {
      title: 'Birthday',
      line: 'Say what a birthday card never quite could.',
      icon: <IconHeart />,
      image: '/occasions/birthday.png',
      position: 'object-[60%_22%]',
    },
    {
      title: 'Anniversary',
      line: 'Give your shared story somewhere to live.',
      icon: <IconSpark />,
      image: '/occasions/anniversary.png',
      position: 'object-[50%_12%]',
    },
    {
      title: 'Long-distance love',
      line: 'Keep something personal close, even when you are not.',
      icon: <IconLock />,
      image: '/occasions/long-distance-love.png',
      position: 'object-[50%_2%]',
    },
    {
      title: 'Just because',
      line: 'Some things matter precisely because no occasion requires them.',
      icon: <IconCode />,
      image: '/occasions/just-because.png',
      position: 'object-[68%_20%]',
    },
  ];

  return (
    <section id="gift-ideas" className="bg-[#FCF9F4] py-14 sm:py-20 lg:py-24 border-t border-[#22323A]/[0.06]">
      <div className="mx-auto w-full max-w-[1260px] px-5 sm:px-8">
        <div className="text-center">
          <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B38846]">
            When to use UNIKMO
          </p>
          <h2 className="mt-4 font-serif text-[30px] sm:text-[38px] lg:text-[44px] text-[#22323A]">
            For the moments you do not want to reduce to a text.
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {occasions.map((occasion, index) => (
            <article
              key={occasion.title}
              className="group overflow-hidden rounded-[20px] border border-[#22323A]/[0.08] bg-white flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={occasion.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className={`object-cover ${occasion.position} transition-transform duration-500 group-hover:scale-[1.03]`}
                />
              </div>

              <div className="p-6 sm:p-7">
                <div className="text-[#B38846]">{occasion.icon}</div>
                <p className="mt-3 mb-2 text-[10px] uppercase tracking-[0.2em] text-[#B38846]/75">
                  0{index + 1}
                </p>
                <h3 className="font-serif text-[26px] leading-tight text-[#22323A]">{occasion.title}</h3>
                <p className="mt-2 text-[13px] sm:text-[14px] leading-relaxed text-[#22323A]/65 font-light">
                  {occasion.line}
                </p>
              </div>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-7 max-w-[760px] text-center text-[12px] sm:text-[13px] leading-relaxed text-[#22323A]/50">
          Imagery above is AI-generated to represent the feeling of a moment. We are collecting real customer photography and will replace these as it comes in.
        </p>
      </div>
    </section>
  );
}
type Product = {
  id: string;
  title: string;
  handle: string;
  image: string | null;
  imageAlt: string;
  variantId: string | null;
  price?: string | null;
  currencyCode?: string | null;
  variants?: { id: string | null; title: string; price?: string | null }[];
};

type StoryInProps = {
  showCreateMomentModal: boolean;
  setShowCreateMomentModal: (v: boolean) => void;
};

function StoryIn({
  showCreateMomentModal,
  setShowCreateMomentModal,
}: StoryInProps) {
  const sectionRef = useRef(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [storeDomain, setStoreDomain] = useState('');
  const [loading, setLoading] = useState(true);
  const [productsRevealed, setProductsRevealed] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    product: Product;
    subtitle: string;
    img: string;
    imageAlt: string;
    displayTitle: string;
    isFirstImage?: boolean;
  } | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
          setStoreDomain(data.storeDomain || '');
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (loading || products.length === 0) return;
    const t = setTimeout(() => setProductsRevealed(true), 50);
    return () => clearTimeout(t);
  }, [loading, products.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.animate-on-scroll').forEach((el, index) => {
              setTimeout(() => {
                el.classList.add('opacity-100', 'translate-y-0');
              }, index * 150);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const items = products.map((product) => {
    let subtitle = 'One physical card connected to one private memory.';
    let tierLabel = 'The Spark';
    let displayTitle = 'Single Memory Card';
    let bestValue = false;
    if (product.title.toLowerCase().includes('4') || product.title.toLowerCase().includes('four')) {
      subtitle = 'Four moments for a birthday, anniversary, or open-when story.';
      tierLabel = 'The Journey';
      displayTitle = '4-Card Set';
    } else if (product.title.toLowerCase().includes('7') || product.title.toLowerCase().includes('seven')) {
      subtitle = 'A full memory journey told over time.';
      tierLabel = 'The History';
      displayTitle = '7-Card Collection';
      bestValue = true;
    }
    return {
      product,
      title: product.title,
      displayTitle,
      tierLabel,
      subtitle,
      bestValue,
      img: product.image || '/placeholder-product.png',
      imageAlt: product.imageAlt || product.title,
      price: product.price,
      currencyCode: product.currencyCode,
    };
  });

  return (
    <section
      ref={sectionRef}
      id="shop"
      className="relative overflow-hidden py-14 sm:py-16 lg:py-24 bg-[#FCF9F4] border-t border-[#22323A]/[0.06]"
    >
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-serif text-[24px] sm:text-[30px] lg:text-[38px] text-[#2D2926] mb-3 tracking-tight animate-on-scroll opacity-0 translate-y-4 transition-all duration-700">
            Choose the way you want to give it.
          </h2>
          <p className="text-center text-[12px] sm:text-[13px] uppercase tracking-[0.15em] font-semibold text-[#2D2926]/60 mb-8 sm:mb-10">
            Founding release — a small first run, made to be treasured.
          </p>
        </div>

          {/* Outside max-w-7xl so row can be 1400px and containerW reaches ~460 (log showed 341) */}
          <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 lg:gap-10">
                {[1, 2, 3].map((idx) => (
                  <div key={idx} className="text-center px-4">
                    <div className="relative mx-auto w-full max-w-[460px] sm:max-w-[500px] lg:max-w-[560px] aspect-[3/2] mb-6 bg-[#2D2926]/5 animate-pulse rounded-lg" />
                  </div>
                ))}
              </div>
            ) : items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 lg:gap-10">
                {items.map((i, idx) => (
                  <button
                    type="button"
                    key={i.product.id}
                    onClick={() =>
                      setSelectedProduct({
                        product: i.product,
                        subtitle: i.subtitle,
                        img: i.img,
                        imageAlt: i.imageAlt,
                        displayTitle: i.displayTitle,
                        isFirstImage: idx === 0,
                      })
                    }
                    className={`text-center group transition-all duration-700 cursor-pointer w-full border-0 bg-transparent p-0 px-4 ${
                      productsRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}
                    style={{ transitionDelay: productsRevealed ? `${idx * 80}ms` : undefined }}
                  >
                    <p className="text-[11px] sm:text-[12px] lg:text-[13px] uppercase tracking-[0.2em] text-[#2D2926]/50 font-medium mb-4">
                      {i.tierLabel}
                    </p>
                    <div
                      className={productImageFrameClass}
                      style={{ backgroundColor: PRODUCT_IMAGE_BG }}
                    >
                      {i.bestValue && (
                        <span className="absolute top-2 right-2 z-10 rounded-full bg-[#2D2926] px-3 py-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.15em] text-white shadow-sm">
                          Best Value
                        </span>
                      )}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={i.img}
                        alt={i.imageAlt || i.displayTitle}
                        className={productImageClass}
                        loading={idx < 3 ? 'eager' : 'lazy'}
                      />
                    </div>
                    <h4 className="font-serif text-[18px] sm:text-[20px] lg:text-[22px] text-[#2D2926] font-medium leading-tight">
                      {i.displayTitle}
                    </h4>
                    <p className="mt-2 text-[14px] sm:text-[15px] lg:text-[16px] text-[#2D2926]/60 leading-relaxed max-w-[220px] mx-auto whitespace-nowrap">
                      {i.subtitle}
                    </p>
                    <ProductPrice price={i.price} currencyCode={i.currencyCode} />
                  </button>
                ))}
              </div>
            ) : null}

            {/* CTA */}
            <div className="pt-8 sm:pt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setShowCreateMomentModal(true)}
                className="inline-flex items-center justify-center rounded-sm bg-[#2D2926] px-8 sm:px-10 py-3 min-h-[44px] text-[9px] sm:text-[10px] font-semibold tracking-[0.2em] uppercase text-white hover:bg-black transition-colors"
              >
                Choose Your Card
              </button>
            </div>
          </div>
      </div>

      {showCreateMomentModal && (
        <CreateMomentModal
          items={items}
          loading={loading}
          onSelectProduct={(item, index) => {
            setSelectedProduct({ product: item.product, subtitle: item.subtitle, img: item.img, imageAlt: item.imageAlt, displayTitle: item.displayTitle, isFirstImage: index === 0 });
            setShowCreateMomentModal(false);
          }}
          onClose={() => setShowCreateMomentModal(false)}
        />
      )}

      {selectedProduct && (
        <ProductModal
          selected={selectedProduct}
          storeDomain={storeDomain}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}

type CreateMomentItem = {
  product: Product;
  title: string;
  displayTitle: string;
  tierLabel: string;
  subtitle: string;
  bestValue?: boolean;
  img: string;
  imageAlt: string;
  price?: string | null;
  currencyCode?: string | null;
};

function CreateMomentModal({
  items,
  loading,
  onSelectProduct,
  onClose,
}: {
  items: CreateMomentItem[];
  loading: boolean;
  onSelectProduct: (item: CreateMomentItem, index: number) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" onClick={onClose} role="dialog" aria-modal="true">
      <div className="bg-[#FDF9F5] rounded-2xl shadow-2xl max-w-[1600px] w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-[22px] sm:text-[28px] text-[#2D2926]">Create Your Moment</h2>
            <button type="button" onClick={onClose} className="text-[#2D2926]/60 hover:text-[#2D2926] p-1 rounded-full transition-colors" aria-label="Close">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 lg:gap-10">
              {[1, 2, 3].map((idx) => (
                <div key={idx} className="text-center px-4">
                  <div className="relative mx-auto w-full max-w-[460px] sm:max-w-[500px] lg:max-w-[560px] aspect-[3/2] mb-6 bg-[#2D2926]/5 animate-pulse rounded-lg" />
                </div>
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 lg:gap-10">
              {items.map((i, idx) => (
                <button
                  type="button"
                  key={i.product.id}
                  onClick={() => onSelectProduct(i, idx)}
                  className="text-center group transition-all duration-700 cursor-pointer w-full border-0 bg-transparent p-0 px-4 opacity-100"
                >
                  <p className="text-[11px] sm:text-[12px] lg:text-[13px] uppercase tracking-[0.2em] text-[#2D2926]/50 font-medium mb-4">{i.tierLabel}</p>
                  <div
                    className={productImageFrameClass}
                    style={{ backgroundColor: PRODUCT_IMAGE_BG }}
                  >
                    {i.bestValue && (
                      <span className="absolute top-2 right-2 z-10 rounded-full bg-[#2D2926] px-3 py-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.15em] text-white shadow-sm">
                        Best Value
                      </span>
                    )}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={i.img}
                      alt={i.imageAlt || i.displayTitle}
                      className={productImageClass}
                      loading="eager"
                    />
                  </div>
                  <h4 className="font-serif text-[18px] sm:text-[20px] lg:text-[22px] text-[#2D2926] font-medium leading-tight">{i.displayTitle}</h4>
                  <p className="mt-2 text-[14px] sm:text-[15px] lg:text-[16px] text-[#2D2926]/60 leading-relaxed max-w-[220px] mx-auto whitespace-nowrap">{i.subtitle}</p>
                  <ProductPrice price={i.price} currencyCode={i.currencyCode} />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ProductModal({
  selected,
  storeDomain,
  onClose,
}: {
  selected: { product: Product; subtitle: string; img: string; imageAlt: string; displayTitle: string; isFirstImage?: boolean };
  storeDomain: string;
  onClose: () => void;
}) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [deliveryType, setDeliveryType] = useState<'physical' | 'digital'>('physical');

  const product = selected.product;

  const getVariantIdForDelivery = () => {
    const variants = product.variants || [];
    if (variants.length === 0) return product.variantId;

    const digitalVariant = variants.find((v) => /digital/i.test(v.title));
    const physicalVariant = variants.find((v) => /physical/i.test(v.title));

    const chosen =
      deliveryType === 'digital'
        ? digitalVariant || physicalVariant || variants[0]
        : physicalVariant || digitalVariant || variants[0];

    return chosen?.id || product.variantId;
  };

  const handleBuyNow = () => {
    const trimmed = email.trim().toLowerCase();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmed) {
      setEmailError('Email is required');
      return;
    }
    if (!emailRe.test(trimmed)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');

    const chosenVariantId = getVariantIdForDelivery();
    if (storeDomain && chosenVariantId) {
      const params = new URLSearchParams();
      params.set('checkout[email]', trimmed);
      params.set(
        'attributes[Delivery preference]',
        deliveryType === 'physical' ? 'Physical card + digital access' : 'Digital card ( Images )'
      );
      const checkoutUrl = `https://${storeDomain}/cart/${chosenVariantId}:1?checkout&${params.toString()}`;
      window.location.href = checkoutUrl;
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          <div className="flex justify-end mb-2">
            <button
              type="button"
              onClick={onClose}
              className="text-[#2D2926]/60 hover:text-[#2D2926] p-1 rounded-full transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div
            className={`${productImageFrameClass} rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)]`}
            style={{ backgroundColor: PRODUCT_IMAGE_BG }}
          >
            <Image
              src={selected.img}
              alt={selected.imageAlt}
              fill
              className="object-contain object-center p-4 sm:p-6"
              sizes="(max-width: 640px) 460px, (max-width: 1024px) 500px, 560px"
            />
          </div>
          <div className="text-center mb-5">
            <h3 className="font-serif text-[22px] sm:text-[26px] text-[#2D2926] mb-1">
              {selected.displayTitle}
            </h3>
            <p className="text-[#2D2926]/60 text-sm">{selected.subtitle}</p>
            <ProductPrice price={product.price} currencyCode={product.currencyCode} />
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium text-[#2D2926] mb-2">How do you want to receive it?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-start gap-2 rounded-xl border border-[#2D2926]/15 px-3 py-3 cursor-pointer hover:border-[#2D2926]/40 transition-colors">
                <input
                  type="radio"
                  name="delivery-type"
                  value="physical"
                  checked={deliveryType === 'physical'}
                  onChange={() => setDeliveryType('physical')}
                  className="mt-1 w-4 h-4 text-[#2D2926] border-[#2D2926]/40 focus:ring-[#2D2926]/40"
                />
                <div>
                  <p className="text-sm font-semibold text-[#2D2926]">Physical card + digital access</p>
                  <p className="text-xs text-[#2D2926]/70">We ship the card and send your private access code by email.</p>
                </div>
              </label>

              <label className="flex items-start gap-2 rounded-xl border border-[#2D2926]/15 px-3 py-3 cursor-pointer hover:border-[#2D2926]/40 transition-colors">
                <input
                  type="radio"
                  name="delivery-type"
                  value="digital"
                  checked={deliveryType === 'digital'}
                  onChange={() => setDeliveryType('digital')}
                  className="mt-1 w-4 h-4 text-[#2D2926] border-[#2D2926]/40 focus:ring-[#2D2926]/40"
                />
                <div>
                  <p className="text-sm font-semibold text-[#2D2926]">Digital card ( Images )</p>
                  <p className="text-xs text-[#2D2926]/70">
                    We email you a digital card image with your private access code and QR code — no physical card is shipped.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <label htmlFor="product-modal-email" className="block text-sm font-medium text-[#2D2926]">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              id="product-modal-email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl bg-white text-[#2D2926] placeholder-[#2D2926]/40 focus:outline-none focus:ring-2 focus:ring-[#2D2926]/20"
            />
            {emailError && <p className="text-red-600 text-xs">{emailError}</p>}
          </div>

          <button
            type="button"
            onClick={handleBuyNow}
            disabled={!storeDomain || !getVariantIdForDelivery()}
            className="w-full py-4 rounded-full bg-[#2D2926] text-white font-semibold text-sm tracking-wide uppercase hover:bg-[#1E1B18] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Buy now
          </button>
          {(!storeDomain || !getVariantIdForDelivery()) && (
            <p className="text-center text-amber-700 text-xs mt-3">
              {!storeDomain ? 'Store not configured. Set Shopify credentials in admin.' : 'Product variant not available for this option.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function EmotionalPositioning() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.animate-on-scroll').forEach((el) => {
              el.classList.add('opacity-100', 'translate-y-0');
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 lg:py-20 xl:py-24 bg-gradient-to-b from-[#F7F1EA] to-[#FDF9F5]">
      <Container>
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="w-full max-w-[500px] lg:max-w-[560px] mx-auto lg:mx-0 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg group">
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src="/Gemini_Generated_Image_sv1zpdsv1zpdsv1z.png"
                  alt="Hand holding card"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />

                <div className="absolute inset-0 p-4 sm:p-6 lg:p-8 flex items-end">
                  <div className="max-w-xs text-[#FDF9F5]">
                    {/* <p className="font-serif text-lg sm:text-xl lg:text-2xl leading-tight animate-slide-up">
                      Unlock a Moment
                      <br />
                      That Lasts Forever
                    </p>
                    <p className="mt-2 text-[8px] sm:text-[9px] lg:text-[10px] leading-relaxed text-[#FDF9F5]/85 animate-slide-up">
                      Hold onto what matters most—private memories saved for years.
                    </p> */}

                    <div className="mt-3 sm:mt-4 lg:mt-5 flex flex-wrap gap-2">
                      <a
                        className="inline-flex items-center justify-center rounded-full bg-[#1E1B18] px-3 py-1.5 text-[8px] sm:text-[9px] lg:text-[10px] font-medium tracking-[0.2em] uppercase text-[#FDF9F5] hover:bg-[#2F2A26] hover:scale-105 transition-all duration-300"
                        href="#shop"
                      >
                        Create Your Moment
                      </a>
                      <a
                        className="inline-flex items-center justify-center rounded-full border border-[#FDF9F5]/35 bg-transparent px-3 py-1.5 text-[8px] sm:text-[9px] lg:text-[10px] font-medium tracking-[0.2em] uppercase text-[#FDF9F5] hover:bg-white/10 hover:scale-105 transition-all duration-300"
                        href="/unlock"
                      >
                        How It Works
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center lg:text-left max-w-xl lg:pl-8 xl:pl-10 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <h2 className="font-serif text-[28px] sm:text-[34px] lg:text-[40px] xl:text-[44px] leading-[1.2] text-[#2D2926]">
              Not just a gift. A moment.
            </h2>
            <p className="mt-4 text-[11px] sm:text-[12px] lg:text-[13px] leading-relaxed text-[#2D2926]/60">
              Unikmo turns memories into something you can hold. A small card unlocks a personal video, voice message, or photo — saved for years to come.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

function HowItWorks({ onLearnMoreClick }: { onLearnMoreClick?: () => void }) {
  const sectionRef = useRef(null);

  return (
    <section ref={sectionRef} id="how-it-works" className="py-12 sm:py-14 lg:py-16 xl:py-20 bg-[#FEF9F5]">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-[22px] sm:text-[26px] text-[#2D2926] text-center mb-8 sm:mb-10">
            How It Works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-10 sm:mb-12">
            {HOW_IT_WORKS_GRID.map((step, idx) => (
              <div key={idx} className="flex gap-3 sm:gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#2D2926] text-white text-sm font-semibold flex items-center justify-center">
                  {step.num}
                </span>
                <div className="min-w-0">
                  {step.title ? <h3 className="font-semibold text-[#2D2926] text-[14px] sm:text-[15px] mb-1">{step.title}</h3> : null}
                  <p className="text-[13px] sm:text-[14px] text-[#2D2926]/90 leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 sm:pt-8">
            <h3 className="font-semibold text-[#2D2926] text-[15px] sm:text-[16px] mb-1">Options</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-4">
              {DELIVERY_OPTIONS.map((opt) => (
                <div key={opt.id}>
                  <span className="font-semibold text-[#2D2926] text-[14px] sm:text-[15px] block">{opt.label}</span>
                  <span className="text-[13px] sm:text-[14px] text-[#2D2926]/80">{opt.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks2() {
  const steps = [
    { n: '1', title: 'Create', body: 'Record or upload your video, voice note, photo or message.' },
    { n: '2', title: 'We make it', body: 'Your memory is connected to a beautifully made UNIKMO card.' },
    { n: '3', title: 'They unlock it', body: 'They scan the QR code, enter the private code, and revisit it whenever it matters.' },
  ];

  return (
    <section id="how-it-works" className="bg-[#FCF9F4] py-10 sm:py-12 lg:py-14 border-t border-[#22323A]/[0.06]">
      <div className="mx-auto w-full max-w-[1260px] px-5 sm:px-8">
        <div className="flex items-center gap-4">
          <span className="h-px flex-1 bg-[#B38846]/25" />
          <h2 className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B38846]">How it works</h2>
          <span className="h-px flex-1 bg-[#B38846]/25" />
        </div>

        <ol className="mt-8 grid grid-cols-1 md:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.n}
              className={`flex items-start gap-4 px-1 py-5 md:px-8 ${index > 0 ? 'border-t md:border-t-0 md:border-l border-[#22323A]/[0.08]' : ''}`}
            >
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#B38846]/35 text-[15px] text-[#B38846]">
                {step.n}
              </span>
              <div>
                <h3 className="font-serif text-[22px] text-[#22323A]">{step.title}</h3>
                <p className="mt-1.5 text-[13px] sm:text-[14px] leading-relaxed text-[#22323A]/60 font-light">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
function ProductExperience() {
  return (
    <section id="about" className="bg-[#FCF9F4] py-14 sm:py-20 lg:py-24 border-t border-[#22323A]/[0.06]">
      <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[0.72fr_1.28fr] gap-10 lg:gap-14 items-center">
          <div>
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.26em] text-[#B38846]">
              One card. Two sides. One private memory.
            </p>
            <h2 className="mt-4 font-serif text-[38px] sm:text-[48px] lg:text-[56px] leading-[1.02] text-[#22323A]">
              More than a card.
              <br />
              A moment they can keep.
            </h2>
            <p className="mt-6 max-w-[470px] text-[15px] sm:text-[16px] leading-relaxed text-[#22323A]/70 font-light">
              The front is the keepsake. The back carries the QR code and private access code that unlock the memory you created.
            </p>

            <div className="mt-7 space-y-3 text-[13px] text-[#22323A]/65">
              <p><span className="font-medium text-[#22323A]">Front:</span> the physical UNIKMO design they keep.</p>
              <p><span className="font-medium text-[#22323A]">Back:</span> QR code plus private access code.</p>
              <p><span className="font-medium text-[#22323A]">Unlock:</span> scan, enter the code, open the private memory.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <figure>
              <div className="relative aspect-[1.48/1] rounded-[18px] border border-[#22323A]/[0.08] bg-[#F1E8DD] shadow-[0_18px_45px_rgba(44,48,49,0.08)] overflow-hidden">
                <Image
                  src="/card-front.png"
                  alt="Front of the physical UNIKMO card, featuring the gold key design"
                  fill
                  sizes="(min-width: 1024px) 32vw, 90vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-4 text-center">
                <span className="block font-serif text-[20px] text-[#22323A]">Front</span>
                <span className="mt-1 block text-[10px] uppercase tracking-[0.18em] text-[#22323A]/50">The keepsake</span>
              </figcaption>
            </figure>

            <figure>
              <div className="relative aspect-[1.48/1] rounded-[18px] border border-[#22323A]/[0.08] bg-[#F7F0E8] shadow-[0_18px_45px_rgba(44,48,49,0.08)] overflow-hidden">
                <Image
                  src="/card-back.png"
                  alt="Back of the physical UNIKMO card, showing the QR code and private access code"
                  fill
                  sizes="(min-width: 1024px) 32vw, 90vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-4 text-center">
                <span className="block font-serif text-[20px] text-[#22323A]">Back</span>
                <span className="mt-1 block text-[10px] uppercase tracking-[0.18em] text-[#22323A]/50">QR + private access code</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
function StoryInEveryKey() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.animate-on-scroll').forEach((el) => {
              el.classList.add('opacity-100', 'translate-y-0');
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const products = [
    {
      label: 'The',
      name: 'Spark',
      desc: '1 Card',
      sub: 'A small moment',
    },
    {
      label: 'The',
      name: 'Journey',
      desc: '4 cards',
      sub: 'A collection of memories',
    },
    {
      label: 'The',
      name: 'History',
      desc: '7 cards',
      sub: 'A story told over time',
    },
  ];

  const trustItems = [
    { label: 'No app required', icon: <IconSpark /> },
    { label: 'No login', icon: <IconLock /> },
    { label: 'Private & secure', icon: <IconShield /> },
    { label: 'One card – one private memory', icon: <IconCode /> },
    { label: 'A tree planted', icon: <IconLeaf /> },
  ];

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-16 sm:py-20 lg:py-24 xl:py-32 bg-[#FDF9F5]">
      <div className="absolute inset-0 z-0">
        <Image src="/backgrounds.png" alt="" fill className="object-cover opacity-40" sizes="100vw" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-14 lg:mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000">
          <h2 className="font-serif text-[26px] sm:text-[32px] lg:text-[38px] xl:text-[42px] text-[#2D2926] tracking-tight">
            A Story in every card
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 xl:gap-8 mb-16 sm:mb-20">
          {products.map((p, index) => (
            <div
              key={p.name}
              className="rounded-xl sm:rounded-2xl bg-white/40 backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 text-center shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-white/60 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 group hover:bg-white/80 hover:shadow-xl"
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <p className="text-[10px] sm:text-[11px] lg:text-[12px] uppercase tracking-[0.2em] text-[#000]/40 font-medium mb-1">{p.label}</p>
              <p className="font-serif text-[22px] sm:text-[26px] lg:text-[28px] xl:text-[32px] text-[#000] leading-none mb-2">{p.name}</p>
              <p className="text-[11px] sm:text-[12px] lg:text-[13px] text-[#2D2926]/50 mb-4 sm:mb-5 lg:mb-6">{p.desc}</p>
              
              
              <p className="text-[12px] sm:text-[13px] lg:text-[14px] text-[#2D2926]/60 font-light mb-6 sm:mb-7 lg:mb-8 italic">{p.sub}</p>
              
              <button className="text-[10px] sm:text-[11px] lg:text-[12px] uppercase tracking-[0.2em] text-[#2D2926]/40 group-hover:text-[#2D2926] transition-all duration-300 flex items-center justify-center gap-2 mx-auto">
                Discover <span className="text-[12px] sm:text-[13px] lg:text-[14px]">→</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  {
    quote:
      'I gave it to my partner for her birthday. She cried within seconds. It felt deeply personal — not just another gift.',
    name: 'Matt L., London',
    imageSrc: '/testimonials/customer-london.jpg',
    imageAlt: 'Matt, customer in London, smiling with his phone',
  },
  {
    quote:
      "Such a simple idea, but incredibly powerful. The moment we unlocked the message together, it became something we'll remember forever.",
    name: 'Sophie M., New York',
    imageSrc: '/testimonials/customer-newyork.jpg',
    imageAlt: 'Sophie, customer in New York',
  },
];

function SocialProof() {
  return (
    <section id="stories" className="bg-[#FCF9F4] py-14 sm:py-20 lg:py-24 border-t border-[#22323A]/[0.06]">
      <div className="mx-auto w-full max-w-[1120px] px-5 sm:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-[10px] uppercase tracking-[0.26em] text-[#B38846] font-semibold">Their words</p>
          <h2 className="mt-3 font-serif text-[30px] sm:text-[38px] text-[#22323A]">
            The moment they open it is the gift.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-7">
          {TESTIMONIALS.map((testimonial) => (
            <article
              key={testimonial.name}
              className="rounded-[20px] border border-[#22323A]/[0.08] bg-[#F7F0E9] p-7 sm:p-9"
            >
              <div className="font-serif text-[48px] leading-none text-[#B38846]/55">“</div>
              <blockquote className="mt-1 font-serif text-[22px] sm:text-[25px] leading-[1.35] text-[#22323A]">
                {testimonial.quote}
              </blockquote>

              <div className="mt-7 flex items-center gap-3">
                <div className="relative h-11 w-11 overflow-hidden rounded-full">
                  <Image
                    src={testimonial.imageSrc}
                    alt={testimonial.imageAlt}
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                </div>
                <p className="text-[12px] text-[#22323A]/55">{testimonial.name}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
function QuestionsSection({ onContactClick }: { onContactClick: () => void }) {
  const faqs = [
    'How does UNIKMO work?',
    'Is it really private?',
    'Does the recipient need an app?',
    'How long will my moment last?',
  ];

  return (
    <section className="bg-[#FCF9F4] py-12 sm:py-16 border-t border-[#22323A]/[0.06]">
      <div className="mx-auto w-full max-w-[1260px] px-5 sm:px-8">
        <div className="flex items-center gap-4">
          <span className="h-px flex-1 bg-[#B38846]/25" />
          <h2 className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-[#B38846]">
            Questions? We’ve got answers.
          </h2>
          <span className="h-px flex-1 bg-[#B38846]/25" />
        </div>

        <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {faqs.map((faq) => (
            <a
              key={faq}
              href="/faq"
              className="flex min-h-[52px] items-center justify-between rounded-lg border border-[#22323A]/[0.09] bg-white/60 px-4 text-[12px] text-[#22323A]/75 hover:border-[#B38846]/45 hover:text-[#22323A] transition-colors"
            >
              {faq}
              <span className="ml-3 text-[#B38846]">⌄</span>
            </a>
          ))}
        </div>

        <div className="mt-7 text-center">
          <button type="button" onClick={onContactClick} className="text-[12px] text-[#22323A]/55 underline underline-offset-4 hover:text-[#B38846]">
            Still have a question? Contact UNIKMO.
          </button>
        </div>
      </div>
    </section>
  );
}
function FinalCta({ onCreateMomentClick }: { onCreateMomentClick: () => void }) {
  return (
    <section className="bg-[#FCF9F4] px-5 sm:px-8 pb-14 sm:pb-20">
      <div className="mx-auto grid w-full max-w-[1260px] grid-cols-1 md:grid-cols-[0.9fr_1.1fr] overflow-hidden rounded-[22px] border border-[#22323A]/[0.07] bg-[#EFE6DC]">
        <div className="relative min-h-[230px] md:min-h-[330px]">
          <Image
            src="/card-front.png"
            alt="UNIKMO card presented as a meaningful gift"
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center px-7 py-10 sm:px-10 lg:px-14">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#B38846]">You already know who it’s for.</p>
          <h2 className="mt-4 font-serif text-[36px] sm:text-[44px] lg:text-[52px] leading-[1.03] text-[#22323A]">
            Create a moment they’ll treasure — and revisit.
          </h2>
          <button
            type="button"
            onClick={onCreateMomentClick}
            className="mt-7 inline-flex min-h-[48px] w-fit items-center justify-center rounded-lg bg-[#B38846] px-7 text-[12px] font-medium text-white hover:bg-[#9F783D] transition-colors"
          >
            Create Your Moment <span className="ml-2">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
const UPLOAD_URL = 'https://unikmo.com/upload';
const UNLOCK_URL = 'https://unikmo.com/unlock';
const UNLOCK_LINK_CLASS = 'font-semibold text-[#2D2926] no-underline hover:text-[#1E1B18] hover:bg-[#2D2926]/8 focus:outline-none focus:ring-2 focus:ring-[#2D2926]/40 focus:ring-offset-1 rounded px-1 -mx-0.5 transition-colors';

const HOW_IT_WORKS_GRID = [
  { num: 1, title: 'Choose your card', body: 'Select a Single Memory Card, 4-Card Set, or 7-Card Collection. Each card connects to one private memory.' },
  { num: 2, title: 'Receive your private code', body: 'After purchase, the private access code is sent to you by email. UNIKMO does not send it to the recipient.' },
  {
    num: 3,
    title: 'Upload your Moment',
    body: (
      <>
        Go to{' '}
        <a href={UPLOAD_URL} target="_blank" rel="noopener noreferrer" className={UNLOCK_LINK_CLASS}>
          www.unikmo.com/upload
        </a>{' '}
        and add your video, photo, voice note, or message.
      </>
    ),
  },
  { num: 4, title: 'Give the Card', body: 'Send the digital card, give the physical card, or choose split delivery.' },
  {
    num: 5,
    title: 'They unlock it',
    body: (
      <>
        The recipient goes to{' '}
        <a href={UNLOCK_URL} target="_blank" rel="noopener noreferrer" className={UNLOCK_LINK_CLASS}>
          www.unikmo.com/unlock
        </a>
        , enters the private access code, and opens the memory.
      </>
    ),
  },
];

const DELIVERY_OPTIONS = [
  { id: 'physical-digital', label: 'Physical + Digital', desc: 'You receive the physical card and its private access code by email.' },
  { id: 'digital-only', label: 'Digital Only', desc: 'You receive the digital card and private access code by email.' },
  { id: 'split', label: 'Split Delivery', desc: 'We send the physical card to the recipient. You receive the private access code by email.' },
];

function HowItWorksModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="how-it-works-title">
      <div
        className="bg-[#EFE8E5] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8 lg:p-10">
          <div className="flex justify-end -mt-1 mb-1">
            <button type="button" onClick={onClose} className="text-[#2D2926]/60 hover:text-[#2D2926] p-1 rounded-full transition-colors" aria-label="Close">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <h2 id="how-it-works-title" className="font-serif text-[22px] sm:text-[26px] text-[#2D2926] text-center mb-4 sm:mb-5">
            How It Works
          </h2>

          <p className="text-center text-[14px] sm:text-[15px] lg:text-[16px] text-red-600 font-medium leading-relaxed mb-8 sm:mb-10 max-w-2xl mx-auto">
            Choose a card, add your private memory, and give someone a keepsake they can scan and revisit.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-10 sm:mb-12">
            {HOW_IT_WORKS_GRID.map((step, idx) => (
              <div key={idx} className="flex gap-3 sm:gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#2D2926] text-white text-sm font-semibold flex items-center justify-center">
                  {step.num}
                </span>
                <div className="min-w-0">
                  {step.title && <h3 className="font-semibold text-[#2D2926] text-[14px] sm:text-[15px] mb-1">{step.title}</h3>}
                  {step.body && <p className="text-[13px] sm:text-[14px] text-[#2D2926]/90 leading-relaxed">{step.body}</p>}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 sm:pt-8 border-t border-[#2D2926]/10">
            <h3 className="font-semibold text-[#2D2926] text-[15px] sm:text-[16px] mb-1">Options</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-4">
              {DELIVERY_OPTIONS.map((opt) => (
                <div key={opt.id}>
                  <span className="font-semibold text-[#2D2926] text-[14px] sm:text-[15px] block">{opt.label}</span>
                  <span className="text-[13px] sm:text-[14px] text-[#2D2926]/80">{opt.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), message: message.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        setStatus('error');
        return;
      }
      setStatus('success');
      setEmail('');
      setMessage('');
    } catch {
      setError('Failed to send');
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="bg-[#FDF9F5] rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif text-[20px] sm:text-[24px] text-[#2D2926]">Contact</h3>
            <button type="button" onClick={onClose} className="text-[#2D2926]/60 hover:text-[#2D2926] p-1 rounded-full transition-colors" aria-label="Close">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {status === 'success' ? (
            <p className="text-[#2D2926]/80">Thank you. We&apos;ll get back to you soon.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-[#2D2926] mb-1">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white text-[#2D2926] placeholder-[#2D2926]/40 focus:outline-none focus:ring-2 focus:ring-[#2D2926]/20"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-[#2D2926] mb-1">Message</label>
                <textarea
                  id="contact-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your query or message..."
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white text-[#2D2926] placeholder-[#2D2926]/40 focus:outline-none focus:ring-2 focus:ring-[#2D2926]/20 resize-none"
                />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="flex-1 py-3 rounded-full bg-[#2D2926] text-white text-sm font-medium uppercase tracking-wide hover:bg-[#1a1816] transition-colors disabled:opacity-50"
                >
                  {status === 'sending' ? 'Sending...' : 'Send'}
                </button>
                <button type="button" onClick={onClose} className="px-6 py-3 rounded-full text-[#2D2926] text-sm font-medium hover:bg-[#2D2926]/5 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function SiteFooter({
  onContactClick,
  onPrivacyClick,
  onTermsClick,
  onImprintClick,
}: {
  onContactClick: () => void;
  onPrivacyClick: () => void;
  onTermsClick: () => void;
  onImprintClick: () => void;
}) {
  const footerSignals = [
    { label: 'Made for someone', icon: <IconHeart /> },
    { label: 'Private by default', icon: <IconLock /> },
    { label: 'QR + private code', icon: <IconCode /> },
    { label: 'No app required', icon: <IconSpark /> },
  ];

  return (
    <footer className="bg-[#FDF9F5] border-t border-[#22323A]/[0.07]">
      <div className="border-b border-[#22323A]/[0.07] bg-[#F7F0E9]">
        <div className="mx-auto grid max-w-[1050px] grid-cols-2 md:grid-cols-4 px-5 sm:px-8">
          {footerSignals.map((item, index) => (
            <div
              key={item.label}
              className={`flex flex-col items-center justify-center gap-2 py-7 text-center ${
                index % 2 !== 0 ? 'border-l border-[#22323A]/[0.07]' : ''
              } ${index > 1 ? 'border-t md:border-t-0' : ''} ${
                index > 0 ? 'md:border-l md:border-[#22323A]/[0.07]' : ''
              }`}
            >
              <div className="text-[#B38846]">{item.icon}</div>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-[#22323A]/60">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7 sm:py-9 lg:py-11">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 text-[10px] sm:text-[11px] tracking-widest uppercase text-[#2D2926]/50">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-3 sm:gap-x-4 gap-y-2">
            <span className="font-semibold text-[#2D2926]/80">UNIKMO © {new Date().getFullYear()}</span>
            <span className="hidden sm:inline-block text-[#2D2926]/20">|</span>
            <span>A card that unlocks a private memory.</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-5">
            <a
              href="https://www.instagram.com/myunikmo"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#2D2926] transition-colors py-3 -my-3 min-h-[44px] flex items-center"
            >
              Instagram
            </a>
            <a
              href="https://www.tiktok.com/@myunikmo"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#2D2926] transition-colors py-3 -my-3 min-h-[44px] flex items-center"
            >
              TikTok
            </a>
          </div>
        </div>

        <div className="mt-5 sm:mt-7 flex flex-wrap justify-center gap-x-4 sm:gap-x-6 gap-y-1 text-[8px] sm:text-[9px] lg:text-[10px] tracking-[0.2em] uppercase text-[#2D2926]/55">
          <a href="/faq" className="hover:text-[#2D2926] transition-colors py-3 min-h-[44px] flex items-center">FAQ</a>
          <button type="button" onClick={onContactClick} className="hover:text-[#2D2926] transition-colors py-3 min-h-[44px] flex items-center">Contact</button>
          <button type="button" onClick={onPrivacyClick} className="hover:text-[#2D2926] transition-colors py-3 min-h-[44px] flex items-center">Privacy</button>
          <button type="button" onClick={onTermsClick} className="hover:text-[#2D2926] transition-colors py-3 min-h-[44px] flex items-center">Terms</button>
          <button type="button" onClick={onImprintClick} className="hover:text-[#2D2926] transition-colors py-3 min-h-[44px] flex items-center">Imprint</button>
        </div>
      </div>
    </footer>
  );
}
function ImprintModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="bg-[#FDF9F5] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#E3DAD0]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif text-[20px] sm:text-[26px] text-[#2D2926]">Imprint</h3>
            <button type="button" onClick={onClose} className="text-[#2D2926]/60 hover:text-[#2D2926] p-1 rounded-full transition-colors" aria-label="Close">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4 text-[#2D2926]/90 text-[14px] sm:text-[15px] leading-relaxed">
            <h4 className="font-semibold text-[#2D2926]">Operator Information</h4>
            <p><span className="font-medium text-[#2D2926]">Company Name:</span> PlanetHike OÜ</p>
            <p><span className="font-medium text-[#2D2926]">Product:</span> unikmo</p>
            <p><span className="font-medium text-[#2D2926]">Registered Office Address:</span> Järvevana tee 9, Tallinn, 11314, Estonia</p>
            <p><span className="font-medium text-[#2D2926]">Registration Number:</span> 80656111</p>
            <p><span className="font-medium text-[#2D2926]">Legal Representative / Founder:</span> Tichi Mbanwie</p>
            <p>
              <span className="font-medium text-[#2D2926]">Email:</span>{' '}
              <a href="mailto:hello@planethike.org" className="underline hover:text-[#2D2926]">hello@planethike.org</a>
            </p>
            <p>
              <span className="font-medium text-[#2D2926]">Phone:</span>{' '}
              <a href="tel:+491634668380" className="underline hover:text-[#2D2926]">+49 (0)1634668380</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrivacyModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="bg-[#FDF9F5] rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#E3DAD0]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif text-[20px] sm:text-[26px] text-[#2D2926]">Privacy Policy</h3>
            <button type="button" onClick={onClose} className="text-[#2D2926]/60 hover:text-[#2D2926] p-1 rounded-full transition-colors" aria-label="Close">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-5 text-[#2D2926]/90 text-[14px] sm:text-[15px] leading-relaxed">
            <section>
              <h4 className="font-semibold text-[#2D2926] mb-2">1. Data We Collect</h4>
              <p>We collect only what is necessary:</p>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li>Email (for purchase and delivery).</li>
                <li>Order data.</li>
                <li>Uploaded content (Moment media).</li>
              </ul>
              <p className="mt-2">No accounts and no tracking profiles.</p>
            </section>

            <section>
              <h4 className="font-semibold text-[#2D2926] mb-2">2. How Data Is Used</h4>
              <p>We use data to:</p>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li>Deliver private access codes.</li>
                <li>Store Moments.</li>
                <li>Provide support.</li>
              </ul>
              <p className="mt-2">We do not sell personal data.</p>
            </section>

            <section>
              <h4 className="font-semibold text-[#2D2926] mb-2">3. Content Privacy</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Moments are private by default.</li>
                <li>Access requires the unique private code.</li>
              </ul>
              <p className="mt-2">We do not view content unless required for support or required by law.</p>
            </section>

            <section>
              <h4 className="font-semibold text-[#2D2926] mb-2">4. Data Storage</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Media is stored via cloud object storage (for example, Amazon S3).</li>
                <li>Data is stored securely (for example, MongoDB).</li>
              </ul>
              <p className="mt-2">We take reasonable security measures, but no system is 100% secure.</p>
            </section>

            <section>
              <h4 className="font-semibold text-[#2D2926] mb-2">5. Data Retention</h4>
              <p>Moments are stored until user deletion (future feature) or service changes.</p>
              <p className="mt-2">We may remove inactive content after extended periods.</p>
            </section>

            <section>
              <h4 className="font-semibold text-[#2D2926] mb-2">6. Third Parties</h4>
              <p>We use Shopify (payments and orders) and cloud providers (media storage).</p>
              <p className="mt-2">These providers process data under their own policies.</p>
            </section>

            <section>
              <h4 className="font-semibold text-[#2D2926] mb-2">7. User Rights (GDPR)</h4>
              <p>Users can request access, correction, and deletion.</p>
              <p className="mt-2">Contact: hello@planethike.org, or use the Contact form on this site.</p>
            </section>

            <section>
              <h4 className="font-semibold text-[#2D2926] mb-2">8. Cookies</h4>
              <p>We use minimal cookies for website functionality and analytics (if enabled).</p>
            </section>

            <section>
              <h4 className="font-semibold text-[#2D2926] mb-2">9. Governing Law & Supervisory Authority</h4>
              <p>
                Unikmo is operated by PlanetHike OÜ, registered in Tallinn, Estonia. This Privacy Policy is governed by Estonian
                law and the EU General Data Protection Regulation (GDPR).
              </p>
              <p className="mt-2">
                If you believe your data protection rights have been violated, you may lodge a complaint with the Estonian Data
                Protection Inspectorate (Andmekaitse Inspektsioon) or the supervisory authority in your own country of residence.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function TermsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="bg-[#FDF9F5] rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#E3DAD0]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif text-[20px] sm:text-[26px] text-[#2D2926]">Terms & Conditions (Unikmo)</h3>
            <button type="button" onClick={onClose} className="text-[#2D2926]/60 hover:text-[#2D2926] p-1 rounded-full transition-colors" aria-label="Close">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-5 text-[#2D2926]/90 text-[14px] sm:text-[15px] leading-relaxed">
            <section>
              <h4 className="font-semibold text-[#2D2926] mb-2">1. Overview</h4>
              <p>
                Unikmo provides a service that enables users to create, store, and share digital Moments (video, audio, images, or text) through unique private access codes.
                By purchasing or using Unikmo, you agree to these Terms.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-[#2D2926] mb-2">2. Product Nature</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Each purchase grants one or more private access codes.</li>
                <li>Each code allows creation of one (1) digital Moment.</li>
                <li>Moments are private and accessible only through the corresponding code.</li>
                <li>No account/login required.</li>
              </ul>
            </section>

            <section>
              <h4 className="font-semibold text-[#2D2926] mb-2">3. User Responsibility (Very Important)</h4>
              <p>The buyer is solely responsible for storing the private access code securely and sharing it with the intended recipient. Unikmo will never send the code to recipients.</p>
              <p className="mt-2">If a code is lost, shared accidentally, or accessed by third parties, Unikmo is not liable.</p>
            </section>

            <section>
              <h4 className="font-semibold text-[#2D2926] mb-2">4. Key Usage Rules</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>One private access code = one Moment.</li>
                <li>Once a Moment is created, it cannot be edited or reassigned.</li>
                <li>Keys may not be resold or redistributed commercially.</li>
              </ul>
            </section>

            <section>
              <h4 className="font-semibold text-[#2D2926] mb-2">5. Content Responsibility</h4>
              <p>Users are fully responsible for all uploaded content. You agree not to upload:</p>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li>Illegal content.</li>
                <li>Copyrighted content you do not own.</li>
                <li>Offensive, abusive, or harmful material.</li>
              </ul>
              <p className="mt-2">Unikmo reserves the right to remove content at any time.</p>
            </section>

            <section>
              <h4 className="font-semibold text-[#2D2926] mb-2">6. Storage & Availability</h4>
              <p>Moments are stored digitally (cloud infrastructure). We aim for long-term storage but do not guarantee permanent availability.</p>
              <p className="mt-2">Unikmo may modify, migrate, or discontinue storage services (with reasonable notice where possible).</p>
            </section>

            <section>
              <h4 className="font-semibold text-[#2D2926] mb-2">7. Limitation of Liability (Critical)</h4>
              <p>Unikmo is not liable for loss of content, unauthorized access, service interruptions, or emotional/indirect damages.</p>
              <p className="mt-2">Maximum liability equals the amount paid by the customer.</p>
            </section>

            <section>
              <h4 className="font-semibold text-[#2D2926] mb-2">8. Delivery</h4>
              <p>Delivery options include Physical + Digital, Digital only, and Split delivery. Shipping times are estimates only.</p>
            </section>

            <section>
              <h4 className="font-semibold text-[#2D2926] mb-2">9. Refunds</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Digital access codes are non-refundable once issued.</li>
                <li>Physical products follow the standard return policy (if unused).</li>
              </ul>
            </section>

            <section>
              <h4 className="font-semibold text-[#2D2926] mb-2">10. Anti-Fraud Policy</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Keys are only sent to buyers.</li>
                <li>We will never ask recipients for payment or personal data.</li>
              </ul>
            </section>

            <section>
              <h4 className="font-semibold text-[#2D2926] mb-2">11. Changes</h4>
              <p>We may update these Terms at any time.</p>
            </section>

            <section>
              <h4 className="font-semibold text-[#2D2926] mb-2">12. Governing Law & Jurisdiction</h4>
              <p>
                These Terms are governed by the laws of Estonia, without regard to conflict-of-law principles. Any dispute
                arising from these Terms or your use of Unikmo is subject to the exclusive jurisdiction of the courts of
                Estonia.
              </p>
              <p className="mt-2">
                If you are a consumer resident in the European Union, this choice of law does not deprive you of the
                protections afforded to you by the mandatory consumer-protection laws of your country of habitual residence.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes pulseSlow {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
  }

  .animate-fade-in-left {
    animation: fadeInLeft 0.8s ease-out forwards;
  }

  .animate-fade-in-right {
    animation: fadeInRight 0.8s ease-out forwards;
  }

  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  .animate-pulse-slow {
    animation: pulseSlow 4s ease-in-out infinite;
  }

  .animate-slide-up {
    animation: slideUp 0.8s ease-out forwards;
  }
`;

function IconKey() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14.5 10.5a4.5 4.5 0 1 0-2.2 3.9L14 16h2l1-1h2v-2h-2l-1-1h-2l-1.2-1.2c.45-.15.87-.37 1.2-.66Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 10.5h.01" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function IconUpload() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3v10" strokeLinecap="round" />
      <path d="M8.5 6.5 12 3l3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 14v4a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-4" strokeLinecap="round" />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 20s-7-4.4-9.2-9A5.4 5.4 0 0 1 12 6.2 5.4 5.4 0 0 1 21.2 11c-2.2 4.6-9.2 9-9.2 9Z" strokeLinejoin="round" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3 20 7v6c0 5-3.4 8.7-8 9-4.6-.3-8-4-8-9V7l8-4Z" strokeLinejoin="round" />
      <path d="M9.5 12.2 11 13.7l3.8-3.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M7.5 11V8.5a4.5 4.5 0 0 1 9 0V11" strokeLinecap="round" />
      <path d="M7 11h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z" strokeLinejoin="round" />
    </svg>
  );
}

function IconCode() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 18 3 12l6-6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m15 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconLeaf() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 4s-8 0-12 4-4 12-4 12s8 0 12-4 4-12 4-12Z" strokeLinejoin="round" />
      <path d="M8 16c4-4 8-6 12-7" strokeLinecap="round" />
    </svg>
  );
}

function IconSpark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2l1.2 5.2L18 9l-4.8 1.8L12 16l-1.2-5.2L6 9l4.8-1.8L12 2Z" strokeLinejoin="round" />
      <path d="M5 14l.6 2.6L8 18l-2.4.4L5 21l-.6-2.6L2 18l2.4-.4L5 14Z" strokeLinejoin="round" opacity="0.75" />
    </svg>
  );
}

function WhyUnikmo() {
  const reasons = [
    ['Created for one person', 'A memory made intentionally for someone you care about.'],
    ['A physical keepsake', 'The card gives a digital memory a place in the real world.'],
    ['Easy to revisit', 'Scan the card and enter the private code whenever the moment matters.'],
    ['Quietly private', 'No public post, recipient account, or advertising.'],
  ];
  return (
    <section className="bg-[#EFE8E5] py-12 sm:py-16 lg:py-20 border-t border-[#2D2926]/[0.07]">
      <Container>
        <div className="max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#2D2926]/50 font-medium">Why UNIKMO</p>
          <h2 className="mt-3 font-serif text-[28px] sm:text-[36px] lg:text-[44px] leading-tight text-[#2D2926]">
            A meaningful message should not disappear in a chat.
          </h2>
          <p className="mt-4 text-[15px] sm:text-[17px] text-[#2D2926]/70 font-light leading-relaxed">
            Everyday messages are made for the moment. UNIKMO gives one special memory an intentional presentation and a physical place to return to.
          </p>
        </div>
        <div className="mt-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {reasons.map(([title, body]) => (
            <div key={title} className="border-t border-[#2D2926]/20 pt-4">
              <h3 className="font-serif text-[18px] text-[#2D2926]">{title}</h3>
              <p className="mt-2 text-[14px] text-[#2D2926]/65 font-light leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function NearAndFarStory() {
  return (
    <section className="bg-[#FDF9F5] py-12 sm:py-16 lg:py-20 border-t border-[#2D2926]/6">
      <Container>
        <div className="rounded-[2rem] bg-[#2D2926] px-6 py-10 sm:px-10 sm:py-12 lg:px-16 lg:py-14 text-[#FDF9F5]">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#FDF9F5]/55 font-medium">Emotional gifting, near or far</p>
          <h2 className="mt-3 max-w-4xl font-serif text-[28px] sm:text-[36px] lg:text-[46px] leading-tight">A meaningful message, made into a gift someone can hold and revisit.</h2>
          <p className="mt-4 max-w-2xl text-[15px] sm:text-[17px] text-[#FDF9F5]/75 font-light leading-relaxed">
            Whether they are across the world or sitting beside you, UNIKMO gives an important feeling a tangible, intentional, and lasting place.
          </p>
          <a href="#shop" className="mt-7 inline-flex rounded-full bg-[#FDF9F5] px-7 py-3.5 text-[12px] font-medium tracking-[0.08em] text-[#2D2926] hover:bg-[#EFE8E5] transition-colors">Create Your Moment</a>
        </div>
      </Container>
    </section>
  );
}
