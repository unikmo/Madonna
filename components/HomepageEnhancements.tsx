'use client';

import { useEffect } from 'react';

const HERO_IMAGE = '/images/unikmo-lifestyle.jpg';
const CARD_FRONT = '/cardfrontsite_staged1.png';
const CARD_BACK = '/cardfrontunikmo.jpg';

const OCCASIONS = [
  {
    title: 'Birthday',
    line: 'Say what a birthday card never quite could.',
    image: '/nr1.jpg',
  },
  {
    title: 'Anniversary',
    line: 'Give your shared story somewhere to live.',
    image: '/testimonials/customer-london.jpg',
  },
  {
    title: 'Long-distance love',
    line: 'Keep something personal close across the miles.',
    image: '/story1.png',
  },
  {
    title: 'Just because',
    line: 'Make an ordinary day feel remembered.',
    image: '/testimonials/customer-newyork.jpg',
  },
];

function findSection(text: string) {
  return Array.from(document.querySelectorAll<HTMLElement>('main section')).find((section) =>
    section.textContent?.includes(text)
  );
}

function installStyles() {
  document.getElementById('unikmo-homepage-polish')?.remove();
  const style = document.createElement('style');
  style.id = 'unikmo-homepage-polish';
  style.textContent = `
    body { background: #FCF9F4 !important; }

    header > div,
    main > section > div,
    footer > div {
      margin-left: auto !important;
      margin-right: auto !important;
    }

    #top { padding-top: 24px !important; padding-bottom: 32px !important; }
    #top > div > div { align-items: center !important; }

    .unikmo-hero-static {
      position: relative !important;
      min-height: 0 !important;
      aspect-ratio: 16 / 10 !important;
      overflow: hidden !important;
      border-radius: 22px !important;
      background: #E9E0D5 !important;
      box-shadow: 0 18px 55px rgba(44,48,49,.10) !important;
    }
    .unikmo-hero-static img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }

    #gift-ideas > div { text-align: center; }
    .unikmo-occasion-grid {
      display: grid !important;
      grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
      gap: 16px !important;
      margin-top: 28px !important;
      width: 100%;
    }
    .unikmo-occasion-card {
      overflow: hidden;
      border: 1px solid rgba(34,50,58,.08);
      border-radius: 15px;
      background: rgba(255,255,255,.72);
      box-shadow: 0 8px 24px rgba(34,50,58,.04);
      text-align: center;
    }
    .unikmo-occasion-photo {
      height: 150px;
      overflow: hidden;
      background: #EEE5DA;
    }
    .unikmo-occasion-photo img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
    .unikmo-occasion-copy { padding: 15px 14px 17px; }
    .unikmo-occasion-copy h3 {
      margin: 0;
      font-family: var(--font-serif), Georgia, serif;
      font-size: 23px;
      line-height: 1.05;
      color: #22323A;
    }
    .unikmo-occasion-copy p {
      margin: 7px auto 0;
      max-width: 220px;
      font-size: 11px;
      line-height: 1.45;
      color: rgba(34,50,58,.64);
    }

    .unikmo-card-plate {
      height: 260px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border: 1px solid rgba(34,50,58,.08);
      border-radius: 18px;
      background: #F4ECE2;
      padding: 30px;
    }
    .unikmo-card-plate img {
      display: block;
      width: auto;
      height: auto;
      max-width: 72%;
      max-height: 72%;
      object-fit: contain;
      margin: auto;
      filter: drop-shadow(0 14px 16px rgba(34,50,58,.10));
    }
    #about figure figcaption {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-top: 12px;
      text-align: center;
    }
    #about figure figcaption span:first-child {
      font-size: 14px;
      font-weight: 600;
      color: #22323A;
    }
    #about figure figcaption span:last-child {
      font-size: 10px;
      letter-spacing: .1em;
      text-transform: uppercase;
      color: rgba(34,50,58,.55);
    }

    .unikmo-final-image img {
      object-fit: contain !important;
      object-position: center !important;
      padding: 24px !important;
      background: #EDE3D7 !important;
    }

    .unikmo-footer-centered .max-w-7xl > div:first-child {
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 12px !important;
      text-align: center !important;
    }
    .unikmo-footer-centered .max-w-7xl > div:first-child > div,
    .unikmo-footer-centered .max-w-7xl > div:last-child {
      justify-content: center !important;
      text-align: center !important;
    }

    @media (max-width: 1024px) {
      .unikmo-occasion-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
      .unikmo-card-plate { height: 230px; }
    }

    @media (max-width: 700px) {
      .unikmo-hero-static { aspect-ratio: 4 / 3 !important; }
      .unikmo-occasion-grid { grid-template-columns: 1fr !important; }
      .unikmo-occasion-photo { height: 190px; }
      .unikmo-card-plate { height: 210px; }
    }
  `;
  document.head.appendChild(style);
}

