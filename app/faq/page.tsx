import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Questions about UNIKMO | UNIKMO',
  description:
    'Answers to common questions about UNIKMO cards, private memories, QR and access codes, privacy, delivery, and storage.',
  alternates: {
    canonical: 'https://www.unikmo.com/faq',
  },
};

const FAQ_ITEMS = [
  {
    q: 'What is UNIKMO?',
    a: 'UNIKMO is an emotional gift that connects a physical card to a private memory. You add a video, photo, voice note, or written message; the recipient scans the card and enters its private access code to open it.',
  },
  {
    q: 'How does it work?',
    a: 'Choose your card, create your private memory, and give the card to someone special. They scan its QR code, enter the private code, and open the memory in their browser — no app or account required.',
  },
  {
    q: 'What can I upload?',
    a: 'You can add a video, photo, voice note, or written message.',
  },
  {
    q: 'Does the recipient need an app?',
    a: 'No. The recipient does not need to download an app or create an account.',
  },
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
    a: 'UNIKMO is made for moments that deserve more than a message — long-distance birthdays, anniversaries, wedding mornings, open-when messages, apologies, family memories, graduations, and messages from far away.',
  },
  {
    q: 'What is the difference between the card options?',
    a: 'Single Memory Card: one private memory. 4-Card Set: four moments for a birthday, anniversary, or open-when story. 7-Card Collection: a fuller memory journey told over time.',
  },
  {
    q: 'What happens if the card or private code is lost?',
    a: 'Contact UNIKMO support with your order details. We will review the available recovery or replacement options, but access cannot be guaranteed without verification.',
  },
  {
    q: 'How long will the memory remain available?',
    a: 'UNIKMO aims to provide long-term access, but does not promise permanent or forever storage. Storage services may change, and reasonable notice will be provided where possible.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'Shipping availability depends on the destination. You can check available shipping options at checkout.',
  },
  {
    q: 'Is this a digital gift or a physical gift?',
    a: 'Both. UNIKMO connects a physical keepsake card to a private digital memory.',
  },
  {
    q: 'How do I contact UNIKMO?',
    a: 'You can contact us through the Contact page for questions about orders, memories, shipping, or special requests.',
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-[#FDF9F5] text-[#1E1B18]">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-20">
        <a
          href="/"
          className="text-[10px] sm:text-xs font-medium text-[#1E1B18]/55 hover:text-[#1E1B18] transition-colors"
        >
          ← Back to UNIKMO
        </a>

        <h1 className="mt-6 sm:mt-8 font-serif text-[30px] sm:text-[38px] lg:text-[44px] leading-[1.1] text-[#2D2926] font-normal tracking-tight">
          Questions about UNIKMO
        </h1>
        <p className="mt-4 sm:mt-5 text-[15px] sm:text-[17px] text-[#2D2926]/80 font-light leading-relaxed max-w-2xl">
          UNIKMO is a physical card that unlocks a private memory — a video, photo, voice note, or message created by you.
        </p>

        <div className="mt-10 sm:mt-12 lg:mt-14 space-y-8 sm:space-y-10">
          {FAQ_ITEMS.map((item) => (
            <div key={item.q} className="border-b border-[#2D2926]/10 pb-8 sm:pb-10 last:border-b-0">
              <h2 className="font-serif text-[18px] sm:text-[20px] text-[#2D2926] mb-2">{item.q}</h2>
              <p className="text-[14px] sm:text-[15px] text-[#2D2926]/75 font-light leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
