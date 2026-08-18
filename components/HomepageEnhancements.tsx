'use client';

import { useEffect } from 'react';

const STORY_SPRITE = '/images/story-sprite-web.jpg';
const OCCASION_SPRITE = '/images/occasion-sprite-web.jpg';
const CARD_FRONT = '/cardfrontsite_staged.jpg';
const CARD_BACK = '/cardfrontunikmo.jpg';

const STORY_STEPS = [
  'Matt wanted to say more.',
  'He made it something she could hold.',
  'She opens it.',
  'She scans it.',
  'She can return to his words.',
];

const OCCASIONS = [
  { title: 'Birthday', line: 'Make their day unforgettable.' },
  { title: 'Anniversary', line: 'Celebrate your love story.' },
  { title: 'Long-distance love', line: 'Bridge the miles with meaning.' },
  { title: 'Just because', line: 'Because they mean the world.' },
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

function installStyles() {
  document.getElementById('unikmo-homepage-fix')?.remove();
  const style = document.createElement('style');
  style.id = 'unikmo-homepage-fix';
  style.textContent = `
    body { background:#FCF9F4 !important; }
    header > div, main > section > div, footer > div { max-width:1180px !important; }

    #top { padding-top:24px !important; padding-bottom:28px !important; }
    #top > div > div { gap:36px !important; }
    #top h1 { font-size:clamp(44px,5vw,68px) !important; line-height:.98 !important; }

    .unikmo-story-frame { min-height:0 !important; overflow:visible !important; border-radius:0 !important; box-shadow:none !important; background:transparent !important; }
    .unikmo-story-shell { display:flex; flex-direction:column; gap:10px; }
    .unikmo-story-main { position:relative; aspect-ratio:16/9; overflow:hidden; border-radius:18px; border:1px solid rgba(34,50,58,.08); background:#F0E7DB; box-shadow:0 14px 34px rgba(34,50,58,.08); }
    .unikmo-story-slide { position:absolute; inset:0; opacity:0; transition:opacity .45s ease; }
    .unikmo-story-slide.is-active { opacity:1; }
    .unikmo-story-image { width:100%; height:100%; background-image:url('${STORY_SPRITE}'); background-repeat:no-repeat; background-size:500% 100%; }

    .unikmo-story-tabs { display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:7px; }
    .unikmo-story-tab { border:1px solid rgba(34,50,58,.09); background:rgba(255,255,255,.86); border-radius:12px; padding:9px; text-align:left; min-height:74px; cursor:pointer; transition:.2s ease; }
    .unikmo-story-tab.is-active { border-color:rgba(179,136,70,.58); box-shadow:0 7px 18px rgba(34,50,58,.07); transform:translateY(-1px); }
    .unikmo-story-tab-top { display:flex; align-items:center; gap:7px; margin-bottom:6px; }
    .unikmo-story-number { display:grid; place-items:center; width:22px; height:22px; flex:none; border-radius:999px; background:#B38846; color:white; font-size:10px; font-weight:600; }
    .unikmo-story-label { color:#22323A; font-size:10px; line-height:1.32; }

    #gift-ideas { padding-top:34px !important; padding-bottom:42px !important; }
    #gift-ideas h2 { max-width:760px; margin-left:auto; margin-right:auto; }
    .unikmo-occasion-grid { display:grid !important; grid-template-columns:repeat(4,minmax(0,1fr)) !important; gap:16px !important; margin-top:28px !important; }
    .unikmo-occasion-card { overflow:hidden; border:1px solid rgba(34,50,58,.08); border-radius:14px; background:rgba(255,255,255,.84); }
    .unikmo-occasion-photo { height:126px; background-image:url('${OCCASION_SPRITE}'); background-repeat:no-repeat; background-size:400% 100%; background-color:#EEE5D9; }
    .unikmo-occasion-copy { padding:13px 14px 15px; text-align:center; }
    .unikmo-occasion-copy h3 { margin:0; font-family:var(--font-serif),Georgia,serif; font-size:21px; line-height:1.06; color:#22323A; }
    .unikmo-occasion-copy p { margin:6px 0 0; font-size:11px; line-height:1.4; color:rgba(34,50,58,.64); }

    #about { padding-top:38px !important; padding-bottom:38px !important; }
    .unikmo-card-plate { height:250px; border-radius:18px; border:1px solid rgba(34,50,58,.08); background:#F6EEE4; display:flex; align-items:center; justify-content:center; padding:28px; overflow:hidden; }
    .unikmo-card-plate img { display:block; width:auto; height:auto; max-width:76%; max-height:76%; object-fit:contain; margin:auto; }
    #about figure figcaption { display:flex; flex-direction:column; gap:4px; margin-top:11px; text-align:center; }
    #about figure figcaption span:first-child { color:#22323A; font-size:14px; font-weight:600; }
    #about figure figcaption span:last-child { color:rgba(34,50,58,.58); font-size:10px; letter-spacing:.08em; text-transform:uppercase; }

    .unikmo-compact-proof { padding:22px 0 8px !important; border-top:1px solid rgba(34,50,58,.06); }
    .unikmo-proof-inner { max-width:920px; margin:0 auto; padding:0 20px; }
    .unikmo-proof-eyebrow { margin:0 0 9px; text-align:center; font-size:10px; font-weight:600; letter-spacing:.24em; color:#B38846; }
    .unikmo-proof-row { display:grid; grid-template-columns:40px 1fr 40px; gap:10px; align-items:center; }
    .unikmo-proof-row button { border:0; background:transparent; color:#B38846; font-size:34px; cursor:pointer; }
    .unikmo-proof-copy { text-align:center; }
    .unikmo-proof-mark { color:#D0AD68; font-family:Georgia,serif; font-size:44px; line-height:.8; }
    .unikmo-proof-copy blockquote { max-width:760px; margin:2px auto 8px; font-family:var(--font-serif),Georgia,serif; font-size:18px; line-height:1.4; color:#22323A; }
    .unikmo-proof-copy p { margin:0; color:rgba(34,50,58,.58); font-size:11px; }
    .unikmo-proof-dots { display:flex; justify-content:center; gap:7px; margin-top:10px; }
    .unikmo-proof-dots span { width:7px; height:7px; border-radius:999px; background:#D9D1C7; }
    .unikmo-proof-dots span.is-active { background:#B38846; }

    .unikmo-final-cta img { object-fit:contain !important; padding:24px !important; background:#EDE3D7 !important; }

    .unikmo-footer-centered .max-w-7xl > div:first-child { flex-direction:column !important; justify-content:center !important; align-items:center !important; text-align:center !important; gap:12px !important; }
    .unikmo-footer-centered .max-w-7xl > div:first-child > div { justify-content:center !important; text-align:center !important; }
    .unikmo-footer-centered .max-w-7xl > div:last-child { justify-content:center !important; text-align:center !important; }

    @media (max-width:1024px) {
      .unikmo-story-tabs { grid-template-columns:repeat(5,minmax(110px,1fr)); overflow-x:auto; padding-bottom:4px; }
      .unikmo-occasion-grid { grid-template-columns:repeat(2,minmax(0,1fr)) !important; }
    }
    @media (max-width:700px) {
      .unikmo-story-main { aspect-ratio:16/10; }
      .unikmo-story-tab { min-height:70px; }
      .unikmo-occasion-grid { grid-template-columns:1fr !important; }
      .unikmo-card-plate { height:210px; }
      .unikmo-proof-row { grid-template-columns:30px 1fr 30px; }
      .unikmo-proof-copy blockquote { font-size:16px; }
    }
  `;
  document.head.appendChild(style);
}

function configureHero(cleanups: Array<() => void>) {
  const section = document.querySelector<HTMLElement>('#top');
  const video = section?.querySelector<HTMLVideoElement>('video');
  const frame = video?.parentElement as HTMLElement | null;
  if (!section || !frame) return;

  video.pause();
  video.removeAttribute('src');
  video.load();

  frame.className = 'unikmo-story-frame';
  frame.innerHTML = `
    <div class="unikmo-story-shell">
      <div class="unikmo-story-main" aria-label="Matt's UNIKMO story">
        ${STORY_STEPS.map((_, index) => `
          <div class="unikmo-story-slide ${index === 0 ? 'is-active' : ''}" data-story-slide="${index}">
            <div class="unikmo-story-image" style="background-position:${index * 25}% 50%"></div>
          </div>`).join('')}
      </div>
      <div class="unikmo-story-tabs" role="tablist" aria-label="Matt story steps">
        ${STORY_STEPS.map((label, index) => `
          <button type="button" class="unikmo-story-tab ${index === 0 ? 'is-active' : ''}" data-story-tab="${index}" role="tab" aria-selected="${index === 0}">
            <span class="unikmo-story-tab-top"><span class="unikmo-story-number">${index + 1}</span></span>
            <span class="unikmo-story-label">${label}</span>
          </button>`).join('')}
      </div>
    </div>`;

  const slides = Array.from(frame.querySelectorAll<HTMLElement>('[data-story-slide]'));
  const tabs = Array.from(frame.querySelectorAll<HTMLElement>('[data-story-tab]'));
  let active = 0;
  let timer = 0;
  const activate = (index: number) => {
    active = index;
    slides.forEach((el, i) => el.classList.toggle('is-active', i === active));
    tabs.forEach((el, i) => {
      el.classList.toggle('is-active', i === active);
      el.setAttribute('aria-selected', i === active ? 'true' : 'false');
    });
  };
  const start = () => {
    window.clearInterval(timer);
    timer = window.setInterval(() => activate((active + 1) % STORY_STEPS.length), 3400);
  };
  tabs.forEach((tab, index) => {
    const click = () => { activate(index); start(); };
    tab.addEventListener('click', click);
    cleanups.push(() => tab.removeEventListener('click', click));
  });
  start();
  cleanups.push(() => window.clearInterval(timer));
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
  grid.innerHTML = OCCASIONS.map((item, index) => `
    <article class="unikmo-occasion-card">
      <div class="unikmo-occasion-photo" style="background-position:${index * 33.3333}% 50%"></div>
      <div class="unikmo-occasion-copy"><h3>${item.title}</h3><p>${item.line}</p></div>
    </article>`).join('');
  Array.from(section.querySelectorAll('p')).forEach((p) => {
    if (p.textContent?.includes('We use real customer and product photography only')) p.remove();
  });
}

function configureProductSides() {
  const section = document.querySelector<HTMLElement>('#about');
  if (!section) return;
  const heading = section.querySelector('h2');
  if (heading) heading.innerHTML = 'More than a card.<br/>A moment they can keep.';
  const figures = Array.from(section.querySelectorAll<HTMLElement>('figure')).slice(0, 2);
  if (figures.length < 2) return;
  figures[0].innerHTML = `<div class="unikmo-card-plate"><img src="${CARD_FRONT}" alt="Front of the UNIKMO card" /></div><figcaption><span>Front</span><span>The keepsake</span></figcaption>`;
  figures[1].innerHTML = `<div class="unikmo-card-plate"><img src="${CARD_BACK}" alt="Back of the UNIKMO card with QR code" /></div><figcaption><span>Back</span><span>QR + private access code</span></figcaption>`;
}

function configureSocialProof(cleanups: Array<() => void>) {
  const section = document.querySelector<HTMLElement>('#stories');
  if (!section) return;
  section.className = 'unikmo-compact-proof';
  section.innerHTML = `
    <div class="unikmo-proof-inner">
      <p class="unikmo-proof-eyebrow">IN THEIR WORDS</p>
      <div class="unikmo-proof-row">
        <button type="button" data-proof-prev aria-label="Previous testimonial">‹</button>
        <div class="unikmo-proof-copy"><div class="unikmo-proof-mark">“</div><blockquote data-proof-quote></blockquote><p data-proof-name></p><div class="unikmo-proof-dots"></div></div>
        <button type="button" data-proof-next aria-label="Next testimonial">›</button>
      </div>
    </div>`;
  let active = 0;
  const quote = section.querySelector<HTMLElement>('[data-proof-quote]');
  const name = section.querySelector<HTMLElement>('[data-proof-name]');
  const dots = section.querySelector<HTMLElement>('.unikmo-proof-dots');
  const render = () => {
    if (quote) quote.textContent = TESTIMONIALS[active].quote;
    if (name) name.textContent = TESTIMONIALS[active].name;
    if (dots) dots.innerHTML = TESTIMONIALS.map((_, i) => `<span class="${i === active ? 'is-active' : ''}"></span>`).join('');
  };
  const prev = () => { active = (active - 1 + TESTIMONIALS.length) % TESTIMONIALS.length; render(); };
  const next = () => { active = (active + 1) % TESTIMONIALS.length; render(); };
  const prevBtn = section.querySelector('[data-proof-prev]');
  const nextBtn = section.querySelector('[data-proof-next]');
  prevBtn?.addEventListener('click', prev);
  nextBtn?.addEventListener('click', next);
  cleanups.push(() => { prevBtn?.removeEventListener('click', prev); nextBtn?.removeEventListener('click', next); });
  render();
}

function configureFooter() {
  document.querySelector('footer')?.classList.add('unikmo-footer-centered');
}

function configureFinalCta() {
  const section = findSection('Create a moment');
  if (!section) return;
  section.classList.add('unikmo-final-cta');
  const image = section.querySelector<HTMLImageElement>('img');
  if (image) { image.removeAttribute('srcset'); image.src = CARD_FRONT; image.alt = 'UNIKMO card ready to give'; }
}

export default function HomepageEnhancements() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const timer = window.setTimeout(() => {
      installStyles();
      configureHero(cleanups);
      configureOccasions();
      configureProductSides();
      configureSocialProof(cleanups);
      configureFinalCta();
      configureFooter();
    }, 100);
    return () => { window.clearTimeout(timer); cleanups.forEach((fn) => fn()); };
  }, []);
  return null;
}
