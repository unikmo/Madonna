'use client';

import { useEffect } from 'react';

const HERO_VIDEO_URL = '/video/unikmo-hero.mp4';
const LIFESTYLE_IMAGE_URL = '/images/unikmo-lifestyle.jpg';

function configureHeroVideo() {
  const video = document.querySelector<HTMLVideoElement>('#top video');
  if (!video || video.dataset.unikmoEnhanced === 'true') return;

  video.dataset.unikmoEnhanced = 'true';
  video.muted = true;
  video.autoplay = true;
  video.playsInline = true;
  video.preload = 'metadata';
  video.removeAttribute('loop');
  video.src = HERO_VIDEO_URL;
  video.load();
  void video.play().catch(() => undefined);

  const frame = video.parentElement as HTMLElement | null;
  if (frame) {
    frame.style.minHeight = '0';
    frame.style.aspectRatio = '16 / 10';
    frame.style.background = '#111816';
  }
  video.style.objectFit = 'contain';
  video.style.objectPosition = 'center';

  const overlay = frame
    ? Array.from(frame.querySelectorAll<HTMLElement>('div')).find((el) =>
        el.textContent?.trim().includes('The moment, made tangible.')
      )
    : null;
  if (overlay) overlay.style.display = 'none';
}

function configureOccasions() {
  const section = document.querySelector<HTMLElement>('#gift-ideas');
  if (!section || section.dataset.unikmoEnhanced === 'true') return;

  const articles = Array.from(section.querySelectorAll<HTMLElement>('article'));
  if (articles.length < 4) return;

  section.dataset.unikmoEnhanced = 'true';

  const heading = section.querySelector('h2');
  if (heading) heading.textContent = 'For the moments you do not want to reduce to a text.';

  const grid = articles[0]?.parentElement;
  if (!grid) return;

  const moments = articles.slice(0, 4).map((article) => ({
    title: article.querySelector('h3')?.textContent?.trim() || '',
    line: article.querySelector('p:last-child')?.textContent?.trim() || '',
  }));

  grid.className = 'unikmo-occasion-editorial mt-10';
  grid.innerHTML = `
    <div class="unikmo-occasion-image">
      <img
        src="${LIFESTYLE_IMAGE_URL}"
        alt="A personal UNIKMO moment being revisited on a phone"
        loading="lazy"
      />
      <div class="unikmo-occasion-image-shade"></div>
      <div class="unikmo-occasion-image-copy">
        <p>A message worth returning to.</p>
      </div>
    </div>
    <div class="unikmo-occasion-list">
      ${moments
        .map(
          (item, index) => `
            <article class="unikmo-occasion-item">
              <span class="unikmo-occasion-number">0${index + 1}</span>
              <div>
                <h3>${item.title}</h3>
                <p>${item.line}</p>
              </div>
            </article>
          `
        )
        .join('')}
    </div>
  `;

  Array.from(section.querySelectorAll('p')).forEach((p) => {
    if (p.textContent?.includes('We use real customer and product photography only')) {
      p.remove();
    }
  });
}

function findKeyCardSource() {
  const shop = document.querySelector<HTMLElement>('#shop');
  const shopImages = shop ? Array.from(shop.querySelectorAll<HTMLImageElement>('img')) : [];
  const keyCard =
    shopImages.find((img) => {
      const alt = (img.alt || '').toLowerCase();
      return alt.includes('single') || alt.includes('memory card') || alt.includes('unikmo');
    }) || shopImages[0];

  return keyCard ? keyCard.currentSrc || keyCard.src : '';
}

