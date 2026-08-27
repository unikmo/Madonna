import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Questions about UNIKMO | UNIKMO',
  description: 'Answers to common questions about UNIKMO cards, private memories, QR and access codes, privacy, delivery, and storage.',
  alternates: { canonical: 'https://www.unikmo.com/faq' },
};

const FAQ_ITEMS = [
  {
    q: 'What is UNIKMO?',
    a: 'UNIKMO connects a physical card to a private memory. You add a video, photo, voice note, or written message; the recipient scans the card and enters its private access code to open it.',
  },
  {
    q: 'How does it work?',
    a: 'Choose your card, create your private memory, and give the card to someone special. They scan its QR code, enter the private code, and open the memory in their browser — no app or recipient account required.',
  },
  { q: 'What can I upload?', a: 'You can add a video, photo, voice note, or written message.' },
  { q: 'Does the recipient need an app?', a: 'No. The recipient does not need to download an app or create an account.' },
  {
    q: 'Is the memory private?',
    a: 'Memories are private by default. Access requires the UNIKMO link and the card’s private code, so keep the card and code within the people you intend to share it with.',
  },
  {
    q: 'Can I change the memory later?',
    a: 'Once a Moment is submitted, it cannot currently be edited or reassigned. Review the memory carefully before completing your upload.',
  },
  {
    q: 'When should I give someone a UNIKMO card?',
    a: 'UNIKMO is made for moments that deserve more than a message — birthdays, anniversaries, long-distance relationships, wedding mornings, open-when messages, apologies, family memories, graduations, and messages from far away.',
  },
  {
    q: 'What is the difference between the card options?',
    a: 'Single Key gives you one physical card and one private memory. 4-Key Bundle gives you four cards and four separate private memories. 7-Key Bundle gives you seven cards and seven separate private memories.',
  },
  {
    q: 'What happens if the card or private code is lost?',
    a: 'Contact UNIKMO support with your order details. We will review the available recovery or replacement options, but access cannot be guaranteed without verification.',
  },
  {
    q: 'How long will the memory remain available?',
    a: 'UNIKMO aims to provide long-term access, but does not promise permanent storage. Storage services may change, and reasonable notice will be provided where possible.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'Shipping availability depends on the destination. You can check available shipping options at checkout.',
  },
  {
    q: 'Is this a digital gift or a physical gift?',
    a: 'Both. UNIKMO connects a physical keepsake card to a private digital memory.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-[#FCF9F4] text-[#22323A]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="sticky top-0 z-40 border-b border-[#22323A]/[0.07] bg-[#FCF9F4]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1240px] items-center px-5 sm:px-8">
          <Link href="/" aria-label="UNIKMO home"><Image src="/unikmo-logo-header.png" alt="UNIKMO — The Key to Your Memory" width={729} height={220} priority className="h-8 w-auto sm:h-9" /></Link>
          <nav className="ml-auto hidden items-center gap-7 text-[11px] text-[#22323A]/65 md:flex">
            <Link href="/#how-it-works" className="hover:text-[#B38846]">How it works</Link>
            <Link href="/faq" className="text-[#B38846]">FAQ</Link>
          </nav>
          <Link href="/#shop" className="ml-auto rounded-lg bg-[#B38846] px-5 py-3 text-[11px] font-medium text-white transition hover:bg-[#9F783D] md:ml-8">Choose Your Card</Link>
        </div>
      </header>

      <main>
        <section className="px-5 pb-12 pt-12 text-center sm:px-8 sm:pb-16 sm:pt-16">
          <div className="mx-auto max-w-[820px]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B38846]">Before you choose</p>
            <h1 className="mt-4 font-serif text-[36px] leading-[1.04] tracking-[-0.025em] sm:text-[46px]">Questions about UNIKMO.</h1>
            <p className="mx-auto mt-5 max-w-[700px] text-[15px] leading-[1.7] text-[#22323A]/68 sm:text-[16px]">
              <strong className="font-semibold text-[#22323A]">A physical card that unlocks your private video, voice note, photo or message.</strong> Here is what to know before you give one.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              <Link href="/#shop" className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-[#B38846] px-7 text-[11px] font-medium text-white transition hover:bg-[#9F783D]">Choose Your Card</Link>
              <Link href="/#how-it-works" className="inline-flex min-h-[44px] items-center text-[11px] font-medium text-[#22323A]/68 underline decoration-[#B38846]/45 underline-offset-4">See how it works</Link>
            </div>
          </div>

          <div className="mx-auto mt-9 max-w-[660px] rounded-[24px] border border-[#22323A]/[0.07] bg-[radial-gradient(circle_at_50%_38%,#FFFDF9_0%,#F2E8DE_58%,#E4D6C8_100%)] p-6 shadow-[0_20px_55px_rgba(34,50,58,.08)]">
            <div className="relative aspect-[3/2] overflow-hidden rounded-[14px] border border-white/60 bg-[#F9F4EE] shadow-[0_20px_38px_rgba(40,30,20,.14)]">
              <Image src="/cardfrontunikmo.jpg" alt="UNIKMO Single Key card" fill className="object-contain p-3" sizes="(max-width:760px) 84vw, 620px" />
            </div>
          </div>
        </section>

        <section className="border-y border-[#22323A]/[0.06] bg-[#F7F0E8] px-5 py-12 sm:px-8 sm:py-16">
          <div className="mx-auto max-w-[900px] divide-y divide-[#22323A]/[0.08] border-y border-[#22323A]/[0.08]">
            {FAQ_ITEMS.map((item) => (
              <details key={item.q} className="group py-1">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-serif text-[20px] leading-[1.25] sm:text-[22px]">
                  {item.q}
                  <span className="shrink-0 text-[#B38846] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-[760px] pb-6 pr-10 text-[14px] leading-[1.75] text-[#22323A]/66 sm:text-[15px]">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="px-5 py-14 text-center sm:px-8 sm:py-16">
          <div className="mx-auto max-w-[760px]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B38846]">Ready when the moment is</p>
            <h2 className="mt-3 font-serif text-[32px] leading-[1.06] sm:text-[40px]">Choose the card. Then make it personal.</h2>
            <p className="mx-auto mt-4 max-w-[620px] text-[14px] leading-[1.7] text-[#22323A]/62">Single Key, 4-Key Bundle, or 7-Key Bundle — each card unlocks its own private memory.</p>
            <Link href="/#shop" className="mt-7 inline-flex min-h-[48px] items-center justify-center rounded-lg bg-[#B38846] px-8 text-[11px] font-medium text-white transition hover:bg-[#9F783D]">Choose Your Card</Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#22323A]/[0.08] bg-[#F7F0E8] py-8">
        <div className="mx-auto flex max-w-[1080px] flex-col items-center justify-between gap-4 px-5 sm:flex-row sm:px-8">
          <Image src="/unikmo-logo-header.png" alt="UNIKMO" width={729} height={220} className="h-8 w-auto" />
          <div className="flex gap-5 text-[10px] uppercase tracking-[0.14em] text-[#22323A]/48"><Link href="/" className="hover:text-[#22323A]">UNIKMO</Link><Link href="/#shop" className="hover:text-[#22323A]">Choose Your Card</Link></div>
        </div>
      </footer>
    </div>
  );
}
