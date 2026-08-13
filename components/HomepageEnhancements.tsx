'use client';

import { useEffect } from 'react';

const HERO_VIDEO = '/video/unikmo-hero.mp4';
const HERO_POSTER = '/images/unikmo-lifestyle.jpg';
const CARD_FRONT = '/cardfrontsite_staged.jpg';
const CARD_BACK = '/cardfrontunikmo.jpg';

const OCCASION_IMAGES = [
  '/cardfrontsite_staged.jpg',
  'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=900&q=86',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=86',
  '/nr1.jpg',
];

const TESTIMONIALS = [
  {
    quote:
      'I gave it to my partner for her birthday. She cried within seconds. It felt deeply personal — not just another gift.',
    name: 'Matt L., London',
  },
  {
    quote:
      "Such a simple idea, but incredibly powerful. The moment we unlocked the message together, it became something we'll remember forever.",
    name: 'Sophie M., New York',
  },
];

function findSection(text: string) {
  return Array.from(document.querySelectorAll<HTMLElement>('main section')).find((section) =>
    section.textContent?.includes(text)
  );
}

function configureHero() {
  const section = document.querySelector<HTMLElement>('#top');
  const video = section?.querySelector<HTMLVideoElement>('video');
  if (!section || !video) return;

  video.src = HERO_VIDEO;
  video.poster = HERO_POSTER;
  video.autoplay = false;
  video.muted = false;
  video.controls = true;
  video.playsInline = true;
  video.loop = false;
  video.preload = 'metadata';
  video.removeAttribute('autoplay');
  video.removeAttribute('loop');
  video.className = 'absolute inset-0 h-full w-full object-cover object-center';

  if (video.dataset.referenceConfigured !== 'true') {
    video.dataset.referenceConfigured = 'true';
    video.load();
  }

  const frame = video.parentElement as HTMLElement | null;
  if (!frame) return;
  frame.classList.add('unikmo-reference-hero-media');

  Array.from(frame.children).forEach((child) => {
    if (child === video) return;
    const el = child as HTMLElement;
    if (el.textContent?.includes('The moment, made tangible.')) el.style.display = 'none';
  });

  if (!frame.querySelector('[data-unikmo-play]')) {
    const play = document.createElement('button');
    play.type = 'button';
    play.dataset.unikmoPlay = 'true';
    play.className = 'unikmo-reference-play';
    play.setAttribute('aria-label', 'Play UNIKMO video');
    play.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7.25v9.5L17 12 9 7.25Z" fill="currentColor"/></svg>';
    frame.appendChild(play);

    const sync = () => {
      play.style.opacity = video.paused || video.ended ? '1' : '0';
      play.style.pointerEvents = video.paused || video.ended ? 'auto' : 'none';
    };
    play.addEventListener('click', () => void video.play().catch(() => undefined));
    video.addEventListener('play', sync);
    video.addEventListener('pause', sync);
    video.addEventListener('ended', sync);
    sync();
  }
}

function configureOccasions() {
  const section = document.querySelector<HTMLElement>('#gift-ideas');
  if (!section || section.dataset.referenceConfigured === 'true') return;

  const articles = Array.from(section.querySelectorAll<HTMLElement>('article')).slice(0, 4);
  if (articles.length < 4) return;

  const moments = articles.map((article) => ({
    title: article.querySelector('h3')?.textContent?.trim() || '',
    line: article.querySelector('p:last-child')?.textContent?.trim() || '',
  }));
  const grid = articles[0]?.parentElement;
  if (!grid) return;

  section.dataset.referenceConfigured = 'true';
  const heading = section.querySelector('h2');
  if (heading) heading.textContent = 'For the moments you do not want to reduce to a text.';

  grid.className = 'unikmo-reference-occasion-grid';
  grid.innerHTML = moments
    .map(
      (item, index) => `
        <article class="unikmo-reference-occasion-card">
          <div class="unikmo-reference-occasion-photo">
            <img src="${OCCASION_IMAGES[index]}" alt="${item.title}" loading="lazy" />
          </div>
          <div class="unikmo-reference-occasion-copy">
            <h3>${item.title}</h3>
            <p>${item.line}</p>
          </div>
        </article>
      `
    )
    .join('');

  grid.querySelectorAll<HTMLImageElement>('img').forEach((img) => {
    img.addEventListener('error', () => {
      img.src = indexFallback(img.alt);
    });
  });

  Array.from(section.querySelectorAll('p')).forEach((p) => {
    if (p.textContent?.includes('We use real customer and product photography only')) p.remove();
  });
}