function configureProductSides() {
  const section = document.querySelector<HTMLElement>('#about');
  if (!section) return;

  const intro = Array.from(section.querySelectorAll('p')).find((p) =>
    p.textContent?.includes('The front is the keepsake')
  );
  if (intro) {
    intro.textContent =
      'The front carries the gold UNIKMO key. The back carries the QR code and private access code that unlock the memory you created.';
  }

  const detailParagraphs = Array.from(section.querySelectorAll('p'));
  const frontDetail = detailParagraphs.find((p) => p.textContent?.trim().startsWith('Front:'));
  const backDetail = detailParagraphs.find((p) => p.textContent?.trim().startsWith('Back:'));
  if (frontDetail) {
    frontDetail.innerHTML = '<span class="font-medium text-[#22323A]">Front:</span> the gold-key UNIKMO keepsake.';
  }
  if (backDetail) {
    backDetail.innerHTML = '<span class="font-medium text-[#22323A]">Back:</span> QR code plus private access code.';
  }

  const figures = Array.from(section.querySelectorAll<HTMLElement>('figure'));
  if (figures.length < 2) return;

  const frontFigure = figures[0];
  const backFigure = figures[1];

  const frontLabels = frontFigure.querySelectorAll('figcaption span');
  if (frontLabels[0]) frontLabels[0].textContent = 'Front';
  if (frontLabels[1]) frontLabels[1].textContent = 'The gold-key keepsake';

  const backLabels = backFigure.querySelectorAll('figcaption span');
  if (backLabels[0]) backLabels[0].textContent = 'Back';
  if (backLabels[1]) backLabels[1].textContent = 'QR + private access code';

  if (backFigure.dataset.unikmoBackEnhanced !== 'true') {
    const visual = backFigure.firstElementChild as HTMLElement | null;
    if (visual) {
      visual.innerHTML = `
        <img
          src="/cardfrontunikmo.jpg"
          alt="Back of the UNIKMO card with QR code and private access code"
          class="h-full w-full object-contain p-4 sm:p-6"
        />
      `;
    }
    backFigure.dataset.unikmoBackEnhanced = 'true';
  }

  const keyCardSource = findKeyCardSource();
  if (keyCardSource) {
    const frontImage = frontFigure.querySelector<HTMLImageElement>('img');
    if (frontImage) {
      frontImage.removeAttribute('srcset');
      frontImage.removeAttribute('sizes');
      frontImage.src = keyCardSource;
      frontImage.alt = 'Front of the UNIKMO card with the gold key';
      frontImage.style.objectFit = 'contain';
    }
    frontFigure.dataset.unikmoFrontEnhanced = 'true';
  }
}

function configureFinalCta() {
  const keyCardSource = findKeyCardSource();
  if (!keyCardSource) return;

  const sections = Array.from(document.querySelectorAll<HTMLElement>('main section'));
  const finalCta = sections.find((section) => section.textContent?.includes('You already know who it’s for.'));
  if (!finalCta || finalCta.dataset.unikmoEnhanced === 'true') return;

  const image = finalCta.querySelector<HTMLImageElement>('img');
  if (!image) return;

  image.removeAttribute('srcset');
  image.removeAttribute('sizes');
  image.src = keyCardSource;
  image.alt = 'Front of the UNIKMO card with the gold key';
  image.style.objectFit = 'contain';
  image.style.padding = '1.25rem';
  finalCta.dataset.unikmoEnhanced = 'true';
}

function configureSocialProof() {
  const section = document.querySelector<HTMLElement>('#stories');
  if (!section || section.dataset.unikmoEnhanced === 'true') return;

  const grid = section.querySelector<HTMLElement>('.grid');
  if (!grid) return;

  const eyebrow = Array.from(section.querySelectorAll('p')).find((p) =>
    p.textContent?.trim().toLowerCase().includes('their words')
  );
  if (eyebrow) eyebrow.textContent = 'In their words';

  section.dataset.unikmoEnhanced = 'true';
  grid.classList.add('unikmo-proof-grid');

  const proof = [
    {
      eyebrow: 'Why it feels different',
      title: 'A message with a physical place',
      body: 'The card gives a private video, voice note, photo or written message something tangible to belong to — rather than leaving it buried in a chat history.',
    },
    {
      eyebrow: 'Why it is easy to receive',
      title: 'Private, without another account',
      body: 'The recipient scans the QR code, enters the private access code and opens the moment in the browser. No recipient app or login is required.',
    },
  ];

  proof.forEach((item) => {
    const card = document.createElement('article');
    card.setAttribute('data-unikmo-proof-card', 'true');
    card.className =
      'rounded-[20px] border border-[#22323A]/[0.08] bg-white/65 p-7 sm:p-9 flex min-h-[250px] flex-col justify-center';
    card.innerHTML = `
      <p class="text-[10px] uppercase tracking-[0.22em] text-[#B38846] font-semibold">${item.eyebrow}</p>
      <h3 class="mt-4 font-serif text-[25px] sm:text-[28px] leading-[1.2] text-[#22323A]">${item.title}</h3>
      <p class="mt-4 text-[13px] sm:text-[14px] leading-relaxed text-[#22323A]/65">${item.body}</p>
    `;
    grid.appendChild(card);
  });
}

