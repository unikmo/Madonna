import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SiteFooter from './SiteFooter';

export default function LegalPageShell({
  title,
  intro,
  updated,
  eyebrow = 'Legal',
  children,
}: {
  title: string;
  intro?: string;
  updated?: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FCF9F4] text-[#22323A]">
      <header className="sticky top-0 z-40 border-b border-[#22323A]/[0.07] bg-[#FCF9F4]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1080px] items-center px-5 sm:px-8">
          <Link href="/" aria-label="UNIKMO home">
            <Image
              src="/unikmo-logo-header.png"
              alt="UNIKMO — The Key to Your Memory"
              width={729}
              height={220}
              priority
              className="h-8 w-auto sm:h-9"
            />
          </Link>
          <nav className="ml-auto hidden items-center gap-7 text-[11px] text-[#22323A]/65 md:flex">
            <Link href="/how-unikmo-works" className="hover:text-[#B38846]">How it works</Link>
            <Link href="/faq" className="hover:text-[#B38846]">FAQ</Link>
            <Link href="/contact" className="hover:text-[#B38846]">Contact</Link>
          </nav>
        </div>
      </header>

      <main className="px-5 py-14 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-[760px]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B38846]">{eyebrow}</p>
          <h1 className="mt-3 font-serif text-[34px] leading-[1.1] sm:text-[44px]">{title}</h1>
          {intro ? (
            <p className="mt-4 text-[14px] leading-[1.75] text-[#22323A]/65 sm:text-[15px]">{intro}</p>
          ) : null}
          {updated ? (
            <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-[#22323A]/45">Last updated: {updated}</p>
          ) : null}

          <div className="legal-prose mt-10 space-y-8 text-[14px] leading-[1.75] text-[#22323A]/80 sm:text-[15px]">
            {children}
          </div>

          <div className="mt-14 flex flex-wrap gap-x-5 gap-y-2 border-t border-[#22323A]/[0.08] pt-6 text-[11px] font-medium text-[#22323A]/60">
            <Link href="/privacy" className="hover:text-[#B38846]">Privacy</Link>
            <Link href="/terms" className="hover:text-[#B38846]">Terms</Link>
            <Link href="/imprint" className="hover:text-[#B38846]">Imprint</Link>
            <Link href="/contact" className="hover:text-[#B38846]">Contact</Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

/** Section heading + body helper for legal pages. */
export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-serif text-[20px] text-[#22323A] sm:text-[22px]">{heading}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