function indexFallback(alt: string) {
  if (alt.toLowerCase().includes('long')) return HERO_POSTER;
  return CARD_FRONT;
}

function configureProductSides() {
  const section = document.querySelector<HTMLElement>('#about');
  if (!section) return;

  section.classList.add('unikmo-reference-product');

  const heading = section.querySelector('h2');
  if (heading) heading.innerHTML = 'More than a card.<br/>A moment they can keep.';

  const intro = Array.from(section.querySelectorAll('p')).find((p) =>
    p.textContent?.includes('The front is the keepsake')
  );
  if (intro) {
    intro.textContent =
      'Each UNIKMO card holds something priceless — your moment. Simple to give, impossible to forget.';
  }

  const figures = Array.from(section.querySelectorAll<HTMLElement>('figure'));
  if (figures.length < 2) return;

  const front = figures[0];
  const back = figures[1];
  const frontImg = front.querySelector<HTMLImageElement>('img');
  if (frontImg) {
    frontImg.removeAttribute('srcset');
    frontImg.removeAttribute('sizes');
    frontImg.src = CARD_FRONT;
    frontImg.alt = 'Front of the UNIKMO card with gold key';
    frontImg.style.objectFit = 'contain';
  }

  const backVisual = back.firstElementChild as HTMLElement | null;
  if (backVisual) {
    backVisual.innerHTML = `<img src="${CARD_BACK}" alt="Back of the UNIKMO card with QR code and private access key" class="h-full w-full object-contain p-3 sm:p-4" />`;
  }

  const frontCaption = front.querySelectorAll('figcaption span');
  if (frontCaption[0]) frontCaption[0].textContent = 'Front';
  if (frontCaption[1]) frontCaption[1].textContent = 'The key to your memory';
  const backCaption = back.querySelectorAll('figcaption span');
  if (backCaption[0]) backCaption[0].textContent = 'Back';
  if (backCaption[1]) backCaption[1].textContent = 'QR + private access key';
}

