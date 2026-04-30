'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { href: '/admin/buyers', label: 'Buyers', icon: BuyersIcon },
  { href: '/admin/orders', label: 'Orders', icon: OrdersIcon },
  { href: '/admin/codes', label: 'Codes', icon: CodesIcon },
  { href: '/admin/configs', label: 'Configs', icon: ConfigsIcon },
  { href: '/admin/storage', label: 'Storage', icon: StorageIcon },
  { href: '/admin/template-viewer', label: 'Templates', icon: TemplatesIcon },
  { href: '/admin/shopify', label: 'Shopify', icon: ShopifyIcon },
];

const TITLES: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/buyers': 'Buyers',
  '/admin/orders': 'Orders',
  '/admin/codes': 'Codes',
  '/admin/configs': 'Configs',
  '/admin/storage': 'Storage',
  '/admin/template-viewer': 'Templates',
  '/admin/shopify': 'Shopify',
};

const STORAGE_COLLAPSED = 'admin-sidebar-collapsed';

function getTitle(pathname: string): string {
  if (pathname.startsWith('/admin/orders/') && pathname !== '/admin/orders') return 'Order details';
  if (pathname.startsWith('/admin/codes/') && pathname !== '/admin/codes') return 'Code details';
  return TITLES[pathname] ?? 'Admin';
}

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function BuyersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function OrdersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M6 7V5a2 2 0 012-2h8a2 2 0 012 2v2m-1 4H7m-2 4h14a2 2 0 002-2V9H3v4a2 2 0 002 2z" />
    </svg>
  );
}

function CodesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  );
}

function TemplatesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 19.5A2.5 2.5 0 016.5 17H20v2H6.5A.5.5 0 006 19.5c0 .276.224.5.5.5H20v2H6.5A2.5 2.5 0 014 19.5zM7 3h13a2 2 0 012 2v9a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"
      />
    </svg>
  );
}

function ConfigsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function ShopifyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}

function StorageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7M4 7l8 4 8-4M4 7l8-4 8 4m-8 4v10"
      />
    </svg>
  );
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function ChevronCollapseIcon({ className, expanded }: { className?: string; expanded: boolean }) {
  return (
    <svg
      className={`${className ?? ''} transition-transform duration-200 ${expanded ? '' : 'rotate-180'}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
    </svg>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === '/admin/login';

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_COLLAPSED);
      if (stored === 'true') setCollapsed(true);
    } catch {
      /* ignore */
    }
  }, []);

  const setCollapsedPersist = (next: boolean) => {
    setCollapsed(next);
    try {
      localStorage.setItem(STORAGE_COLLAPSED, next ? 'true' : 'false');
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  if (isLogin) {
    return <>{children}</>;
  }

  const title = getTitle(pathname);

  const navLinkClass = (active: boolean, rail: boolean) =>
    `flex items-center rounded-xl text-sm font-medium transition-colors ${
      rail ? 'justify-center gap-0 px-2 py-2.5 lg:px-2' : 'gap-3 px-3 py-2.5'
    } ${
      active
        ? 'bg-[#2D2926] text-[#FDF9F5]'
        : 'text-[#2D2926]/75 hover:bg-[#F5ECE3] hover:text-[#2D2926]'
    }`;

  const desktopRail = collapsed;

  return (
    <div className="min-h-screen bg-[#FDF9F5] flex">
      {/* Mobile / tablet: overlay when drawer open */}
      <button
        type="button"
        aria-label="Close menu"
        className={`fixed inset-0 z-40 bg-[#1E1B18]/40 backdrop-blur-[2px] transition-opacity lg:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[#E3DAD0] bg-white shadow-xl transition-[transform,width] duration-300 ease-out lg:static lg:z-auto lg:shadow-none
          w-64 max-w-[85vw]
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${desktopRail ? 'lg:w-[4.25rem] lg:min-w-[4.25rem] lg:max-w-[4.25rem]' : 'lg:w-64 lg:min-w-0'}
        `}
      >
        <div
          className={`flex flex-shrink-0 items-center gap-2 border-b border-[#E3DAD0] p-4 ${
            desktopRail ? 'lg:flex-col lg:gap-3 lg:px-2 lg:py-4' : 'justify-between sm:p-5'
          }`}
        >
          <Link
            href="/admin/dashboard"
            onClick={() => setMobileOpen(false)}
            className={`flex min-w-0 items-center gap-2 ${desktopRail ? 'lg:justify-center' : ''}`}
            title="UNIKMO Admin"
          >
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#2D2926] font-serif text-sm text-[#FDF9F5]">
              U
            </span>
            <span
              className={`min-w-0 font-serif text-lg tracking-wide text-[#2D2926] ${
                desktopRail ? 'lg:hidden' : ''
              }`}
            >
              UNIKMO
            </span>
            <span
              className={`text-[10px] tracking-[0.2em] text-[#2D2926]/50 ${desktopRail ? 'lg:hidden' : 'hidden sm:inline'}`}
            >
              Admin
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-expanded={!desktopRail}
              aria-label={desktopRail ? 'Expand sidebar' : 'Collapse sidebar'}
              title={desktopRail ? 'Expand sidebar' : 'Collapse sidebar'}
              className="hidden rounded-lg p-2 text-[#2D2926] hover:bg-[#F5ECE3] lg:flex"
              onClick={() => setCollapsedPersist(!collapsed)}
            >
              <ChevronCollapseIcon className="h-5 w-5" expanded={!desktopRail} />
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {NAV.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== '/admin/codes' &&
                item.href !== '/admin/configs' &&
                item.href !== '/admin/storage' &&
                pathname.startsWith(item.href + '/'));
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                onClick={() => setMobileOpen(false)}
                className={navLinkClass(active, desktopRail)}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className={desktopRail ? 'lg:sr-only' : ''}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#E3DAD0] p-3">
          <button
            type="button"
            onClick={handleLogout}
            title="Logout"
            className={`flex w-full items-center rounded-xl text-sm font-medium text-[#2D2926]/75 transition-colors hover:bg-[#F5ECE3] hover:text-[#2D2926] ${
              desktopRail ? 'justify-center px-2 py-2.5 lg:px-2' : 'gap-3 px-3 py-2.5'
            }`}
          >
            <LogoutIcon className="h-5 w-5 flex-shrink-0" />
            <span className={desktopRail ? 'lg:sr-only' : ''}>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 flex-shrink-0 items-center gap-3 border-b border-[#E3DAD0] bg-white px-3 sm:h-16 sm:px-6">
          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="flex-shrink-0 rounded-lg p-2 text-[#2D2926] hover:bg-[#F5ECE3] lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
          <h1 className="min-w-0 truncate font-serif text-lg text-[#2D2926] sm:text-xl lg:text-2xl">{title}</h1>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
