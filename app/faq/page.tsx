import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Questions about UNIKMO | UNIKMO',
  description:
    'Answers to common questions about UNIKMO — how the physical key works, what you can upload, privacy, shipping, and the difference between key options.',
  alternates: {
    canonical: 'https://www.unikmo.com/faq',
  },
};

const FAQ_ITEMS = [
  {
    q: 'What is UNIKMO?',
    a: 'UNIKMO is a physical key to a private memory. You upload a video, photo, voice note, or written message, then give someone a key that unlocks it.',
  },
  {
    q: 'How does it work?',
    a: 'Choose your key, add your private memory, and give the key to someone special. They open the memory later — no app or account required.',
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
    a: 'Each key is created for one private memory and is designed to be opened only through that key.',
  },
  {
    q: 'Can I change the memory later?',
    a: 'Yes. You can update the memory before the recipient opens it.',
  },
  {
    q: 'When should I give someone a UNIKMO key?',
    a: 'UNIKMO is made for moments that deserve more than a message — long-distance birthdays, anniversaries, wedding mornings, open-when messages, apologies, family memories, graduations, and messages from far away.',
  },
  {
    q: 'What is the difference between the key options?',
    a: 'Single Key: one private memory. 4-Key Set: four moments for a birthday, anniversary, or open-when story. 7-Key Collection: a full memory journey told over time.',
  },
  {
    q: 'What happens if the key is lost?',
    a: "If a key is lost, contact us and we'll help you understand what options are available.",
  },
  {
    q: 'Do you ship internationally?',
    a: 'Shipping availability depends on the destination. You can check available shipping options at checkout.',
  },
  {
    q: 'Is this a digital gift or a physical gift?',
    a: 'Both. UNIKMO combines a physical key with a private digital memory.',
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
          UNIKMO is a physical key that unlocks a private memory — a video, photo, voice note, or message created by you.
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
