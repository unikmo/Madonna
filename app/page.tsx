'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { WAITLIST_COPY_DEFAULTS } from '@/lib/waitlist-copy-defaults';
import {
  AnimatedMomentModal,
  type AnimatedMomentModalVariant,
} from '@/components/AnimatedMomentModal';

/** Matches cream in product card photography — avoids white letterboxing around images */
const PRODUCT_IMAGE_BG = '#FAF6F1';
const productImageFrameClass =
  'relative mx-auto w-full max-w-[460px] sm:max-w-[500px] lg:max-w-[560px] aspect-[3/2] mb-6 overflow-hidden';
const productImageClass =
  'absolute inset-0 w-full h-full object-cover object-center drop-shadow-[0_14px_18px_rgba(0,0,0,0.12)] group-hover:scale-105 transition-transform duration-500';

type PublicSiteConfig = {
  sellingEnabled: boolean;
  waitlistHeadline: string;
  waitlistSubline1: string;
  waitlistSubline2: string;
  waitlistSupportingLine: string;
  waitlistEmailPlaceholder: string;
  waitlistNamePlaceholder: string;
  waitlistCtaLabel: string;
};

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
  const [siteConfig, setSiteConfig] = useState<PublicSiteConfig | null>(null);
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

  useEffect(() => {
    fetch('/api/public/site-config')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => (d ? setSiteConfig(d as PublicSiteConfig) : setSiteConfig(null)))
      .catch(() => setSiteConfig(null));
  }, []);

  const waitlistMode = Boolean(siteConfig && siteConfig.sellingEnabled === false);

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
        <WhyUnikmo />
        <DistanceStory />
        <SocialProof />
        <StoryIn
          showCreateMomentModal={showCreateMomentModal}
          setShowCreateMomentModal={setShowCreateMomentModal}
          waitlistMode={waitlistMode}
          siteConfig={siteConfig}
        />
        {/* <EmotionalPositioning /> */}
        {/* <ProductExperience /> */}
        <PreFooterTrustStrip />
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
    <header className="bg-[#FDF9F5]">
      <Container>
        <div className="flex h-14 sm:h-16 items-center justify-between">
          <nav className="flex-1 flex items-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={onHowItWorksClick}
              className="text-[10px] sm:text-xs font-medium text-[#1E1B18]/55 hover:text-[#1E1B18] transition-all duration-300 hover:translate-x-1 inline-block"
            >
              How it Works
            </button>
            <a
              href="#gift-ideas"
              className="text-[10px] sm:text-xs font-medium text-[#1E1B18]/55 hover:text-[#1E1B18] transition-all duration-300 hover:translate-x-1 inline-block"
            >
              Gift Ideas
            </a>
          </nav>

          <a
            className="inline-flex items-center hover:scale-105 transition-transform duration-300"
            href="#top"
          >
            <Image
              src="/unikmo-logo-header.png"
              alt="UNIKMO"
              width={729}
              height={220}
              priority
              className="h-7 sm:h-8 w-auto"
            />
          </a>

          <nav className="flex-1 flex justify-end">
            <a
              href="#shop"
              className="text-[10px] sm:text-xs font-medium text-[#1E1B18]/55 hover:text-[#1E1B18] transition-all duration-300 hover:-translate-x-1"
            >
              Create Your Moment
            </a>
          </nav>
        </div>
      </Container>
    </header>
  );
}

const preFooterTrustItems = [
  { label: 'No app required', detail: 'They open the memory in the browser.', icon: <IconSpark /> },
  { label: 'No login', detail: 'The recipient does not need an account.', icon: <IconLock /> },
  { label: 'Private by default', detail: 'The QR code and private code protect access.', icon: <IconShield /> },
  { label: 'No ads', detail: 'Nothing interrupts their moment.', icon: <IconHeart /> },
];