function configureHero() {
  const section = document.querySelector<HTMLElement>('#top');
  const video = section?.querySelector<HTMLVideoElement>('video');
  const frame = video?.parentElement as HTMLElement | null;
  if (!section || !video || !frame) return;

  video.pause();
  video.removeAttribute('src');
  frame.className = 'unikmo-hero-static';
  frame.innerHTML = `<img src="${HERO_IMAGE}" alt="A recipient revisiting a private UNIKMO moment on her phone" />`;
}

function configureOccasions() {
  const section = document.querySelector<HTMLElement>('#gift-ideas');
  if (!section) return;

  const heading = section.querySelector('h2');
  if (heading) heading.textContent = 'For the moments you do not want to reduce to a text.';

  const articles = Array.from(section.querySelectorAll<HTMLElement>('article')).slice(0, 4);
  const grid = articles[0]?.parentElement;
  if (!grid) return;

  grid.className = 'unikmo-occasion-grid';
  grid.innerHTML = OCCASIONS.map(
    (item) => `
      <article class="unikmo-occasion-card">
        <div class="unikmo-occasion-photo">
          <img src="${item.image}" alt="${item.title} UNIKMO gift idea" loading="lazy" />
        </div>
        <div class="unikmo-occasion-copy">
          <h3>${item.title}</h3>
          <p>${item.line}</p>
        </div>
      </article>`
  ).join('');

  grid.querySelectorAll<HTMLImageElement>('img').forEach((img) => {
    img.addEventListener('error', () => {
      img.src = HERO_IMAGE;
    }, { once: true });
  });

  Array.from(section.querySelectorAll('p')).forEach((p) => {
    if (p.textContent?.includes('We use real customer and product photography only')) p.remove();
  });
}

function configureProductSides() {
  const section = document.querySelector<HTMLElement>('#about');
  if (!section) return;

  const figures = Array.from(section.querySelectorAll<HTMLElement>('figure')).slice(0, 2);
  if (figures.length < 2) return;

  figures[0].innerHTML = `
    <div class="unikmo-card-plate">
      <img src="${CARD_FRONT}" alt="Front of the UNIKMO card with gold key" />
    </div>
    <figcaption><span>Front</span><span>The keepsake</span></figcaption>`;

  figures[1].innerHTML = `
    <div class="unikmo-card-plate">
      <img src="${CARD_BACK}" alt="Back of the UNIKMO card with QR code and private access code" />
    </div>
    <figcaption><span>Back</span><span>QR + private access code</span></figcaption>`;
}

function configureFinalCta() {
  const section = findSection('Create a moment');
  if (!section) return;
  const image = section.querySelector<HTMLImageElement>('img');
  const frame = image?.parentElement as HTMLElement | null;
  if (!image) return;

  image.removeAttribute('srcset');
  image.removeAttribute('sizes');
  image.src = CARD_FRONT;
  image.alt = 'UNIKMO card ready to give';
  frame?.classList.add('unikmo-final-image');
}

function configureFooter() {
  document.querySelector('footer')?.classList.add('unikmo-footer-centered');
}

export default function HomepageEnhancements() {
  useEffect(() => {
    if (window.location.pathname !== '/') return;

    const timer = window.setTimeout(() => {
      installStyles();
      configureHero();
      configureOccasions();
      configureProductSides();
      configureFinalCta();
      configureFooter();
    }, 100);

    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
