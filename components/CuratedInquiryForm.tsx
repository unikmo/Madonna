'use client';

import { FormEvent, useState } from 'react';

export default function CuratedInquiryForm() {
  const [email, setEmail] = useState('');
  const [experience, setExperience] = useState('Show It + Keep It');
  const [details, setDetails] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('sending');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message: `Curated UNIKMO inquiry\nExperience: ${experience}\n\n${details || 'No additional details supplied.'}` }),
      });
      if (!response.ok) throw new Error('Request failed');
      setState('sent');
    } catch {
      setState('error');
    }
  }

  if (state === 'sent') return <div className="rounded-[18px] border border-[#B38846]/30 bg-white/55 p-8 text-center"><h3 className="font-serif text-[26px]">Your memory is in motion.</h3><p className="mt-3 text-[13px] leading-relaxed text-[#22323A]/62">We received your request and will contact you about the next steps.</p></div>;

  return (
    <form onSubmit={submit} className="mx-auto mt-8 grid max-w-[760px] gap-4 rounded-[20px] border border-[#B38846]/30 bg-white/50 p-6 text-left shadow-[0_18px_50px_rgba(34,50,58,.05)] sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-[11px] font-medium text-[#22323A]/70">Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="min-h-[48px] rounded-lg border border-[#22323A]/15 bg-[#FCF9F4] px-4 text-[14px] text-[#22323A] outline-none transition focus:border-[#B38846]" placeholder="you@example.com" /></label>
        <label className="grid gap-2 text-[11px] font-medium text-[#22323A]/70">Experience<select value={experience} onChange={(e) => setExperience(e.target.value)} className="min-h-[48px] rounded-lg border border-[#22323A]/15 bg-[#FCF9F4] px-4 text-[14px] text-[#22323A] outline-none transition focus:border-[#B38846]"><option>Keep It — Curated</option><option>Show It + Keep It</option><option>Share It — Extra Keepsakes</option><option>I’m not sure yet</option></select></label>
      </div>
      <label className="grid gap-2 text-[11px] font-medium text-[#22323A]/70">Tell us about the moment<textarea value={details} onChange={(e) => setDetails(e.target.value)} className="min-h-[112px] resize-y rounded-lg border border-[#22323A]/15 bg-[#FCF9F4] px-4 py-3 text-[14px] leading-relaxed text-[#22323A] outline-none transition focus:border-[#B38846]" placeholder="Anniversary, wedding, birthday, proposal—or another memory that matters." /></label>
      <button disabled={state === 'sending'} className="mx-auto mt-2 inline-flex min-h-[48px] items-center justify-center rounded-lg bg-[#B38846] px-8 text-[12px] font-medium text-white transition hover:bg-[#9D773D] disabled:opacity-60">{state === 'sending' ? 'Sending…' : 'Start Curated'}</button>
      {state === 'error' ? <p role="alert" className="text-center text-[12px] text-red-700">We couldn’t send your request. Please try again.</p> : null}
    </form>
  );
}
