'use client';

import { FormEvent, useState } from 'react';

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function ContactForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;
    setError('');
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), message: message.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }
      setStatus('success');
      setEmail('');
      setMessage('');
    } catch {
      setError('Failed to send. Please email hello@unikmo.com instead.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-[18px] border border-[#22323A]/[0.08] bg-white/60 p-7 text-center" aria-live="polite">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#B38846]">Message sent</p>
        <h2 className="mt-3 font-serif text-[24px]">Thank you.</h2>
        <p className="mx-auto mt-2 max-w-[420px] text-[13px] leading-[1.7] text-[#22323A]/60">
          We&rsquo;ll get back to you by email as soon as we can.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[18px] border border-[#22323A]/[0.08] bg-white/60 p-6 shadow-[0_16px_45px_rgba(34,50,58,.05)] sm:p-8"
    >
      <label className="block text-[11px] font-medium text-[#22323A]">
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

      <label className="mt-5 block text-[11px] font-medium text-[#22323A]">
        Message
        <textarea
          required
          rows={5}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="How can we help?"
          className="mt-2 w-full resize-none rounded-[10px] border border-[#22323A]/[0.12] bg-[#FCF9F4] px-4 py-3 text-[13px] outline-none transition placeholder:text-[#22323A]/35 focus:border-[#B38846]"
        />
      </label>

      {status === 'error' ? (
        <p className="mt-4 text-[12px] text-red-700" aria-live="polite">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-6 inline-flex min-h-[48px] min-w-[160px] items-center justify-center rounded-lg bg-[#B38846] px-7 text-[11px] font-medium text-white transition hover:bg-[#9D773D] disabled:cursor-wait disabled:opacity-65"
      >
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
