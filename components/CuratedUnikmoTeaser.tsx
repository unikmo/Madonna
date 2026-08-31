import Link from 'next/link';

const steps = [
  {
    label: 'KEEP IT',
    title: 'Curated Memory',
    copy: 'Send us the moments you choose. We professionally assemble them into one finished UNIKMO memory.',
  },
  {
    label: 'SHOW IT',
    title: 'Times Square Edition',
    copy: 'Take the curated moment to Times Square. We capture the appearance and preserve it inside the finished UNIKMO.',
  },
  {
    label: 'SHARE IT',
    title: 'Extra Keepsakes',
    copy: 'Give the same finished memory to the people who were part of it. Additional physical cards are $12 each.',
  },
] as const;

export default function CuratedUnikmoTeaser() {
  return (
    <section id="curated" className="curated-teaser border-t border-[#22323A]/[0.07] bg-[#22323A] px-5 py-16 text-white sm:px-8 lg:py-20">
      <div className="mx-auto max-w-[1120px]">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D7B77C]">Want us to make it for you?</p>
          <h2 className="mt-3 font-serif text-[32px] leading-[1.08] sm:text-[42px]">Curated UNIKMO.</h2>
          <p className="mx-auto mt-4 max-w-[680px] text-[14px] leading-[1.75] text-white/68 sm:text-[15px]">
            You bring the moments. We shape the story. Keep it privately, take it to Times Square, then share extra keepsakes with the people who were part of it.
          </p>
        </div>

        <div className="mt-10 grid overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.035] md:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.label} className={`p-7 text-left sm:p-8 ${index ? 'border-t border-white/10 md:border-l md:border-t-0' : ''}`}>
              <p className="text-[10px] font-semibold tracking-[0.22em] text-[#D7B77C]">{step.label}</p>
              <h3 className="mt-3 font-serif text-[25px]">{step.title}</h3>
              <p className="mt-3 text-[13px] leading-[1.7] text-white/62">{step.copy}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <Link href="/curated" className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-[#B38846] px-7 text-[11px] font-medium text-white transition hover:bg-[#9D773D]">
            Explore Curated UNIKMO
          </Link>
          <a href="#shop" className="inline-flex min-h-[44px] items-center text-[11px] font-medium text-white/72 underline decoration-[#D7B77C]/55 underline-offset-4">
            Prefer to make it yourself? Choose a card
          </a>
        </div>
      </div>
    </section>
  );
}
