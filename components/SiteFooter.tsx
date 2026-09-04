import Image from 'next/image';
import Link from 'next/link';
import { COMPANY } from '@/lib/company';

const nav = [
  { label: 'How it works', href: '/how-unikmo-works' },
  { label: 'Curated UNIKMO', href: '/curated' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

const legal = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Cookies', href: '/cookies' },
  { label: 'Terms', href: '/terms' },
  { label: 'Legal Notice', href: '/imprint' },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#22323A]/[0.08] bg-[#FCF9F4] px-5 py-10 sm:px-8 lg:py-12">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="text-center sm:text-left">
            <Link href="/" aria-label="UNIKMO home" className="inline-block">
              <Image src="/unikmo-logo-header.png" alt="UNIKMO" width={729} height={220} className="h-8 w-auto" />
            </Link>
            <p className="mt-3 max-w-[280px] text-[11px] leading-[1.6] text-[#22323A]/50">
              A card that unlocks a private memory. A tree planted with every order.
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] font-medium text-[#22323A]/65 sm:justify-end">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-[#B38846]">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 border-t border-[#22323A]/[0.08] pt-6 text-[10px] uppercase tracking-[0.14em] text-[#22323A]/48 sm:flex-row sm:justify-between">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <span>UNIKMO &copy; {year}</span>
            <span aria-hidden="true" className="text-[#22323A]/20">|</span>
            <span>{COMPANY.legalName}, Wyoming, USA</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {legal.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-[#B38846]">
                {item.label}
              </Link>
            ))}
            <span aria-hidden="true" className="text-[#22323A]/20">|</span>
            <a href={COMPANY.social.instagram} target="_blank" rel="noreferrer" className="transition hover:text-[#B38846]">
              Instagram
            </a>
            <a href={COMPANY.social.tiktok} target="_blank" rel="noreferrer" className="transition hover:text-[#B38846]">
              TikTok
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
