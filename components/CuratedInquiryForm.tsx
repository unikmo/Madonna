'use client';

import { FormEvent, useState } from 'react';

type FormState = 'idle' | 'sending' | 'success' | 'error';

export default function CuratedInquiryForm() {
  const [email, setEmail] = useState('');
  const [experience, setExperience] = useState('Keep It — Curated');
  const [delivery, setDelivery] = useState('Physical UNIKMO card');
  const [occasion, setOccasion] = useState('Personal celebration');
  const [extras, setExtras] = useState('0');
  const [state, setState] = useState<FormState>('idle');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === 'sending') return;

    setState('sending');
    const message = [
      'Curated UNIKMO inquiry',
      `Experience: ${experience}`,
      `Delivery: ${delivery}`,
      `Occasion: ${occasion}`,
      `Extra keepsakes: ${extras === '0' ? 'None yet' : extras === '10+' ? '10+ cards' : `${extras} card${extras === '1' ? '' : 's'}`}`,
      'Source: /curated',
    ].join('\n');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message }),
      });

      if (!response.ok) throw new Error('Request failed');
      setState('success');
    } catch {
      setState('error');
    }
  }

  if (state === 'success') {
    return (
      <div className="rounded-[20px] border border-[#22323A]/[0.08] bg-white/55 p-7 text-center sm:p-9" aria-live="polite">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#B38846]">Brief received</p>
        <h3 className="mt-3 font-serif text-[28px]">We’ll take it from here.</h3>
        <p className="mx-auto mt-3 max-w-[520px] text-[13px] leading-[1.7] text-[#22323A]/62">
          We’ll confirm the scope, timing and price before you send any files or commit to the curated service.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-[20px] border border-[#22323A]/[0.08] bg-white/55 p-6 shadow-[0_16px_45px_rgba(34,50,58,.05)] sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-left text-[11px] font-medium text-[#22323A]">
          Your email
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="mt-2 min-h-[48px] w-full rounded-[10px] border border-[#22323A]/[0.12] bg-[#FCF9F4] px-4 text-[13px] outline-none transition placeholder:text-[#22323A]/35 focus:border-[#B38846]"
          />
        </label>

        <label className="text-left text-[11px] font-medium text-[#22323A]">
          Experience
          <select value={experience} onChange={(event) => setExperience(event.target.value)} className="mt-2 min-h-[48px] w-full rounded-[10px] border border-[#22323A]/[0.12] bg-[#FCF9F4] px-4 text-[13px] outline-none transition focus:border-[#B38846]">
            <option>Keep It — Curated</option>
            <option>Show It + Keep It — Times Square Edition</option>
          </select>
        </label>

        <label className="text-left text-[11px] font-medium text-[#22323A]">
          Delivery
          <select value={delivery} onChange={(event) => setDelivery(event.target.value)} className="mt-2 min-h-[48px] w-full rounded-[10px] border border-[#22323A]/[0.12] bg-[#FCF9F4] px-4 text-[13px] outline-none transition focus:border-[#B38846]">
            <option>Physical UNIKMO card</option>
            <option>Digital delivery</option>
          </select>
        </label>

        <label className="text-left text-[11px] font-medium text-[#22323A]">
          What are you celebrating?
          <select value={occasion} onChange={(event) => setOccasion(event.target.value)} className="mt-2 min-h-[48px] w-full rounded-[10px] border border-[#22323A]/[0.12] bg-[#FCF9F4] px-4 text-[13px] outline-none transition focus:border-[#B38846]">
            <option>Personal celebration</option>
            <option>Birthday</option>
            <option>Anniversary</option>
            <option>Wedding or engagement</option>
            <option>Company milestone</option>
            <option>Team or employee celebration</option>
            <option>Other milestone</option>
          </select>
        </label>
      </div>

      <fieldset className="mt-6 border-t border-[#22323A]/[0.08] pt-6">
        <legend className="text-[11px] font-medium text-[#22323A]">Extra physical keepsakes</legend>
        <p className="mt-1 text-[11px] leading-[1.6] text-[#22323A]/52">Same finished curated memory. $12 per additional physical card. Three extra cards = $36.</p>
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {['0', '1', '3', '5', '10', '10+'].map((quantity) => (
            <button
              key={quantity}
              type="button"
              onClick={() => setExtras(quantity)}
              aria-pressed={extras === quantity}
              className={`min-h-[44px] rounded-[9px] border px-3 text-[11px] font-medium transition ${extras === quantity ? 'border-[#22323A] bg-[#22323A] text-white' : 'border-[#22323A]/[0.1] bg-[#FCF9F4] text-[#22323A]/65 hover:border-[#B38846]/60'}`}
            >
              {quantity === '0' ? 'None' : quantity}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-7 flex flex-col items-center gap-3 text-center">
        <button type="submit" disabled={state === 'sending'} className="inline-flex min-h-[48px] min-w-[180px] items-center justify-center rounded-lg bg-[#B38846] px-7 text-[11px] font-medium text-white transition hover:bg-[#9D773D] disabled:cursor-wait disabled:opacity-65">
          {state === 'sending' ? 'Sending…' : 'Start Curated'}
        </button>
        <p className="max-w-[540px] text-[10px] leading-[1.6] text-[#22323A]/45">This starts a concierge brief, not a payment. We confirm scope, timing, Times Square availability where selected, and price before you send files.</p>
        {state === 'error' ? <p className="text-[11px] text-red-700" aria-live="polite">We couldn’t send the brief. Please try again.</p> : null}
      </div>
    </form>
  );
}
