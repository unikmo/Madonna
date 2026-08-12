'use client';

import { useEffect } from 'react';

const HERO_VIDEO_URL =
  'https://videos.pexels.com/video-files/6682443/6682443-uhd_3840_2160_25fps.mp4';

const OCCASION_IMAGES = [
  'https://images.pexels.com/videos/6682443/free-video-6682443.jpg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/videos/6657830/free-video-6657830.jpg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/videos/6620535/free-video-6620535.jpg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/videos/4686302/free-video-4686302.jpg?auto=compress&cs=tinysrgb&w=1600',
];

function configureHeroVideo() {
  const video = document.querySelector<HTMLVideoElement>('#top video');
  if (!video || video.dataset.unikmoEnhanced === 'true') return;

  video.dataset.unikmoEnhanced = 'true';
  video.muted = true;
  video.autoplay = true;
  video.playsInline = true;
  video.preload = 'metadata';
  video.removeAttribute('loop');

  const fallback = () => {
    if (!video.src.endsWith('/video/unikmo-hero.mp4')) {
      video.src = '/video/unikmo-hero.mp4';
      video.load();
      void video.play().catch(() => undefined);
    }
  };

  video.addEventListener('error', fallback, { once: true });
  video.src = HERO_VIDEO_URL;
  video.load();
  void video.play().catch(() => undefined);
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
  if (grid) grid.classList.add('unikmo-occasion-grid');

  articles.slice(0, 4).forEach((article, index) => {
    const title = article.querySelector('h3')?.textContent?.trim() || '';
    const line = article.querySelector('p:last-child')?.textContent?.trim() || '';

    article.className =
      'group overflow-hidden rounded-[20px] border border-[#22323A]/[0.08] bg-[#EEE5DA] shadow-[0_14px_36px_rgba(34,50,58,0.06)]';
    article.innerHTML = `
      <div class="relative aspect-[16/10] overflow-hidden">
        <img
          src="${OCCASION_IMAGES[index]}"
          alt="${title} gifting moment"
          loading="lazy"
          class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-[#13232B]/70 via-[#13232B]/10 to-transparent"></div>
        <div class="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-white">
          <h3 class="font-serif text-[28px] sm:text-[32px]">${title}</h3>
          <p class="mt-2 max-w-md text-[13px] sm:text-[14px] leading-relaxed text-white/85 font-light">${line}</p>
        </div>
      </div>
    `;
  });

  Array.from(section.querySelectorAll('p')).forEach((p) => {
    if (p.textContent?.includes('We use real customer and product photography only')) {
      p.remove();
    }
  });
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

  const shop = document.querySelector<HTMLElement>('#shop');
  const shopImages = shop ? Array.from(shop.querySelectorAll<HTMLImageElement>('img')) : [];
  const keyCard = shopImages.find((img) => {
    const alt = (img.alt || '').toLowerCase();
    return alt.includes('single') || alt.includes('memory card') || alt.includes('unikmo');
  }) || shopImages[0];

  if (keyCard) {
    const frontImage = frontFigure.querySelector<HTMLImageElement>('img');
    if (frontImage) {
      const resolved = keyCard.currentSrc || keyCard.src;
      if (resolved) {
        frontImage.removeAttribute('srcset');
        frontImage.removeAttribute('sizes');
        frontImage.src = resolved;
        frontImage.alt = 'Front of the UNIKMO card with the gold key';
        frontImage.style.objectFit = 'contain';
      }
    }
    frontFigure.dataset.unikmoFrontEnhanced = 'true';
  }
}

function configureSocialProof() {
  const section = document.querySelector<HTMLElement>('#stories');
  if (!section || section.dataset.unikmoEnhanced === 'true') return;

  const grid = section.querySelector<HTMLElement>('.grid');
  if (!grid) return;

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
    .unikmo-occasion-grid { display:grid !important; grid-template-columns:1fr !important; gap:20px !important; }
    .unikmo-proof-grid { grid-template-columns:1fr !important; }
    @media (min-width: 640px) {
      .unikmo-occasion-grid { grid-template-columns:repeat(2,minmax(0,1fr)) !important; gap:24px !important; }
    }
    @media (min-width: 768px) {
      .unikmo-proof-grid { grid-template-columns:repeat(2,minmax(0,1fr)) !important; }
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
    configureSocialProof();

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      configureHeroVideo();
      configureOccasions();
      configureProductSides();
      configureSocialProof();
      if (attempts >= 20 || document.querySelector('#about figure[data-unikmo-front-enhanced="true"]')) {
        window.clearInterval(timer);
      }
    }, 500);

    return () => window.clearInterval(timer);
  }, []);

  return null;
}
