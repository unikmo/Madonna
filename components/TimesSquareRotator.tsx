'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

/**
 * Rotating Times Square hero.
 *
 * Drop any number of Times Square billboard photos into /public/curated/
 * named ts-1, ts-2, ts-3 … (webp / png / jpg). This component probes for
 * them at runtime and only ever shows images that actually load, so the
 * page never renders a broken box. With 2+ images it cross-fades between
 * them; with 0 it shows the fallback still.
 */

const BASES = [
  'ts-love',
  'ts-newlywed',
  'ts-proposal',
  'ts-ny',
  'ts-5',
  'ts-6',
  'ts-7',
  'ts-8',
];
const EXTS = ['webp', 'png', 'jpg'];
const FALLBACK = '/curated/ts-love.webp';
const INTERVAL_MS = 4500;

function probe(src: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve(src);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export default function TimesSquareRotator({
  className = '',
  alt = 'A curated UNIKMO memory on a Times Square billboard',
}: {
  className?: string;
  alt?: string;
}) {
  const [slides, setSlides] = useState<string[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let active = true;
    (async () => {
      const found: string[] = [];
      for (const base of BASES) {
        for (const ext of EXTS) {
          // eslint-disable-next-line no-await-in-loop
          const hit = await probe(`/curated/${base}.${ext}`);
          if (hit) {
            found.push(hit);
            break;
          }
        }
      }
      if (active && found.length) setSlides(found);
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setIndex((n) => (n + 1) % slides.length), INTERVAL_MS);
    return () => clearInterval(t);
  }, [slides]);

  const list = slides.length ? slides : [FALLBACK];
  const current = index % list.length;

  return (
    <div className={`relative ${className}`}>
      {list.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          priority={i === 0}
          sizes="(max-width:1024px) 100vw, 52vw"
          className={`object-cover transition-opacity duration-[1200ms] ease-in-out ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-[#17232A]/20 via-transparent to-transparent" />
      {list.length > 1 ? (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
          {list.map((src, i) => (
            <span
              key={src}
              className={`h-1.5 rounded-full transition-all ${
                i === current ? 'w-5 bg-white/90' : 'w-1.5 bg-white/45'
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
