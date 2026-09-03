'use client';

import { useMemo, useState } from 'react';
import {
  CURATED_PRODUCTS,
  curatedCheckoutUrl,
  type CuratedDeliveryKey,
  type CuratedExperienceKey,
} from '@/lib/curated-products';

const EXPERIENCES: Array<{ key: CuratedExperienceKey; title: string; note: string; price: number }> = [
  {
    key: 'KEEP_IT',
    title: 'Keep It — Curated',
    note: 'We assemble your moments into one finished UNIKMO memory.',
    price: CURATED_PRODUCTS.KEEP_IT.price,
  },
  {
    key: 'SHOW_IT',
    title: 'Show It — Times Square Edition',
    note: 'Everything in Keep It, plus a Times Square appearance captured into the memory.',
    price: CURATED_PRODUCTS.SHOW_IT.price,
  },
];

const EXTRA_PRICE = CURATED_PRODUCTS.EXTRA_KEEPSAKES.pricePerCard;
const MAX_EXTRAS = 25;

export default function CuratedCheckout() {
  const [experience, setExperience] = useState<CuratedExperienceKey>('KEEP_IT');
  const [delivery, setDelivery] = useState<CuratedDeliveryKey>('physical');
  const [extras, setExtras] = useState(0);
  const [redirecting, setRedirecting] = useState(false);

  const basePrice = CURATED_PRODUCTS[experience].price;
  const total = basePrice + extras * EXTRA_PRICE;

  const checkoutUrl = useMemo(
    () => curatedCheckoutUrl({ experience, delivery, extraKeepsakes: extras }),
    [experience, delivery, extras],
  );

  function goToCheckout() {
    setRedirecting(true);
    window.location.href = checkoutUrl;
  }

  return (
    <div className="rounded-[20px] border border-[#22323A]/[0.08] bg-white/60 p-6 shadow-[0_16px_45px_rgba(34,50,58,.05)] sm:p-8">
      <fieldset>
        <legend className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B38846]">
          1. Choose your experience
        </legend>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {EXPERIENCES.map((option) => {
            const active = experience === option.key;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => setExperience(option.key)}
                aria-pressed={active}
                className={`rounded-[14px] border p-4 text-left transition ${
                  active
                    ? 'border-[#B38846] bg-[#F8F2EB] shadow-[0_10px_30px_rgba(179,136,70,.12)]'
                    : 'border-[#22323A]/[0.12] bg-[#FCF9F4] hover:border-[#B38846]/60'
                }`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-serif text-[17px]">{option.title}</span>
                  <span className="text-[13px] font-medium text-[#22323A]">${option.price}</span>
                </div>
                <p className="mt-2 text-[11px] leading-[1.55] text-[#22323A]/58">{option.note}</p>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="mt-7 border-t border-[#22323A]/[0.08] pt-6">
        <legend className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B38846]">
          2. Choose delivery
        </legend>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {(['physical', 'digital'] as CuratedDeliveryKey[]).map((option) => {
            const active = delivery === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setDelivery(option)}
                aria-pressed={active}
                className={`min-h-[46px] rounded-[12px] border px-4 text-[12px] font-medium transition ${
                  active
                    ? 'border-[#22323A] bg-[#22323A] text-white'
                    : 'border-[#22323A]/[0.12] bg-[#FCF9F4] text-[#22323A]/70 hover:border-[#B38846]/60'
                }`}
              >
                {option === 'physical' ? 'Physical UNIKMO card' : 'Digital delivery'}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="mt-7 border-t border-[#22323A]/[0.08] pt-6">
        <legend className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B38846]">
          3. Add extra keepsake cards
        </legend>
        <p className="mt-1 text-[11px] leading-[1.6] text-[#22323A]/52">
          Same finished curated memory. ${EXTRA_PRICE} per additional physical card.
        </p>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center rounded-[12px] border border-[#22323A]/[0.14] bg-[#FCF9F4]">
            <button
              type="button"
              onClick={() => setExtras((n) => Math.max(0, n - 1))}
              className="flex h-11 w-11 items-center justify-center text-[18px] text-[#22323A]/70 transition hover:text-[#B38846] disabled:opacity-40"
              disabled={extras === 0}
              aria-label="Remove one extra card"
            >
              −
            </button>
            <span className="min-w-[2.5rem] text-center text-[14px] font-medium tabular-nums">{extras}</span>
            <button
              type="button"
              onClick={() => setExtras((n) => Math.min(MAX_EXTRAS, n + 1))}
              className="flex h-11 w-11 items-center justify-center text-[18px] text-[#22323A]/70 transition hover:text-[#B38846] disabled:opacity-40"
              disabled={extras === MAX_EXTRAS}
              aria-label="Add one extra card"
            >
              +
            </button>
          </div>
          {extras > 0 ? (
            <span className="text-[12px] text-[#22323A]/55">
              +${extras * EXTRA_PRICE} for {extras} card{extras === 1 ? '' : 's'}
            </span>
          ) : null}
        </div>
      </fieldset>

      <div className="mt-8 flex flex-col gap-4 border-t border-[#22323A]/[0.08] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B38846]">Total today</p>
          <p className="mt-1 font-serif text-[30px] leading-none">${total}</p>
          <p className="mt-1 text-[11px] text-[#22323A]/50">
            {CURATED_PRODUCTS[experience].label} · {delivery === 'physical' ? 'Physical' : 'Digital'}
            {extras > 0 ? ` · ${extras} extra card${extras === 1 ? '' : 's'}` : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={goToCheckout}
          disabled={redirecting}
          className="inline-flex min-h-[50px] items-center justify-center rounded-lg bg-[#B38846] px-8 text-[12px] font-medium text-white transition hover:bg-[#9D773D] disabled:cursor-wait disabled:opacity-70"
        >
          {redirecting ? 'Opening checkout…' : 'Continue to checkout'}
        </button>
      </div>

      <p className="mt-4 text-[10px] leading-[1.6] text-[#22323A]/45">
        Checkout is handled securely by Shopify. After payment we email you to collect your photos, videos and
        messages and to confirm Times Square scheduling where selected.
      </p>
    </div>
  );
}
