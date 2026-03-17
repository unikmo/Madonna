'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { href: '/admin/buyers', label: 'Buyers', icon: BuyersIcon },
  { href: '/admin/codes', label: 'Codes', icon: CodesIcon },
  { href: '/admin/shopify', label: 'Shopify', icon: ShopifyIcon },
];

const TITLES: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/buyers': 'Buyers',
  '/admin/codes': 'Codes',
  '/admin/shopify': 'Shopify',
};

function getTitle(pathname: string): string {
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

function CodesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
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

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === '/admin/login';

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  if (isLogin) {
    return <>{children}</>;
  }

  const title = getTitle(pathname);

  return (
    <div className="min-h-screen bg-[#FDF9F5] flex">
      {/* Sidebar */}
      <aside className="w-56 sm:w-64 flex-shrink-0 border-r border-[#E3DAD0] bg-white flex flex-col">
        <div className="p-5 border-b border-[#E3DAD0]">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span className="font-serif text-lg tracking-wide text-[#2D2926]">UNIKMO</span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#2D2926]/50">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== '/admin/codes' && pathname.startsWith(item.href + '/'));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-[#2D2926] text-[#FDF9F5]'
                    : 'text-[#2D2926]/75 hover:bg-[#F5ECE3] hover:text-[#2D2926]'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-[#E3DAD0]">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-[#2D2926]/75 hover:bg-[#F5ECE3] hover:text-[#2D2926] transition-colors"
          >
            <LogoutIcon className="w-5 h-5 flex-shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex-shrink-0 h-14 sm:h-16 border-b border-[#E3DAD0] bg-white flex items-center justify-between px-4 sm:px-6">
          <h1 className="font-serif text-xl sm:text-2xl text-[#2D2926]">{title}</h1>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