function installStyles() {
  if (document.getElementById('unikmo-homepage-enhancement-styles')) return;
  const style = document.createElement('style');
  style.id = 'unikmo-homepage-enhancement-styles';
  style.textContent = `
    .unikmo-proof-grid { grid-template-columns:1fr !important; }

    .unikmo-occasion-editorial {
      display: grid !important;
      grid-template-columns: 1fr !important;
      gap: 18px !important;
      align-items: stretch;
    }
    .unikmo-occasion-image {
      position: relative;
      min-height: 300px;
      overflow: hidden;
      border-radius: 20px;
      background: #e9e0d5;
    }
    .unikmo-occasion-image img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
    .unikmo-occasion-image-shade {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(21,32,37,.52), transparent 52%);
    }
    .unikmo-occasion-image-copy {
      position: absolute;
      left: 24px;
      right: 24px;
      bottom: 22px;
      color: white;
    }
    .unikmo-occasion-image-copy p {
      margin: 0;
      font-family: var(--font-cormorant), Georgia, serif;
      font-size: 28px;
      line-height: 1.1;
    }
    .unikmo-occasion-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .unikmo-occasion-item {
      display: flex;
      gap: 14px;
      min-height: 128px;
      padding: 20px;
      border: 1px solid rgba(34,50,58,.08);
      border-radius: 16px;
      background: rgba(247,240,233,.72);
    }
    .unikmo-occasion-number {
      flex: 0 0 auto;
      color: #B38846;
      font-size: 10px;
      letter-spacing: .16em;
      padding-top: 4px;
    }
    .unikmo-occasion-item h3 {
      margin: 0;
      color: #22323A;
      font-family: var(--font-cormorant), Georgia, serif;
      font-size: 25px;
      line-height: 1.05;
    }
    .unikmo-occasion-item p {
      margin: 8px 0 0;
      color: rgba(34,50,58,.62);
      font-size: 13px;
      line-height: 1.45;
    }

    @media (min-width: 768px) {
      .unikmo-proof-grid { grid-template-columns:repeat(2,minmax(0,1fr)) !important; }
      .unikmo-occasion-editorial { grid-template-columns: 1.05fr .95fr !important; gap: 22px !important; }
      .unikmo-occasion-image { min-height: 390px; }
    }

    @media (max-width: 639px) {
      .unikmo-occasion-list { grid-template-columns: 1fr; }
      .unikmo-occasion-image { min-height: 260px; }
      .unikmo-occasion-item { min-height: 0; }
    }
  `;
  document.head.appendChild(style);
}

export default function HomepageEnhancements() {
  useEffect(() => {
    if (window.location.pathname !== '/') return;

    installStyles();
    configureHeroVideo();
    configureOccasions();
    configureProductSides();
    configureFinalCta();
    configureSocialProof();

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      configureHeroVideo();
      configureOccasions();
      configureProductSides();
      configureFinalCta();
      configureSocialProof();
      if (attempts >= 20 || document.querySelector('#about figure[data-unikmo-front-enhanced="true"]')) {
        window.clearInterval(timer);
      }
    }, 500);

    return () => window.clearInterval(timer);
  }, []);

  return null;
}
