'use client';

import { useMemo, useState } from 'react';

const products = [
  {
    code: 'single',
    name: 'Single Key',
    price: '$24',
    detail: '1 physical card · 1 private memory',
  },
  {
    code: 'four',
    name: '4-Key Bundle',
    price: '$64',
    detail: '4 physical cards · 4 private memories',
  },
  {
    code: 'seven',
    name: '7-Key Bundle',
    price: '$72',
    detail: '7 physical cards · 7 private memories',
  },
] as const;

export default function StripeTestPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const cancelled = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('cancelled') === '1';
  }, []);

  async function beginCheckout(productCode: string) {
    setError('');
    setLoading(productCode);

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productCode }),
      });
      const data = await response.json();
      if (!response.ok || !data?.url) {
        throw new Error(data?.error || 'Unable to start Stripe Checkout.');
      }
      window.location.assign(data.url);
    } catch (err: any) {
      setError(err?.message || 'Unable to start Stripe Checkout.');
      setLoading(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#FCF9F4] px-5 py-14 text-[#22323A] sm:px-8">
      <div className="mx-auto max-w-[980px]">
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B38846]">Stripe parallel test</p>
          <h1 className="mt-3 font-serif text-[34px] leading-tight sm:text-[44px]">UNIKMO checkout — test mode</h1>
          <p className="mx-auto mt-4 max-w-[680px] text-[14px] leading-7 text-[#22323A]/65">
            This route exists only to prove Stripe end-to-end while the current Shopify checkout remains unchanged.
            Test payments should create the UNIKMO order, generate the keys and trigger the existing key email.
          </p>
        </div>

        {cancelled ? (
          <div className="mx-auto mt-8 max-w-[680px] rounded-xl border border-[#B38846]/20 bg-white/70 px-5 py-4 text-center text-[13px] text-[#22323A]/70">
            Stripe Checkout was cancelled. No order was created.
          </div>
        ) : null}

        {error ? (
          <div className="mx-auto mt-8 max-w-[680px] rounded-xl border border-red-300 bg-red-50 px-5 py-4 text-center text-[13px] text-red-800">
            {error}
          </div>
        ) : null}

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {products.map((product) => (
            <article key={product.code} className="rounded-[22px] border border-[#22323A]/[0.08] bg-white p-7 shadow-[0_16px_45px_rgba(34,50,58,.07)]">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#B38846]">Physical UNIKMO</p>
              <h2 className="mt-3 font-serif text-[28px]">{product.name}</h2>
              <p className="mt-2 text-[13px] leading-6 text-[#22323A]/60">{product.detail}</p>
              <p className="mt-7 font-serif text-[34px]">{product.price}</p>
              <button
                type="button"
                onClick={() => beginCheckout(product.code)}
                disabled={loading !== null}
                className="mt-7 inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-[#B38846] px-5 text-[11px] font-medium text-white transition hover:bg-[#9D773D] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading === product.code ? 'Opening Stripe…' : 'Test with Stripe'}
              </button>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center text-[11px] leading-6 text-[#22323A]/50">
          Shopify remains the live commerce path. This page is intentionally not linked from the public UNIKMO navigation.
        </div>
      </div>
    </main>
  );
}
