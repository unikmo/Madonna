'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type ReactNode } from 'react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDF9F5] text-[#1E1B18]">
      <SiteHeader />

      <main>
        <Hero />
        <StoryIn />
        <EmotionalPositioning />
        <HowItWorks />
        <ProductExperience />
        <StoryInEveryKey />
        <SocialProof />
        <BrandStory />
        <FinalCta />
      </main>

      <SiteFooter />
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
      : 'border border-[#1E1B18]/20 bg-transparent text-[#1E1B18] hover:bg-[#1E1B18]/5';
  return (
    <a className={`${base} ${styles}`} href={href}>
      {children}
    </a>
  );
}

function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 bg-[#FDF9F5] transition-all duration-300 ${
        isScrolled ? 'bg-[#FDF9F5]/90 backdrop-blur-md shadow-md' : ''
      }`}
    >
      <Container>
        <div className="flex h-14 sm:h-16 items-center justify-between">
          <nav className="flex-1">
            <a
              className="text-[10px] sm:text-xs font-medium text-[#1E1B18]/55 hover:text-[#1E1B18] transition-all duration-300 hover:translate-x-1 inline-block"
              href="#how-it-works"
            >
              How it Works
            </a>
          </nav>

          <a
            className="font-serif text-lg sm:text-xl tracking-[0.32em] text-[#1E1B18]/90 hover:scale-105 transition-transform duration-300"
            href="#top"
          >
            UNIKMO
          </a>

          <nav className="flex-1 flex justify-end">
            <a 
              className="text-[10px] sm:text-xs font-medium text-[#1E1B18]/55 hover:text-[#1E1B18] transition-all duration-300 hover:-translate-x-1"
              href="#shop"
            >
              Shop
            </a>
          </nav>
        </div>
      </Container>
    </header>
  );
}
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
    /* 1. min-h remove kar di hai taake section image ke mutabiq shrink ho sake */
    <section 
      ref={heroRef}
      className="relative flex items-center overflow-hidden opacity-0 translate-y-8 transition-all duration-1000 bg-[#FDF9F5]"
    >
      {/* Background Image (Optional: Agar aapko solid color chahiye toh is div ko hata sakte hain) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg-hero1.png"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#FDF9F5]/40" />
      </div>

      <div className="relative z-10 w-full">
        <Container>
          {/* 2. items-stretch use kiya hai taake columns ki height barabar rahe */}
          <div className="flex flex-col lg:grid lg:grid-cols-2 items-stretch">
            
            {/* Left Side: Image Container */}
            <div className="flex justify-center lg:justify-start items-end">
              <div className="relative w-[90%] sm:w-[80%] lg:w-[115%] xl:w-[125%] aspect-[16/11] lg:-ml-4 xl:-ml-8">
                <Image
                  src="/heroimage1.png"
                  alt="Unikmo Card in Hand"
                  fill
                  priority
                  /* 3. object-bottom aur -mb-1 (minus margin) se bottom gap khatam ho jayega */
                  // className="object-contain object-bottom drop-shadow-[15px_25px_20px_rgba(0,0,0,0.12)] -mb-1"
                />
              </div>
            </div>

            {/* Right Side: Text Content */}
            {/* 4. py-12 ya py-16 ko adjust kar ke aap top/bottom spacing control kar sakte hain */}
            <div className="flex flex-col justify-center py-10 lg:py-16 px-4 lg:px-8 xl:px-12 text-center lg:text-left">
              <h1 className="font-serif text-[32px] sm:text-[40px] lg:text-[52px] xl:text-[68px] leading-[1.05] text-[#2D2926] font-normal tracking-tight">
                Not just a gift. A moment.
              </h1>
              
              <div className="mt-4 sm:mt-6 lg:mt-8 space-y-1 text-[14px] sm:text-[16px] lg:text-[18px] xl:text-[19px] text-[#2D2926]/85 font-light leading-relaxed tracking-wide">
                <p>Unikmo turns memories into something you can hold.</p>
                <p>
                  A card unlocks a personal video, voice message,
                  <br className="hidden sm:block" />
                  or photo—saved for years to come.
                </p>
              </div>
            </div>

          </div>
        </Container>
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
};

function StoryIn() {
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
    let subtitle = 'A small moment, beautifully delivered';
    if (product.title.toLowerCase().includes('4') || product.title.toLowerCase().includes('four')) {
      subtitle = 'A collection of memories';
    } else if (product.title.toLowerCase().includes('7') || product.title.toLowerCase().includes('seven')) {
      subtitle = 'A story told over time';
    }
    return {
      product,
      title: product.title,
      subtitle,
      img: product.image || '/placeholder-product.png',
      imageAlt: product.imageAlt || product.title,
    };
  });

  const trustItems = [
    { label: 'Private & secure', icon: <IconShield /> },
    { label: 'One code – one memory', icon: <IconCode /> },
    { label: 'A tree planted', icon: <IconLeaf /> },
  ];

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-12 sm:py-16 lg:py-20">
      <div className="absolute inset-0 z-0">
        <Image src="/story1.png" alt="" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-[#FDF9F5]/10" />
      </div>

      {/* 3. Plant Image: Shifted further down to align with section bottom */}
     <div className="pointer-events-none absolute bottom-[-45px] right-0 z-10 h-[280px] w-[180px] sm:h-[380px] sm:w-[230px] lg:h-[480px] lg:w-[330px] xl:h-[580px] xl:w-[430px] overflow-hidden opacity-60 lg:opacity-80">
  <Image 
    src="/plant3.png" 
    alt="" 
    fill 
    className="object-contain object-right-bottom" 
    sizes="500px" 
  />
</div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 1. Main Title: Space reduced to mb-4 */}
          <h2 className="text-center font-serif text-[22px] sm:text-[28px] lg:text-[34px] text-[#2D2926] mb-4 tracking-tight animate-on-scroll opacity-0 translate-y-4 transition-all duration-700">
            A Story in Every Key
          </h2>

          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Left Side: Images Section */}
            <div className="lg:col-span-9 space-y-4">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                  {[1, 2, 3].map((idx) => (
                    <div key={idx} className="text-center">
                      <div className="relative mx-auto h-[350px] sm:h-[400px] lg:h-[480px] xl:h-[520px] w-full mb-2 bg-[#2D2926]/5 animate-pulse rounded-lg" />
                    </div>
                  ))}
                </div>
              ) : items.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                  {items.map((i, idx) => (
  <button
    type="button"
    key={i.product.id}
    onClick={() => setSelectedProduct({ product: i.product, subtitle: i.subtitle, img: i.img, imageAlt: i.imageAlt })}
    className={`text-center group transition-all duration-700 cursor-pointer w-full border-0 bg-transparent p-0 ${
      productsRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
    }`}
    style={{ transitionDelay: productsRevealed ? `${idx * 80}ms` : undefined }}
  >
    {/* MB-0 to ensure no bottom margin from image container */}
    <div className="relative mx-auto h-[350px] sm:h-[400px] lg:h-[480px] xl:h-[520px] w-full max-w-full mb-0">
      <Image
        src={i.img}
        alt={i.imageAlt || i.title}
        fill
        className="object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.15)] group-hover:scale-105 transition-transform duration-500"
        sizes="(min-width: 1280px) 450px, (min-width: 1024px) 400px, (min-width: 640px) 350px, 300px"
        priority={idx < 3}
      />
    </div>
    
    {/* Increased negative margin (mt-[-15px] to mt-[-25px]) to pull title UP */}
    <h4 className="font-serif text-[18px] sm:text-[19px] lg:text-[21px] text-[#2D2926] font-medium leading-tight mt-[-55px] sm:mt-[-55px] lg:mt-[-60px] relative z-20">
      {i.title}
    </h4>
    
    <p className="mt-1 text-[13px] sm:text-[14px] lg:text-[15px] text-[#2D2926]/60 leading-relaxed max-w-[200px] mx-auto">
      {i.subtitle}
    </p>
  </button>
))}
                </div>
              ) : null}

              {/* Action Buttons Area */}
              <div className="space-y-4 pt-2">
                <div className="flex justify-center">
                  <a
                    className="inline-flex items-center justify-center rounded-sm bg-[#2D2926] px-8 sm:px-10 py-3 text-[9px] sm:text-[10px] font-semibold tracking-[0.2em] sm:tracking-[0.25em] uppercase text-white hover:bg-black transition-colors duration-300 shadow-sm"
                    href="#shop"
                  >
                    CREATE YOUR MOMENT
                  </a>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-3 pt-4 border-t border-[#2D2926]/10">
                  {trustItems.map((t) => (
                    <div key={t.label} className="flex items-center gap-2">
                      <span className="text-[#2D2926]/50">{t.icon}</span>
                      <span className="text-[10px] sm:text-[11px] text-[#2D2926]/70 font-medium tracking-wide">{t.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side: Text Section */}
            <div className="lg:col-span-3 flex flex-col justify-end pb-8 sm:pb-12 lg:pb-16 text-center lg:text-left animate-on-scroll opacity-0 translate-y-6 transition-all duration-700">
              <div className="max-w-xs mx-auto lg:mx-0 lg:pl-6 border-l-0 lg:border-l lg:border-[#2D2926]/10 lg:pl-8">
                <h3 className="font-serif text-[18px] sm:text-[22px] lg:text-[26px] text-[#2D2926] leading-[1.12] mb-3 lg:mb-4">
                  Rooted in Reality
                </h3>
                <div className="space-y-2 text-[13px] sm:text-[14px] lg:text-[15px] leading-relaxed text-[#2D2926]/75 font-light">
                  <p>For every key you hold, we plant a tree.</p>
                  <p>
                    We believe in preserving your memories and the world they were
                    made in. A legacy that lives in the cloud, rooted in the earth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
function ProductModal({
  selected,
  storeDomain,
  onClose,
}: {
  selected: { product: Product; subtitle: string; img: string; imageAlt: string };
  storeDomain: string;
  onClose: () => void;
}) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const product = selected.product;
  const keyCount = product.title.toLowerCase().includes('7') ? 7 : product.title.toLowerCase().includes('4') ? 4 : 1;

  const handleBuyNow = () => {
    const trimmed = email.trim();
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
    if (storeDomain && product.variantId) {
      const checkoutUrl = `https://${storeDomain}/cart/${product.variantId}:1?checkout`;
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
        className="bg-[#FDF9F5] rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#2D2926]/10"
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
          <div className="relative aspect-[4/3] w-full max-w-[280px] mx-auto rounded-xl overflow-hidden mb-6">
            <Image
              src={selected.img}
              alt={selected.imageAlt}
              fill
              className="object-contain"
              sizes="280px"
            />
          </div>
          <h3 className="font-serif text-[22px] sm:text-[26px] text-[#2D2926] text-center mb-1">
            {product.title}
          </h3>
          <p className="text-[#2D2926]/60 text-sm text-center mb-6">{selected.subtitle}</p>

          <div className="space-y-4 mb-6 text-[#2D2926]/80 text-sm">
            <div>
              <h4 className="font-semibold text-[#2D2926] mb-1">What you get</h4>
              <ul className="list-disc list-inside space-y-0.5">
                <li>{keyCount} unique Moment Code{keyCount > 1 ? 's' : ''} delivered by email</li>
                <li>Delivery options: Physical + Digital, Split, or Full Digital</li>
                <li>One code = one private memory (video, voice, or photo)</li>
                <li>A tree planted for every key</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#2D2926] mb-1">How it works</h4>
              <ol className="list-decimal list-inside space-y-0.5">
                <li>Buy → you receive your code(s) by email</li>
                <li>Upload your moment at unikmo.com/unlock (or /upload)</li>
                <li>Share the code or card with the recipient</li>
                <li>They unlock and view at unikmo.com/unlock</li>
              </ol>
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
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl border border-[#2D2926]/20 bg-white text-[#2D2926] placeholder-[#2D2926]/40 focus:outline-none focus:ring-2 focus:ring-[#2D2926]/30"
            />
            {emailError && <p className="text-red-600 text-xs">{emailError}</p>}
          </div>

          <button
            type="button"
            onClick={handleBuyNow}
            disabled={!storeDomain || !product.variantId}
            className="w-full py-4 rounded-full bg-[#2D2926] text-white font-semibold text-sm tracking-wide uppercase hover:bg-[#1E1B18] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Buy now
          </button>
          {(!storeDomain || !product.variantId) && (
            <p className="text-center text-amber-700 text-xs mt-3">
              {!storeDomain ? 'Store not configured. Set Shopify credentials in admin.' : 'Product variant not available.'}
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
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg ring-1 ring-black/10 group">
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
              Unlock a Moment
              <br />
              <span className="italic">That Lasts Forever</span>
            </h2>
            <p className="mt-4 text-[11px] sm:text-[12px] lg:text-[13px] leading-relaxed text-[#2D2926]/60">
              Hold onto what matters most—private memories saved for years.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

function HowItWorks() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.step-item').forEach((el, index) => {
              setTimeout(() => {
                el.classList.add('opacity-100', 'translate-y-0', 'scale-100');
              }, index * 200);
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

  const steps = [
    {
      title: 'Buy a Moment Key',
      icon: <IconKey />,
    },
    {
      title: 'Add your video, photo, or message',
      icon: <IconUpload />,
    },
    {
      title: 'They unlock it anytime',
      icon: <IconHeart />,
    },
  ];

  return (
    <section ref={sectionRef} id="how-it-works" className="pb-12 sm:pb-14 lg:pb-16 xl:pb-20 bg-gradient-to-b from-[#FDF9F5] to-[#F7F1EA]">
      <Container>
        <div className="mx-auto max-w-2xl sm:max-w-3xl rounded-xl sm:rounded-2xl bg-[#FBF7F2]/80 px-4 sm:px-8 lg:px-10 py-6 sm:py-7 lg:py-8 text-center ring-1 ring-black/10 shadow-[0_10px_26px_rgba(0,0,0,0.06)]">
          <p className="font-serif text-[11px] sm:text-[12px] lg:text-[13px] text-[#2D2926]/70">
            How It Works
          </p>

          <div className="mt-4 sm:mt-5 grid grid-cols-3 gap-4 sm:gap-6 lg:gap-10">
            {steps.map((s, index) => (
              <div 
                key={s.title} 
                className="step-item flex flex-col items-center opacity-0 translate-y-4 scale-95 transition-all duration-500 group"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="text-[#2D2926]/55 group-hover:scale-110 group-hover:text-[#2D2926] transition-all duration-300">
                  {s.icon}
                </div>
                <p className="mt-2 text-[9px] sm:text-[10px] lg:text-[11px] leading-4 text-[#2D2926]/55 group-hover:text-[#2D2926]/75 transition-colors duration-300">
                  {s.title}
                </p>
              </div>
            ))}
          </div>
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
                alt="Moment Key Experience"
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

              <div className="mt-8 sm:mt-10 space-y-4 sm:space-y-6">
                <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000">
                  <p className="text-[18px] sm:text-[20px] lg:text-[22px] text-[#2D2926]/80 font-serif italic">Enter the Moment Code</p>
                </div>

                <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000">
                  <p className="text-[18px] sm:text-[20px] lg:text-[22px] text-[#2D2926]/80 font-serif italic">Experience the memory</p>
                </div>
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
    { label: 'One code – one memory', icon: <IconCode /> },
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
              
              <div className="h-px w-8 bg-[#2D2926]/10 mx-auto mb-4 sm:mb-5 lg:mb-6" />
              
              <p className="text-[12px] sm:text-[13px] lg:text-[14px] text-[#2D2926]/60 font-light mb-6 sm:mb-7 lg:mb-8 italic">{p.sub}</p>
              
              <button className="text-[10px] sm:text-[11px] lg:text-[12px] uppercase tracking-[0.2em] text-[#2D2926]/40 group-hover:text-[#2D2926] transition-all duration-300 flex items-center justify-center gap-2 mx-auto">
                Discover <span className="text-[12px] sm:text-[13px] lg:text-[14px]">→</span>
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 xl:gap-12 pt-8 sm:pt-10 border-t border-[#2D2926]/5">
          {trustItems.map((i, index) => (
            <div 
              key={i.label} 
              className="flex flex-col items-center text-center animate-on-scroll opacity-0 translate-y-6 transition-all duration-700"
              style={{ transitionDelay: `${600 + index * 100}ms` }}
            >
              <div className="text-[#2D2926]/30 mb-2 sm:mb-3 group-hover:text-[#2D2926]/60 transition-colors">
                {i.icon}
              </div>
              <p className="text-[9px] sm:text-[10px] lg:text-[11px] uppercase tracking-[0.15em] text-[#2D2926]/50 font-medium leading-tight">
                {i.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

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
    <section ref={sectionRef} className="py-12 sm:py-16 lg:py-20 xl:py-24 bg-[#FDF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center border-t border-b border-[#2D2926]/5 py-10 sm:py-12 lg:py-16">
          

          <h2 className="mt-4 sm:mt-5 lg:mt-6 font-serif text-[24px] sm:text-[30px] lg:text-[36px] xl:text-[42px] text-[#2D2926] leading-tight animate-on-scroll opacity-0 translate-y-6 transition-all duration-1000 delay-200">
            Moments, Private, Shared.
          </h2>

          <p className="mt-3 sm:mt-4 text-[16px] sm:text-[18px] lg:text-[20px] xl:text-[22px] text-[#2D2926]/50 font-light italic animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 delay-400">
            A collection of emotional stories from our users.
          </p>

          <h3 className="mt-10 sm:mt-12 lg:mt-14 font-serif text-[20px] sm:text-[24px] lg:text-[28px] text-[#2D2926] animate-on-scroll opacity-0 translate-y-6 transition-all duration-1000 delay-500">
            Moments people never forget
          </h3>

          <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 max-w-4xl mx-auto">
            <blockquote className="animate-on-scroll opacity-0 translate-y-6 transition-all duration-1000 delay-600">
              <p className="text-[15px] sm:text-[16px] lg:text-[17px] text-[#2D2926]/80 font-light leading-relaxed italic">
                &ldquo;I gave this to my partner for her birthday. She cried within seconds. It felt deeply personal — not just another gift.&rdquo;
              </p>
              <footer className="mt-4 text-[13px] sm:text-[14px] text-[#2D2926]/50 font-medium not-italic">
                Matt L., London
              </footer>
            </blockquote>
            <blockquote className="animate-on-scroll opacity-0 translate-y-6 transition-all duration-1000 delay-700">
              <p className="text-[15px] sm:text-[16px] lg:text-[17px] text-[#2D2926]/80 font-light leading-relaxed italic">
                &ldquo;Such a simple idea, yet incredibly powerful. The moment we unlocked the message together, it became something we&apos;ll remember forever.&rdquo;
              </p>
              <footer className="mt-4 text-[13px] sm:text-[14px] text-[#2D2926]/50 font-medium not-italic">
                Daniel R., New York
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}

function BrandStory() {
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
    <section ref={sectionRef} className="py-16 sm:py-20 lg:py-24 xl:py-28 bg-[#FDF9F5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-[10px] sm:text-[11px] lg:text-[12px] tracking-[0.3em] sm:tracking-[0.4em] uppercase text-[#2D2926]/40 font-medium animate-on-scroll opacity-0 translate-y-4 transition-all duration-1000">
          Brand Story
        </p>

        <div className="mt-6 sm:mt-7 lg:mt-8 space-y-3 sm:space-y-4 animate-on-scroll opacity-0 translate-y-6 transition-all duration-1000 delay-300">
          <p className="font-serif text-[18px] sm:text-[22px] lg:text-[26px] xl:text-[30px] text-[#2D2926] leading-[1.4] font-light">
            In a world of instant messages and disappearing content, 
            Unikmo was created to preserve what truly matters.
          </p>
          
          <p className="text-[16px] sm:text-[18px] lg:text-[20px] xl:text-[22px] text-[#2D2926]/70 font-serif italic pt-2 sm:pt-3 lg:pt-4">
            A voice. A memory. A moment.
          </p>
        </div>

        <div className="mt-10 sm:mt-11 lg:mt-12 h-px w-12 bg-[#2D2926]/10 mx-auto animate-on-scroll opacity-0 transition-all duration-1000 delay-700" />
      </div>
    </section>
  );
}

function FinalCta() {
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
    <section ref={sectionRef} id="final-cta" className="py-16 sm:py-20 lg:py-24 xl:py-32 bg-[#FDF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center border-t border-[#2D2926]/5 pt-12 sm:pt-16 lg:pt-20">
        <h2 className="font-serif text-[20px] sm:text-[24px] lg:text-[30px] xl:text-[36px] text-[#2D2926] animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000">
          Give something they will keep forever.
        </h2>

        <div className="mt-8 sm:mt-10 animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 delay-300">
          <button className="inline-flex items-center justify-center bg-[#2D2926] hover:bg-[#1a1816] text-white text-[12px] sm:text-[13px] lg:text-[14px] tracking-[0.15em] uppercase px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-full transition-all duration-500 hover:scale-[1.02] shadow-[0_10px_30px_rgba(0,0,0,0.15)] group">
            Create Your Moment
            <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
          </button>
        </div>

        <div className="mt-16 sm:mt-20 lg:mt-24 h-px w-full bg-[#2D2926]/5" />
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="bg-[#FDF9F5] py-6 sm:py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-px w-full bg-[#2D2926]/5 mb-6 sm:mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-5 lg:gap-6 text-[10px] sm:text-[11px] lg:text-[12px] tracking-widest uppercase text-[#2D2926]/50">
          
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-3 sm:gap-x-4 gap-y-2">
            <span className="font-semibold text-[#2D2926]/80">UNIKMO © 2024</span>
            <span className="hidden sm:inline-block text-[#2D2926]/20">|</span>
            <span className="italic">A physical key to a private memory.</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-5 lg:gap-6">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-800/40" />
              <span>A TREE PLANTED</span>
              <svg 
                viewBox="0 0 24 24" 
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current opacity-60"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-[#2D2926] transition-colors"
            >
              INSTAGRAM
            </a>
          </div>
        </div>

        <div className="mt-6 sm:mt-7 lg:mt-8 flex justify-center gap-4 sm:gap-6 lg:gap-8 text-[8px] sm:text-[9px] lg:text-[10px] tracking-[0.2em] uppercase text-[#2D2926]/30">
          <a href="#privacy" className="hover:text-[#2D2926]/60 transition-colors">Privacy</a>
          <a href="#legal" className="hover:text-[#2D2926]/60 transition-colors">Legal</a>
          <a href="#contact" className="hover:text-[#2D2926]/60 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
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