function Hero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative overflow-hidden opacity-0 translate-y-8 transition-all duration-1000 bg-[#F5EEED]"
    >
      {/* Main hero: image + copy — balanced columns, image fills frame */}
      <div className="relative z-10 w-full pt-8 pb-2 sm:pt-10 sm:pb-4 lg:pt-12 lg:pb-6">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.28fr)_minmax(0,0.72fr)] gap-10 lg:gap-8 xl:gap-12 items-center lg:items-stretch lg:min-h-[min(72vh,600px)]">
            {/* Wider image + bleed left into section padding so the banner uses horizontal space (text on photo stays in frame via object-left) */}
            <div className="flex justify-center lg:justify-start w-full max-lg:max-w-[540px] max-lg:mx-auto lg:max-w-none lg:-ml-8 lg:w-[calc(100%+2rem)]">
              <div className="relative w-full lg:max-w-none lg:h-full lg:min-h-[min(52vh,560px)] aspect-[5/4] sm:aspect-[5/4] lg:aspect-auto rounded-xl overflow-hidden shadow-[0_12px_40px_rgba(45,41,38,0.1)] ring-1 ring-[#2D2926]/5">
                <Image
                  src="/banner/banner.jpeg"
                  alt="A meaningful moment — someone smiling while opening their memory on their phone"
                  fill
                  priority
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover object-[50%_42%]"
                />
              </div>
            </div>

            <div className="flex flex-col justify-center text-center lg:text-left px-1 sm:px-2 lg:px-4 xl:pr-8">
              {/* 1. Headline */}
              <h1 className="font-serif text-[32px] sm:text-[40px] lg:text-[52px] xl:text-[68px] leading-[1.05] text-[#2D2926] font-normal tracking-tight">
                Some moments deserve more than a message.
              </h1>

              {/* 2. Subline */}
              <p className="mt-4 sm:mt-6 lg:mt-8 text-[18px] sm:text-[20px] lg:text-[22px] xl:text-[24px] text-[#2D2926]/88 font-light leading-normal tracking-wide max-w-2xl">
                Create a private video, voice note, photo, or written message and connect it to a beautifully designed UNIKMO card. They scan the QR code, enter the private code, and open a memory they can revisit.
              </p>

              {/* 3. Supporting text */}
              <div className="mt-6 sm:mt-8 lg:mt-10 space-y-3 text-[14px] sm:text-[16px] lg:text-[18px] xl:text-[19px] text-[#2D2926]/85 font-light leading-relaxed tracking-wide">
              </div>

              {/* 4. CTA + 5. subtext */}
              <div className="mt-8 sm:mt-10 lg:mt-12 flex flex-col items-center lg:items-start gap-3">
                <a
                  href="#shop"
                  className="inline-flex items-center justify-center rounded-full bg-[#DDD0C4] hover:bg-[#D3C7BB] active:bg-[#C7BAAC] text-[#2D2926] px-9 py-4 sm:px-11 sm:py-5 text-[13px] sm:text-[14px] font-medium tracking-[0.08em] transition-colors shadow-sm border border-[#2D2926]/10"
                >
                  Create Your Moment
                </a>
                <a href="#how-it-works" className="text-[12px] sm:text-[13px] font-medium text-[#2D2926]/70 underline underline-offset-4 hover:text-[#2D2926]">
                  See How It Works
                </a>
                <p className="text-[11px] sm:text-[12px] text-[#2D2926]/65 font-medium">
                  Private by default. No login required. No ads.
                </p>
                <p className="text-[11px] sm:text-[12px] text-[#2D2926]/50 font-light leading-snug max-w-md">
                  Founding release — 100 cards only.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}