function configureShopVisibility() {
  const shop = document.querySelector<HTMLElement>('#shop');
  if (!shop) return;
  shop.classList.add('unikmo-reference-shop');
  shop.style.display = 'none';

  if (document.documentElement.dataset.unikmoShopLinks === 'true') return;
  document.documentElement.dataset.unikmoShopLinks = 'true';

  document.querySelectorAll<HTMLAnchorElement>('a[href="#shop"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      event.preventDefault();
      const finalSection = findSection('Create a moment');
      const action = finalSection
        ? Array.from(finalSection.querySelectorAll<HTMLElement>('button, a')).find((el) =>
            el.textContent?.includes('Create Your Moment')
          )
        : null;
      if (action && action !== anchor) {
        action.click();
        return;
      }
      shop.style.display = '';
      shop.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function configureTrustStrip() {
  const section = findSection('Private by design');
  if (!section || section.dataset.referenceTrust === 'true') return;
  section.dataset.referenceTrust = 'true';
  section.classList.add('unikmo-reference-trust');

  const items = Array.from(section.querySelectorAll<HTMLElement>('article, li'));
  if (items.length >= 4) items.slice(3).forEach((item) => (item.style.display = 'none'));
}

function configureSocialProof() {
  const section = document.querySelector<HTMLElement>('#stories');
  if (!section || section.dataset.referenceConfigured === 'true') return;
  section.dataset.referenceConfigured = 'true';
  section.className = 'unikmo-reference-testimonial';
  section.innerHTML = `
    <div class="unikmo-reference-testimonial-inner">
      <p class="unikmo-reference-eyebrow">IN THEIR WORDS</p>
      <div class="unikmo-reference-quote-row">
        <button type="button" data-quote-prev aria-label="Previous testimonial">‹</button>
        <div class="unikmo-reference-quote-copy" aria-live="polite">
          <div class="unikmo-reference-quote-mark">“</div>
          <blockquote data-quote-text></blockquote>
          <p data-quote-name></p>
          <div class="unikmo-reference-dots" aria-hidden="true"></div>
        </div>
        <button type="button" data-quote-next aria-label="Next testimonial">›</button>
      </div>
    </div>
  `;

  let active = 0;
  const quote = section.querySelector<HTMLElement>('[data-quote-text]');
  const name = section.querySelector<HTMLElement>('[data-quote-name]');
  const dots = section.querySelector<HTMLElement>('.unikmo-reference-dots');
  const render = () => {
    if (quote) quote.textContent = TESTIMONIALS[active].quote;
    if (name) name.textContent = TESTIMONIALS[active].name;
    if (dots) {
      dots.innerHTML = TESTIMONIALS.map((_, index) => `<span class="${index === active ? 'is-active' : ''}"></span>`).join('');
    }
  };
  section.querySelector('[data-quote-prev]')?.addEventListener('click', () => {
    active = (active - 1 + TESTIMONIALS.length) % TESTIMONIALS.length;
    render();
  });
  section.querySelector('[data-quote-next]')?.addEventListener('click', () => {
    active = (active + 1) % TESTIMONIALS.length;
    render();
  });
  render();
}

function configureQuestions() {
  const section = findSection('QUESTIONS') || findSection('Questions');
  if (!section) return;
  section.classList.add('unikmo-reference-faq');
}

function configureFinalCta() {
  const section = findSection('Create a moment');
  if (!section) return;
  section.classList.add('unikmo-reference-final');
  section.id = 'final-create';

  const heading = section.querySelector('h2');
  if (heading) heading.textContent = 'Create a moment they’ll treasure forever.';
  const image = section.querySelector<HTMLImageElement>('img');
  if (image) {
    image.removeAttribute('srcset');
    image.removeAttribute('sizes');
    image.src = CARD_FRONT;
    image.alt = 'UNIKMO card ready to give';
    image.style.objectFit = 'cover';
  }
}

function installStyles() {
  const existing = document.getElementById('unikmo-reference-design');
  if (existing) existing.remove();
  const style = document.createElement('style');
  style.id = 'unikmo-reference-design';
  style.textContent = `
    html { scroll-behavior: smooth; }
    body { background: #FCF9F4 !important; }

    header > div,
    main > section > div,
    footer > div { max-width: 1180px !important; }

    header { border-color: rgba(34,50,58,.07) !important; }
    header > div { height: 66px !important; padding-left: 22px !important; padding-right: 22px !important; }

    #top { padding-top: 24px !important; padding-bottom: 30px !important; }
    #top > div > div { gap: 38px !important; grid-template-columns: 1.08fr .92fr !important; }
    .unikmo-reference-hero-media {
      min-height: 0 !important;
      aspect-ratio: 16 / 10 !important;
      border-radius: 18px !important;
      overflow: hidden !important;
      background: #e8dfd4 !important;
      box-shadow: 0 12px 34px rgba(34,50,58,.09) !important;
    }
    .unikmo-reference-play {
      position: absolute;
      left: 50%; top: 50%;
      width: 48px; height: 48px;
      transform: translate(-50%,-50%);
      display: grid; place-items: center;
      border: 0; border-radius: 999px;
      background: rgba(30,47,55,.88);
      color: white;
      z-index: 5;
      transition: opacity .2s ease, transform .2s ease;
      cursor: pointer;
    }
    .unikmo-reference-play:hover { transform: translate(-50%,-50%) scale(1.04); }
    .unikmo-reference-play svg { width: 22px; height: 22px; }

    #top h1 { font-size: clamp(44px,5.1vw,68px) !important; line-height: .96 !important; }
    #top p { max-width: 520px !important; }

    main > section:nth-of-type(2) { padding-top: 24px !important; padding-bottom: 30px !important; border-top: 1px solid rgba(34,50,58,.06); border-bottom: 1px solid rgba(34,50,58,.06); }

    #gift-ideas { padding-top: 34px !important; padding-bottom: 42px !important; }
    #gift-ideas h2 { font-size: clamp(31px,3.2vw,43px) !important; line-height: 1.06 !important; max-width: 760px; margin-left: auto; margin-right: auto; }
    .unikmo-reference-occasion-grid {
      display: grid !important;
      grid-template-columns: repeat(4,minmax(0,1fr)) !important;
      gap: 16px !important;
      margin-top: 28px !important;
    }
    .unikmo-reference-occasion-card {
      overflow: hidden;
      border: 1px solid rgba(34,50,58,.08);
      border-radius: 13px;
      background: rgba(255,255,255,.38);
    }
    .unikmo-reference-occasion-photo { height: 124px; overflow: hidden; background: #e9e0d5; }
    .unikmo-reference-occasion-photo img { width:100%; height:100%; object-fit:cover; display:block; }
    .unikmo-reference-occasion-copy { padding: 14px 15px 16px; text-align: center; }
    .unikmo-reference-occasion-copy h3 { margin:0; font-family:var(--font-cormorant),Georgia,serif; font-size:22px; line-height:1.05; color:#22323A; }
    .unikmo-reference-occasion-copy p { margin:6px 0 0; color:rgba(34,50,58,.62); font-size:11px; line-height:1.4; }

    #about { padding-top: 38px !important; padding-bottom: 36px !important; }
    #about h2 { font-size: clamp(36px,3.8vw,50px) !important; line-height: .98 !important; }
    #about figure { border-radius: 14px !important; }
    #about figure > div { min-height: 210px !important; }

    #shop.unikmo-reference-shop { display:none !important; }

    .unikmo-reference-trust { padding-top: 0 !important; padding-bottom: 0 !important; border-top: 1px solid rgba(34,50,58,.07); border-bottom: 1px solid rgba(34,50,58,.07); }
    .unikmo-reference-trust > div { padding-top: 22px !important; padding-bottom: 22px !important; }
    .unikmo-reference-trust .grid { grid-template-columns: repeat(3,minmax(0,1fr)) !important; }

    .unikmo-reference-testimonial { padding: 40px 22px 42px !important; background:#FCF9F4; }
    .unikmo-reference-testimonial-inner { max-width:900px; margin:0 auto; text-align:center; }
    .unikmo-reference-eyebrow { margin:0 0 18px; color:#B38846; font-size:9px; font-weight:600; letter-spacing:.24em; }
    .unikmo-reference-quote-row { display:grid; grid-template-columns:36px 1fr 36px; gap:22px; align-items:center; }
    .unikmo-reference-quote-row > button { width:36px; height:36px; border:0; background:transparent; color:#B38846; font-family:Georgia,serif; font-size:28px; cursor:pointer; }
    .unikmo-reference-quote-mark { color:#B38846; font-family:Georgia,serif; font-size:44px; line-height:.7; }
    .unikmo-reference-quote-copy blockquote { margin:10px auto 0; max-width:720px; color:#22323A; font-family:var(--font-cormorant),Georgia,serif; font-size:25px; line-height:1.18; }
    .unikmo-reference-quote-copy [data-quote-name] { margin:13px 0 0; color:rgba(34,50,58,.58); font-size:10px; letter-spacing:.08em; }
    .unikmo-reference-dots { display:flex; justify-content:center; gap:6px; margin-top:14px; }
    .unikmo-reference-dots span { width:4px; height:4px; border-radius:50%; background:rgba(179,136,70,.26); }
    .unikmo-reference-dots span.is-active { background:#B38846; }

    .unikmo-reference-faq { padding-top: 30px !important; padding-bottom: 30px !important; border-top: 1px solid rgba(34,50,58,.06); }
    .unikmo-reference-faq .grid { gap: 8px !important; }

    .unikmo-reference-final { padding-top: 18px !important; padding-bottom: 34px !important; }
    .unikmo-reference-final > div > div { border-radius:16px !important; background:#EEE3D6 !important; }
    .unikmo-reference-final h2 { font-size:clamp(31px,3vw,43px) !important; line-height:1.02 !important; }

    footer { padding-top: 18px !important; padding-bottom: 18px !important; }

    @media (max-width: 1023px) {
      #top > div > div { grid-template-columns:1fr !important; gap:28px !important; }
      .unikmo-reference-hero-media { aspect-ratio:16 / 10 !important; }
      .unikmo-reference-occasion-grid { grid-template-columns:repeat(2,minmax(0,1fr)) !important; }
    }
    @media (max-width: 639px) {
      header > div { height:62px !important; padding-left:14px !important; padding-right:14px !important; }
      #top { padding-top:14px !important; }
      #top h1 { font-size:45px !important; }
      .unikmo-reference-occasion-grid { grid-template-columns:1fr 1fr !important; gap:10px !important; }
      .unikmo-reference-occasion-photo { height:96px; }
      .unikmo-reference-occasion-copy { padding:12px 10px 13px; }
      .unikmo-reference-occasion-copy h3 { font-size:19px; }
      .unikmo-reference-quote-row { grid-template-columns:26px 1fr 26px; gap:8px; }
      .unikmo-reference-quote-copy blockquote { font-size:22px; }
    }
  `;
  document.head.appendChild(style);
}

function applyReferenceDesign() {
  installStyles();
  configureHero();
  configureOccasions();
  configureProductSides();
  configureShopVisibility();
  configureTrustStrip();
  configureSocialProof();
  configureQuestions();
  configureFinalCta();
}

export default function HomepageEnhancements() {
  useEffect(() => {
    if (window.location.pathname !== '/') return;
    applyReferenceDesign();

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      applyReferenceDesign();
      if (attempts >= 16) window.clearInterval(timer);
    }, 400);

    return () => window.clearInterval(timer);
  }, []);

  return null;
}