/** Trust bullets — blush band (same as hero / final CTA). Tree lives in <SiteFooter>, not here. */
function PreFooterTrustStrip() {
  return (
    <section
      aria-label="Why Unikmo is simple"
      className="bg-[#F5EEED] pt-8 sm:pt-10 pb-10 sm:pb-12 lg:pb-14 border-0"
    >
      <Container>
        <h2 className="font-serif text-[22px] sm:text-[26px] lg:text-[30px] text-[#2D2926] text-center mb-8 sm:mb-10">
          Private by design.
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 max-w-5xl mx-auto">
          {preFooterTrustItems.map((item) => (
            <div key={item.label} className="flex flex-col items-center text-center">
              <div className="text-[#2D2926]/40 mb-2 sm:mb-3">{item.icon}</div>
              <p className="text-[10px] sm:text-[11px] lg:text-[12px] uppercase tracking-[0.15em] text-[#2D2926]/60 font-medium leading-tight">
                {item.label}
              </p>
              <p className="mt-2 text-[13px] sm:text-[14px] lg:text-[15px] text-[#2D2926]/60 font-light leading-relaxed">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

const whenToGiveOneColumns = [
  ['Long-distance birthdays', 'Anniversaries', 'Wedding mornings', 'Graduations'],
  ['Open-when messages', 'Apologies', 'Family memories', 'Just-because moments'],
] as const;

function WhenToUseUnikmo() {
  return (
    <section
      id="gift-ideas"
      aria-labelledby="when-to-use-unikmo-heading"
      className="bg-[#FDF9F5] py-12 sm:py-16 lg:py-20 border-t border-[#2D2926]/6"
    >
      <Container>
        <h2
          id="when-to-use-unikmo-heading"
          className="font-serif text-[26px] sm:text-[32px] lg:text-[40px] text-[#2D2926] font-normal tracking-tight text-center max-w-3xl mx-auto mb-10 sm:mb-12 lg:mb-14"
        >
          For moments that deserve more than a message.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-20 gap-y-5 sm:gap-y-6 max-w-4xl mx-auto">
          {whenToGiveOneColumns.map((column, columnIdx) => (
            <div key={columnIdx} className="space-y-5 sm:space-y-6">
              {column.map((line, lineIdx) => (
                <div
                  key={line}
                  className={`text-left pb-4 sm:pb-5 border-b border-[#2D2926]/10 ${
                    lineIdx === column.length - 1 ? 'border-b-0 pb-0' : ''
                  }`}
                >
                  <p className="text-[15px] sm:text-[17px] lg:text-[18px] text-[#2D2926]/88 font-light leading-relaxed tracking-wide">
                    {line}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Container>
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
  waitlistMode: boolean;
  siteConfig: PublicSiteConfig | null;
};

function StoryIn({
  showCreateMomentModal,
  setShowCreateMomentModal,
  waitlistMode,
  siteConfig,
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
      className="relative overflow-hidden py-12 sm:py-16 lg:py-20 bg-[#FEF9F5] border-t border-[#2D2926]/6"
    >
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-serif text-[24px] sm:text-[30px] lg:text-[38px] text-[#2D2926] mb-8 sm:mb-10 tracking-tight animate-on-scroll opacity-0 translate-y-4 transition-all duration-700">
            Choose your card.
          </h2>
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
                    {i.price != null && (
                      <p className="mt-2 text-[15px] sm:text-[16px] font-semibold text-[#2D2926]">
                        {(i.currencyCode?.toUpperCase?.() === 'EUR' ? '€' : i.currencyCode?.toUpperCase?.() === 'USD' ? '$' : i.currencyCode ?? '')}{Number(i.price).toFixed(2)}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            ) : null}

            {/* CTA */}
            <div className="pt-8 sm:pt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setShowCreateMomentModal(true)}
                className="inline-flex items-center rounded-sm bg-[#2D2926] px-8 sm:px-10 py-3 text-[9px] sm:text-[10px] font-semibold tracking-[0.2em] uppercase text-white hover:bg-black transition-colors"
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
          waitlistMode={waitlistMode}
          waitlistConfig={siteConfig}
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
                  {i.price != null && (
                    <p className="mt-2 text-[15px] sm:text-[16px] font-semibold text-[#2D2926]">
                      {(i.currencyCode?.toUpperCase?.() === 'EUR' ? '€' : i.currencyCode?.toUpperCase?.() === 'USD' ? '$' : i.currencyCode ?? '')}{Number(i.price).toFixed(2)}
                    </p>
                  )}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function WaitlistModal({
  config,
  onClose,
}: {
  config: PublicSiteConfig;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedName) {
      setError('Please enter your name');
      return;
    }
    if (!trimmedEmail || !emailRe.test(trimmedEmail)) {
      setError('Please enter a valid email');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/public/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedName, email: trimmedEmail }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Something went wrong');
        return;
      }
      setDone(true);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="waitlist-modal-title"
    >
      <div
        className="bg-[#FDF9F5] rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
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

          {done ? (
            <div className="text-center py-6">
              <p className="font-serif text-[22px] text-[#2D2926] mb-3">You&apos;re on the list</p>
              <p className="text-sm text-[#2D2926]/65 mb-6">
                We&apos;ll be in touch when it&apos;s your turn.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-[#2D2926] text-white px-8 py-3 text-xs font-semibold tracking-[0.15em] uppercase"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <h2
                id="waitlist-modal-title"
                className="font-serif text-[22px] sm:text-[26px] text-[#2D2926] text-center leading-snug mb-3"
              >
                {config.waitlistHeadline}
              </h2>
              <p className="text-center text-[15px] sm:text-[16px] text-[#2D2926]/75 leading-relaxed mb-1">
                {config.waitlistSubline1}
              </p>
              <p className="text-center text-[15px] sm:text-[16px] text-[#2D2926]/75 leading-relaxed mb-4">
                {config.waitlistSubline2}
              </p>
              <p className="text-center text-xs sm:text-sm text-[#2D2926]/55 mb-8">
                {config.waitlistSupportingLine}
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="waitlist-name" className="block text-sm font-medium text-[#2D2926] mb-1">
                    Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="waitlist-name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError('');
                    }}
                    placeholder={config.waitlistNamePlaceholder}
                    autoComplete="name"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#2D2926]/15 text-[#2D2926] placeholder-[#2D2926]/40 focus:outline-none focus:ring-2 focus:ring-[#2D2926]/20"
                  />
                </div>
                <div>
                  <label htmlFor="waitlist-email" className="block text-sm font-medium text-[#2D2926] mb-1">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="waitlist-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder={config.waitlistEmailPlaceholder}
                    autoComplete="email"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#2D2926]/15 text-[#2D2926] placeholder-[#2D2926]/40 focus:outline-none focus:ring-2 focus:ring-[#2D2926]/20"
                  />
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-4 rounded-full bg-[#2D2926] text-white font-semibold text-sm tracking-wide uppercase hover:bg-[#1E1B18] transition-colors disabled:opacity-50"
              >
                {submitting ? 'Please wait…' : config.waitlistCtaLabel}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductModal({
  selected,
  storeDomain,
  waitlistMode,
  waitlistConfig,
  onClose,
}: {
  selected: { product: Product; subtitle: string; img: string; imageAlt: string; displayTitle: string; isFirstImage?: boolean };
  storeDomain: string;
  waitlistMode: boolean;
  waitlistConfig: PublicSiteConfig | null;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [deliveryType, setDeliveryType] = useState<'physical' | 'digital'>('physical');
  const [submitting, setSubmitting] = useState(false);
  const [waitlistMomentModal, setWaitlistMomentModal] = useState<{
    open: boolean;
    variant: AnimatedMomentModalVariant;
    title: string;
    message: string;
    emoji: string;
    confirmLabel?: string;
  }>({
    open: false,
    variant: 'celebrate',
    title: '',
    message: '',
    emoji: '',
  });
  const [liveWaitlistCopy, setLiveWaitlistCopy] = useState<PublicSiteConfig | null>(null);

  const wc = {
    ...WAITLIST_COPY_DEFAULTS,
    ...(waitlistConfig
      ? {
          waitlistHeadline: waitlistConfig.waitlistHeadline,
          waitlistSubline1: waitlistConfig.waitlistSubline1,
          waitlistSubline2: waitlistConfig.waitlistSubline2,
          waitlistSupportingLine: waitlistConfig.waitlistSupportingLine,
          waitlistEmailPlaceholder: waitlistConfig.waitlistEmailPlaceholder,
          waitlistNamePlaceholder: waitlistConfig.waitlistNamePlaceholder,
          waitlistCtaLabel: waitlistConfig.waitlistCtaLabel,
        }
      : {}),
    ...(liveWaitlistCopy
      ? {
          waitlistHeadline: liveWaitlistCopy.waitlistHeadline,
          waitlistSubline1: liveWaitlistCopy.waitlistSubline1,
          waitlistSubline2: liveWaitlistCopy.waitlistSubline2,
          waitlistSupportingLine: liveWaitlistCopy.waitlistSupportingLine,
          waitlistEmailPlaceholder: liveWaitlistCopy.waitlistEmailPlaceholder,
          waitlistNamePlaceholder: liveWaitlistCopy.waitlistNamePlaceholder,
          waitlistCtaLabel: liveWaitlistCopy.waitlistCtaLabel,
        }
      : {}),
  };

  useEffect(() => {
    if (!waitlistMode) {
      setLiveWaitlistCopy(null);
      return;
    }
    let cancelled = false;
    fetch('/api/public/site-config')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data && data.sellingEnabled === false) {
          setLiveWaitlistCopy(data as PublicSiteConfig);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [waitlistMode]);

  const product = selected.product;
  const keyCount = product.title.toLowerCase().includes('7') ? 7 : product.title.toLowerCase().includes('4') ? 4 : 1;

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

  const handleBuyNow = async () => {
    const trimmedName = name.trim();
    const trimmed = email.trim().toLowerCase();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (waitlistMode && !trimmedName) {
      setEmailError('Name is required');
      return;
    }
    if (!trimmed) {
      setEmailError('Email is required');
      return;
    }
    if (!emailRe.test(trimmed)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');

    if (waitlistMode) {
      setSubmitting(true);
      try {
        const latestConfigRes = await fetch('/api/public/site-config');
        const latestConfig = latestConfigRes.ok ? await latestConfigRes.json() : null;
        if (!latestConfig || latestConfig.sellingEnabled !== false) {
          setEmailError('Selling has been re-enabled. Please continue with checkout.');
          setSubmitting(false);
          return;
        }

        const res = await fetch('/api/public/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: trimmedName,
            email: trimmed,
            deliveryType,
            productId: product.id,
            productTitle: selected.displayTitle,
            quantity: keyCount,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setEmailError(typeof data.error === 'string' ? data.error : 'Failed to save your request');
          return;
        }
        setWaitlistMomentModal({
          open: true,
          variant: 'celebrate',
          title: "You're on the list",
          message:
            data.emailSent === true
              ? 'Your spot is saved. Check your inbox for a confirmation email.'
              : 'Your spot is saved. We could not send the confirmation email this time — you are still on the list.',
          emoji: '✨',
          confirmLabel: 'Okay',
        });
      } catch {
        setEmailError('Network error. Please try again.');
      } finally {
        setSubmitting(false);
      }
      return;
    }

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
    <>
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
          {waitlistMode && (
            <div className="mb-6 rounded-2xl bg-[#F7F1EA] border border-[#2D2926]/10 px-4 py-5 sm:px-6 sm:py-6 text-center">
              <h2 className="font-serif text-[20px] sm:text-[24px] text-[#2D2926] leading-snug mb-3">
                {wc.waitlistHeadline}
              </h2>
              <p className="text-[15px] sm:text-[16px] text-[#2D2926]/80 leading-relaxed mb-1">
                {wc.waitlistSubline1}
              </p>
              <p className="text-[15px] sm:text-[16px] text-[#2D2926]/80 leading-relaxed mb-3">
                {wc.waitlistSubline2}
              </p>
              <p className="text-xs sm:text-sm text-[#2D2926]/60 leading-relaxed">{wc.waitlistSupportingLine}</p>
            </div>
          )}

          <div
            className={`${productImageFrameClass} rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)]`}
            style={{ backgroundColor: PRODUCT_IMAGE_BG }}
          >
            <Image
              src={selected.img}
              alt={selected.imageAlt}
              fill
              className="object-cover object-center"
              sizes="(max-width: 640px) 460px, (max-width: 1024px) 500px, 560px"
            />
          </div>
          {waitlistMode ? (
            <div className="mb-5 text-center">
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#2D2926]/45 font-medium mb-1">
                Your selection
              </p>
              <h3 className="font-serif text-[20px] sm:text-[22px] text-[#2D2926]">{selected.displayTitle}</h3>
              <p className="text-[#2D2926]/55 text-sm mt-1">{selected.subtitle}</p>
            </div>
          ) : (
            <>
              <h3 className="font-serif text-[22px] sm:text-[26px] text-[#2D2926] text-center mb-1">
                {selected.displayTitle}
              </h3>
              <p className="text-[#2D2926]/60 text-sm text-center mb-5">{selected.subtitle}</p>
            </>
          )}

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

          {waitlistMode && (
            <div className="space-y-2 mb-4">
              <label htmlFor="product-modal-name" className="block text-sm font-medium text-[#2D2926]">
                Name <span className="text-red-600">*</span>
              </label>
              <input
                id="product-modal-name"
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setEmailError(''); }}
                placeholder={wc.waitlistNamePlaceholder}
                className="w-full px-4 py-3 rounded-xl bg-white text-[#2D2926] placeholder-[#2D2926]/40 focus:outline-none focus:ring-2 focus:ring-[#2D2926]/20"
              />
            </div>
          )}

          <div className="space-y-2 mb-6">
            <label htmlFor="product-modal-email" className="block text-sm font-medium text-[#2D2926]">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              id="product-modal-email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
              placeholder={wc.waitlistEmailPlaceholder}
              className="w-full px-4 py-3 rounded-xl bg-white text-[#2D2926] placeholder-[#2D2926]/40 focus:outline-none focus:ring-2 focus:ring-[#2D2926]/20"
            />
            {emailError && <p className="text-red-600 text-xs">{emailError}</p>}
          </div>

          <button
            type="button"
            onClick={handleBuyNow}
            disabled={
              submitting ||
              (waitlistMode && waitlistMomentModal.open) ||
              (!waitlistMode && (!storeDomain || !getVariantIdForDelivery()))
            }
            className="w-full py-4 rounded-full bg-[#2D2926] text-white font-semibold text-sm tracking-wide uppercase hover:bg-[#1E1B18] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting
              ? 'Please wait...'
              : waitlistMode
                ? wc.waitlistCtaLabel
                : 'Buy now'}
          </button>
          {!waitlistMode && (!storeDomain || !getVariantIdForDelivery()) && (
            <p className="text-center text-amber-700 text-xs mt-3">
              {!storeDomain ? 'Store not configured. Set Shopify credentials in admin.' : 'Product variant not available for this option.'}
            </p>
          )}
        </div>
      </div>
    </div>
    {waitlistMode && (
      <AnimatedMomentModal
        open={waitlistMomentModal.open}
        onClose={() => {
          setWaitlistMomentModal((m) => ({ ...m, open: false }));
          onClose();
        }}
        variant={waitlistMomentModal.variant}
        title={waitlistMomentModal.title}
        message={waitlistMomentModal.message}
        emoji={waitlistMomentModal.emoji}
        confirmLabel={waitlistMomentModal.confirmLabel}
      />
    )}
    </>
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
    { title: 'Choose your card', body: 'Select the UNIKMO card that fits the person or occasion.' },
    { title: 'Create your memory', body: 'Upload a private video, voice note, photograph, or written message.' },
    { title: 'Give the card', body: 'The physical card becomes a lasting part of the gift.' },
    { title: 'Scan and relive', body: 'They scan the QR code, enter the private code, and open the memory in their browser.' },
  ];
  return (
    <section
      id="how-it-works"
      className="py-12 sm:py-16 lg:py-20 bg-[#FDF9F5] border-t border-[#2D2926]/6"
    >
      <Container>
        <div className="text-center max-w-5xl mx-auto">
          <h2 className="font-serif text-[22px] sm:text-[26px] lg:text-[30px] text-[#2D2926] mb-6 sm:mb-8">
            A private memory, made into a gift.
          </h2>
          <p className="text-[15px] sm:text-[17px] text-[#2D2926]/75 leading-relaxed max-w-3xl mx-auto">
            The card is the keepsake. Its QR code leads to UNIKMO, and the private access code opens the memory you created.
          </p>
          <ol className="mt-9 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
            {steps.map((step, index) => (
              <li key={step.title} className="rounded-2xl border border-[#2D2926]/10 bg-white/45 p-5 sm:p-6">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#2D2926] text-[#FDF9F5] text-sm font-medium">{index + 1}</span>
                <h3 className="mt-4 font-serif text-[18px] text-[#2D2926]">{step.title}</h3>
                <p className="mt-2 text-[14px] text-[#2D2926]/70 font-light leading-relaxed">{step.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-7 text-[12px] sm:text-[13px] uppercase tracking-[0.16em] text-[#2D2926]/55 font-medium">
            No app. No account. No advertising.
          </p>
        </div>
      </Container>
    </section>
  );
}

function ProductExperience() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.animate-on-scroll').forEach((el) => {
              el.classList.add('opacity-100', 'translate-y-0', 'translate-x-0');
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
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-[#FDF9F5] py-16 sm:py-20 lg:py-24 xl:py-32">
      <div className="absolute inset-0 z-0">
        <Image src="/story1.png" alt="" fill className="object-cover opacity-20" sizes="100vw" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10 lg:gap-16 xl:gap-24 items-center">
          <div className="lg:col-span-6 w-full animate-on-scroll opacity-0 -translate-x-8 transition-all duration-1000">
            <div className="relative aspect-[4/3] w-full rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
              <Image
                src="/cardfrontunikmo.jpg"
                alt="Back of a UNIKMO card showing where the QR code and private access code appear"
                fill
                className="object-contain"
                sizes="(min-width: 1224px) 80vw, 130vw"
                priority
              />
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000">
            <div className="max-w-xl mx-auto lg:mx-0">
              <h2 className="font-serif text-[30px] sm:text-[38px] lg:text-[48px] xl:text-[56px] leading-[1.1] text-[#2D2926]">
                Simple. Private. Personal.
              </h2>

              <div className="mt-8 sm:mt-10 space-y-4 sm:space-y-6 text-[#2D2926]/80">
                <p className="text-[16px] sm:text-[18px] lg:text-[20px] font-light leading-relaxed">
                  Scan the QR code and confirm it opens a UNIKMO link, or type www.unikmo.com/unlock.
                </p>
                <p className="text-[18px] sm:text-[20px] lg:text-[22px] font-serif italic">Enter the Moment Key</p>
                <p className="text-[18px] sm:text-[20px] lg:text-[22px] font-serif italic">Experience the memory</p>
              </div>
            </div>
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
    <section
      ref={sectionRef}
      aria-labelledby="testimonials-heading"
      className="relative py-10 sm:py-14 lg:py-16 bg-[#EFE8E5] border-t border-[#2D2926]/[0.07]"
    >
      <div className="relative mx-auto max-w-2xl px-5 sm:px-6 lg:max-w-3xl">
        {/* One loose heading block — reads like a note, not a deck title */}
        <header className="mb-8 sm:mb-10 lg:mb-12">
          <h2
            id="testimonials-heading"
            className="font-serif text-[26px] sm:text-[32px] lg:text-[36px] text-[#2D2926] leading-snug font-normal animate-on-scroll opacity-0 translate-y-6 transition-all duration-1000"
          >
            The moment they unlock it is the gift.
          </h2>
          <p className="mt-4 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-75 text-[15px] sm:text-[16px] text-[#2D2926]/65 font-light leading-relaxed">
          Private messages, voice notes, photos, and videos — connected to something they can hold.
          </p>
        </header>

        {/* Single column: stacked stories, circular faces, no cards or grid */}
        <ul className="space-y-8 sm:space-y-10 lg:space-y-12 list-none m-0 p-0">
          {TESTIMONIALS.map((t, idx) => (
            <li
              key={t.name}
              className={`animate-on-scroll opacity-0 translate-y-6 transition-all duration-1000 ${
                idx === 0 ? 'delay-100' : 'delay-200'
              }`}
            >
              <div className="flex gap-4 sm:gap-5">
                <div className="relative h-[52px] w-[52px] sm:h-[60px] sm:w-[60px] shrink-0 overflow-hidden rounded-full ring-2 ring-[#FDF9F5] shadow-[0_2px_12px_rgba(45,41,38,0.08)]">
                  <Image src={t.imageSrc} alt={t.imageAlt} fill className="object-cover" sizes="60px" />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-[15px] sm:text-[16px] lg:text-[17px] text-[#2D2926]/88 font-light leading-[1.65]">
                    {t.quote}
                  </p>
                  <p className="mt-3 text-[13px] sm:text-[14px] text-[#2D2926]/50">{t.name}</p>
                </div>
              </div>
              {idx < TESTIMONIALS.length - 1 ? (
                <div className="mt-8 sm:mt-10 lg:mt-12 h-px w-full bg-[#2D2926]/[0.08]" aria-hidden />
              ) : null}
            </li>
          ))}
        </ul>

        <p className="mt-8 sm:mt-10 lg:mt-12 text-center text-[13px] sm:text-[14px] text-[#2D2926]/50 font-light tracking-wide animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-300">
          PRIVATE BY DEFAULT &nbsp;·&nbsp; NO LOGIN &nbsp;·&nbsp; NO ADS
        </p>
      </div>
    </section>
  );
}

function QuestionsSection({ onContactClick }: { onContactClick: () => void }) {
  return (
    <section
      aria-labelledby="questions-heading"
      className="bg-[#FDF9F5] py-12 sm:py-14 lg:py-16 border-t border-[#2D2926]/6"
    >
      <Container>
        <div className="max-w-xl mx-auto text-center">
          <h2
            id="questions-heading"
            className="font-serif text-[22px] sm:text-[26px] lg:text-[28px] text-[#2D2926] mb-3 sm:mb-4"
          >
            Questions before you create one?
          </h2>
          <p className="text-[14px] sm:text-[15px] text-[#2D2926]/70 font-light leading-relaxed mb-6 sm:mb-7">
            If you&apos;re not sure which card to choose, how the private code works, or whether UNIKMO fits your moment, send us a note.
          </p>
          <button
            type="button"
            onClick={onContactClick}
            className="inline-flex items-center justify-center rounded-full bg-transparent border border-[#2D2926]/20 text-[#2D2926] px-7 py-3 text-[11px] sm:text-[12px] font-medium tracking-[0.08em] uppercase hover:bg-[#2D2926]/5 transition-colors"
          >
            Contact UNIKMO
          </button>
          <p className="mt-4 text-[13px] sm:text-[14px] text-[#2D2926]/70">
            <a href="/faq" className="font-medium text-[#2D2926] underline underline-offset-2 decoration-[#2D2926]/40 hover:decoration-[#2D2926] transition-colors">
              Still unsure? Read the FAQ.
            </a>
          </p>
        </div>
      </Container>
    </section>
  );
}

function FinalCta({ onCreateMomentClick }: { onCreateMomentClick: () => void }) {
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
    <section
      ref={sectionRef}
      id="final-cta"
      className="py-12 sm:py-16 lg:py-20 xl:py-24 bg-[#F5EEED] border-t border-[#2D2926]/[0.06]"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center pt-2 sm:pt-4">
        <h2 className="font-serif text-[28px] sm:text-[36px] lg:text-[44px] xl:text-[52px] leading-[1.08] text-[#2D2926] font-normal tracking-tight animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000">
          Someone already came to mind.
        </h2>

        <p className="mt-4 sm:mt-5 text-[15px] sm:text-[16px] lg:text-[18px] text-[#2D2926]/85 font-light leading-relaxed animate-on-scroll opacity-0 translate-y-6 transition-all duration-1000 delay-100">
            Turn a precious memory into a lasting gift.
        </p>

        <div className="mt-8 sm:mt-10 lg:mt-12 flex flex-col items-center gap-2.5 animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 delay-200">
          <button
            type="button"
            onClick={onCreateMomentClick}
            className="inline-flex items-center justify-center rounded-full bg-[#E9DCCF] hover:bg-[#DDD0C4] active:bg-[#D3C7BB] text-[#2D2926] px-8 py-3.5 sm:px-10 sm:py-4 text-[12px] sm:text-[13px] font-medium tracking-[0.08em] transition-colors shadow-sm border border-[#2D2926]/10"
          >
            Create Your Moment
          </button>
          <p className="text-[11px] sm:text-[12px] text-[#2D2926]/50 font-light leading-snug max-w-md">
            Founding release — 100 cards only.
          </p>
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
  return (
    <footer className="bg-[#FDF9F5] border-t border-[#2D2926]/[0.07]">
      {/* Tree = footer hero / accent — only this + links are footer; trust strip stays in <main> above */}
      <div className="bg-[#FDF9F5] pt-0 pb-0 leading-[0]" aria-hidden>
        <div className="max-w-7xl mx-auto flex justify-center sm:justify-end pr-0 sm:pr-4 md:pr-6">
          <Image
            src="/plant3.png"
            width={720}
            height={560}
            alt=""
            className="h-auto w-[min(92vw,360px)] sm:w-[min(46vw,420px)] md:w-[min(40vw,440px)] lg:w-[420px] max-h-[240px] sm:max-h-[280px] md:max-h-[300px] lg:max-h-[320px] object-contain object-bottom align-bottom [filter:brightness(1.05)_saturate(0.72)_contrast(0.88)]"
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 420px"
          />
        </div>
      </div>

      <div className="bg-[#FDF9F5] border-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-5 lg:gap-6 text-[10px] sm:text-[11px] lg:text-[12px] tracking-widest uppercase text-[#2D2926]/50">
          
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-3 sm:gap-x-4 gap-y-2">
            <span className="font-semibold text-[#2D2926]/80">UNIKMO © {new Date().getFullYear()}</span>
            <span className="hidden sm:inline-block text-[#2D2926]/20">|</span>
            <span>A card that unlocks a private memory.</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-5 lg:gap-6">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-800/40" />
              <span>One tree planted with every card.</span>
              <svg
                viewBox="0 0 24 24"
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current opacity-60"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <a
                href="https://www.instagram.com/myunikmo"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#2D2926] transition-colors"
              >
                INSTAGRAM
              </a>
              <a
                href="https://www.tiktok.com/@myunikmo"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#2D2926] transition-colors flex items-center gap-1"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current"
                >
                  <path d="M16.5 3c.4 1.3 1.4 2.4 2.7 2.9v3.1c-1.1-.1-2.1-.4-3-1v6.4c0 3.4-2.7 6.1-6.1 6.1S4 17.8 4 14.4c0-3.4 2.7-6.1 6.1-6.1.4 0 .8 0 1.1.1v3.1c-.3-.1-.7-.2-1.1-.2-1.6 0-2.9 1.3-2.9 3.1 0 1.7 1.3 3 2.9 3s2.9-1.3 2.9-3V3h3.5z" />
                </svg>
                <span>TIKTOK</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-7 lg:mt-8 flex justify-center gap-4 sm:gap-6 lg:gap-8 text-[8px] sm:text-[9px] lg:text-[10px] tracking-[0.2em] uppercase text-[#2D2926]/55">
          <a
            href="/faq"
            className="hover:text-[#2D2926]/60 transition-colors"
          >
            FAQ
          </a>
          <button
            type="button"
            onClick={onContactClick}
            className="hover:text-[#2D2926]/60 transition-colors"
          >
            Contact
          </button>
          <button
            type="button"
            onClick={onPrivacyClick}
            className="hover:text-[#2D2926]/60 transition-colors"
          >
            Privacy
          </button>
          <button
            type="button"
            onClick={onTermsClick}
            className="hover:text-[#2D2926]/60 transition-colors"
          >
            Terms
          </button>
          <button
            type="button"
            onClick={onImprintClick}
            className="hover:text-[#2D2926]/60 transition-colors"
          >
            Imprint
          </button>
        </div>
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
              <p className="mt-2">Contact: your email</p>
            </section>

            <section>
              <h4 className="font-semibold text-[#2D2926] mb-2">8. Cookies</h4>
              <p>We use minimal cookies for website functionality and analytics (if enabled).</p>
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

function DistanceStory() {
  return (
    <section className="bg-[#FDF9F5] py-12 sm:py-16 lg:py-20 border-t border-[#2D2926]/6">
      <Container>
        <div className="rounded-[2rem] bg-[#2D2926] px-6 py-10 sm:px-10 sm:py-12 lg:px-16 lg:py-14 text-[#FDF9F5]">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#FDF9F5]/55 font-medium">For families across the distance</p>
          <h2 className="mt-3 max-w-3xl font-serif text-[28px] sm:text-[36px] lg:text-[46px] leading-tight">Far away does not have to feel far apart.</h2>
          <p className="mt-4 max-w-2xl text-[15px] sm:text-[17px] text-[#FDF9F5]/75 font-light leading-relaxed">
            Create a private family message, connect it to a physical card, and send someone a piece of home they can hold and revisit whenever they miss you.
          </p>
          <a href="#shop" className="mt-7 inline-flex rounded-full bg-[#FDF9F5] px-7 py-3.5 text-[12px] font-medium tracking-[0.08em] text-[#2D2926] hover:bg-[#EFE8E5] transition-colors">Create Your Moment</a>
        </div>
      </Container>
    </section>
  );
}
