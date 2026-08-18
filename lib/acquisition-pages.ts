import type { Metadata } from 'next';

export type AcquisitionPage = {
  slug: string;
  primaryKeyword: string;
  supportingKeywords: string[];
  eyebrow: string;
  title: string;
  intro: string;
  situationTitle: string;
  situationCopy: string;
  whyTitle: string;
  whyPoints: { title: string; copy: string }[];
  examplesTitle: string;
  examplesIntro: string;
  examples: { title: string; copy: string }[];
  productFit: [string, string, string];
  faqs: { question: string; answer: string }[];
  related: string[];
  metaTitle: string;
  metaDescription: string;
};

export const acquisitionPages: Record<string, AcquisitionPage> = {
  'thoughtful-gifts': {
    slug: 'thoughtful-gifts',
    primaryKeyword: 'thoughtful gifts',
    supportingKeywords: ['meaningful gifts', 'meaningful gift ideas'],
    eyebrow: 'A gift that says you paid attention',
    title: 'Thoughtful gifts should feel personal before they feel impressive.',
    intro: 'UNIKMO turns your own words, voice, photos or video into a physical card they can keep. It is designed for the moments when a generic present feels too easy and a handwritten note still does not say enough.',
    situationTitle: 'When the meaning matters more than the object',
    situationCopy: 'The strongest thoughtful gifts usually carry a detail only you would know: the story behind a photo, the thing you admire about them, the memory you still laugh about, or the sentence you have never quite said out loud. UNIKMO gives that meaning a physical place to live.',
    whyTitle: 'Why UNIKMO works as a meaningful gift',
    whyPoints: [
      { title: 'It starts with your words', copy: 'The value comes from what you upload, not from a generic inscription chosen from a menu.' },
      { title: 'They receive something tangible', copy: 'The message is connected to a premium physical card they can hold, display and revisit.' },
      { title: 'The moment stays private', copy: 'The recipient scans the QR code and uses the private access code. No social feed, no ads, no public post.' },
    ],
    examplesTitle: 'What could you put inside?',
    examplesIntro: 'A thoughtful gift does not need a long production. It needs one detail that feels unmistakably yours.',
    examples: [
      { title: 'A 45-second voice note', copy: 'Tell them the small thing they do that you notice more than they realise.' },
      { title: 'A photo with the story behind it', copy: 'Use one image and explain why that day still matters to you.' },
      { title: 'A short private video', copy: 'Say what you would want them to hear again on a difficult or distant day.' },
    ],
    productFit: ['One precise message for one person.', 'Four connected moments for a richer story.', 'Seven moments for a complete memory journey.'],
    faqs: [
      { question: 'What makes a gift thoughtful rather than expensive?', answer: 'Usually specificity. A thoughtful gift reflects something you know about the person or the relationship. UNIKMO is built around that specificity because the message, photo, voice note or video comes from you.' },
      { question: 'Can I use UNIKMO if I am not good at writing?', answer: 'Yes. You can upload a voice note, photo or video instead of writing a long message. A simple, specific memory is often more powerful than polished wording.' },
      { question: 'Is the recipient forced to download an app?', answer: 'No. They scan the card and open the private moment in their browser.' },
      { question: 'Can they revisit the gift later?', answer: 'Yes. The physical card is designed to be kept, so the recipient has a tangible route back to the private moment.' },
    ],
    related: ['sentimental-gifts', 'personalized-birthday-gifts', 'personalized-video-message'],
    metaTitle: 'Thoughtful Gifts & Meaningful Gift Ideas | UNIKMO',
    metaDescription: 'Looking for thoughtful gifts that feel genuinely personal? Turn your private words, voice, photos or video into a physical UNIKMO memory card.',
  },
  'sentimental-gifts': {
    slug: 'sentimental-gifts',
    primaryKeyword: 'sentimental gifts',
    supportingKeywords: ['sentimental gift ideas', 'emotional gifts'],
    eyebrow: 'For the things that are hard to put in a box',
    title: 'Sentimental gifts are really about the memory behind them.',
    intro: 'UNIKMO gives an emotional message a physical form. Record what the person means to you, connect it to a keepsake card, and give them something they can return to long after the occasion is over.',
    situationTitle: 'For moments with emotional weight',
    situationCopy: 'Some gifts are meant to make someone laugh. Others are meant to stop them for a second. A sentimental gift works when it holds a memory, a thank-you, an apology, a promise, or a reminder of a relationship that matters. UNIKMO is built for that second category.',
    whyTitle: 'Why it feels different from a normal greeting card',
    whyPoints: [
      { title: 'Your voice survives the moment', copy: 'They can hear or watch you again instead of only rereading a printed sentence.' },
      { title: 'The card becomes the memory trigger', copy: 'The physical object stays simple while the private digital layer carries the emotion.' },
      { title: 'You decide how intimate it is', copy: 'Use a single photo, a voice note, a written message or a video. The format follows the relationship.' },
    ],
    examplesTitle: 'Sentimental ideas that do not feel staged',
    examplesIntro: 'The best emotional gifts are specific, restrained and true to the relationship.',
    examples: [
      { title: 'The memory you both still mention', copy: 'Tell the story from your side and why it became important to you.' },
      { title: 'What you never say often enough', copy: 'Record a private message they can hear again whenever they need it.' },
      { title: 'A sequence of small moments', copy: 'Use multiple cards to create a beginning, middle and final message rather than one long speech.' },
    ],
    productFit: ['A single emotional moment.', 'A four-part story with more depth.', 'A seven-part keepsake for milestone memories.'],
    faqs: [
      { question: 'Are sentimental gifts only for romantic partners?', answer: 'No. They can work for parents, siblings, close friends, mentors or anyone where the relationship itself is the reason for the gift.' },
      { question: 'Will an emotional gift feel too intense?', answer: 'It does not need to. A specific memory or simple thank-you can feel deeply personal without becoming dramatic.' },
      { question: 'Can I keep the message private?', answer: 'Yes. UNIKMO is designed around private access rather than public sharing.' },
      { question: 'Can I combine photos and words?', answer: 'Yes. The idea is to choose the format that best carries the memory rather than forcing everything into a printed card.' },
    ],
    related: ['thoughtful-gifts', 'personalized-anniversary-gifts', 'long-distance-gifts'],
    metaTitle: 'Sentimental Gifts & Emotional Gift Ideas | UNIKMO',
    metaDescription: 'Create a sentimental gift with your own private words, voice, photos or video. UNIKMO turns the memory into a physical card they can keep and revisit.',
  },
  'personalized-birthday-gifts': {
    slug: 'personalized-birthday-gifts',
    primaryKeyword: 'personalized birthday gifts',
    supportingKeywords: ['birthday video message', 'unique birthday gifts'],
    eyebrow: 'A birthday message that does not disappear after the day',
    title: 'A personalized birthday gift built from the memories only you share.',
    intro: 'Instead of another object with their name printed on it, give them your own message. UNIKMO connects a private birthday video, voice note, photo or written memory to a physical card they can keep.',
    situationTitle: 'Make the birthday feel specific to them',
    situationCopy: 'A birthday is one of the easiest occasions to buy for and one of the hardest to make memorable. Personalization works when it reflects the person rather than simply adding a name. Use UNIKMO to give them a moment that could only have come from you.',
    whyTitle: 'A better use of personalization',
    whyPoints: [
      { title: 'Record a real birthday video message', copy: 'No template voice-over. Speak directly to them in the way you normally would.' },
      { title: 'Add the memory behind the birthday', copy: 'Use an old photo, a shared joke or a story from the year you just had together.' },
      { title: 'Give it physically', copy: 'They still open a real card, but the card unlocks more than printed text.' },
    ],
    examplesTitle: 'What to say in a birthday UNIKMO',
    examplesIntro: 'Keep it short and personal. One vivid detail usually beats a long generic tribute.',
    examples: [
      { title: 'The thing I admired about you this year…', copy: 'Turn the message toward who they are now, not just the date on the calendar.' },
      { title: 'I still laugh when I think about…', copy: 'Start with a shared memory and let the birthday message grow naturally from it.' },
      { title: 'Open this when the birthday is over…', copy: 'Use a multi-card set for a birthday plus messages they can revisit later.' },
    ],
    productFit: ['One birthday message that lands.', 'Four birthday memories or open-when notes.', 'Seven chapters for a milestone birthday.'],
    faqs: [
      { question: 'Can I record a birthday video message?', answer: 'Yes. Video is one of the core formats you can use for the private moment connected to the card.' },
      { question: 'Is this suitable for milestone birthdays?', answer: 'Yes. A 4-card or 7-card set works especially well when you want several memories, people or chapters rather than one message.' },
      { question: 'Can I prepare the gift before the birthday?', answer: 'Yes. Create the moment in advance so the physical card is ready for the birthday itself.' },
      { question: 'Does the recipient need a UNIKMO account?', answer: 'No. They can access the moment without creating a recipient account.' },
    ],
    related: ['thoughtful-gifts', 'personalized-video-message', 'sentimental-gifts'],
    metaTitle: 'Personalized Birthday Gifts & Birthday Video Messages | UNIKMO',
    metaDescription: 'Create a personalized birthday gift with a private video, voice note, photo or message connected to a physical UNIKMO card.',
  },
  'personalized-anniversary-gifts': {
    slug: 'personalized-anniversary-gifts',
    primaryKeyword: 'personalized anniversary gifts',
    supportingKeywords: ['sentimental anniversary gifts'],
    eyebrow: 'Your history is the personalization',
    title: 'Personalized anniversary gifts should tell your story, not just print a date.',
    intro: 'UNIKMO lets you turn the memories, words and private moments from your relationship into a physical card your partner can keep and reopen whenever the story matters.',
    situationTitle: 'An anniversary is already a story',
    situationCopy: 'You do not need to invent a theme for an anniversary gift. The relationship is the theme. The first trip, the difficult year you got through, the habit you love, the place you always return to—those details are what make the gift personal.',
    whyTitle: 'Why UNIKMO fits anniversaries',
    whyPoints: [
      { title: 'It can hold more than one memory', copy: 'Use 4 or 7 cards to create chapters across the relationship rather than squeezing everything into one message.' },
      { title: 'You can mix formats', copy: 'A photo can introduce the memory, your voice can explain it, and a video can carry the final message.' },
      { title: 'It stays private between you', copy: 'The experience is designed for the recipient, not for social posting or public reactions.' },
    ],
    examplesTitle: 'Anniversary story ideas',
    examplesIntro: 'Use the relationship timeline as your structure.',
    examples: [
      { title: 'The beginning', copy: 'What did you notice about them before they knew you had noticed?' },
      { title: 'The turning point', copy: 'Choose the day or season when the relationship became something more serious.' },
      { title: 'What comes next', copy: 'End with what you still want to experience together rather than only looking backward.' },
    ],
    productFit: ['One anniversary message with real weight.', 'Four moments across your relationship.', 'Seven chapters for a fuller anniversary story.'],
    faqs: [
      { question: 'What makes a good personalized anniversary gift?', answer: 'A detail that belongs to your relationship: a private phrase, remembered place, turning point, photo or promise. The personalization should come from the story rather than decoration alone.' },
      { question: 'Can I make several anniversary cards?', answer: 'Yes. The 4-card and 7-card options are designed for multi-part stories and collections of moments.' },
      { question: 'Can my partner revisit the message after the anniversary?', answer: 'Yes. Revisitability is part of the point: the physical card remains a way back to the private moment.' },
      { question: 'Is it suitable for long-term couples?', answer: 'Especially. More history gives you more material for a meaningful sequence rather than a generic anniversary message.' },
    ],
    related: ['sentimental-gifts', 'long-distance-gifts', 'thoughtful-gifts'],
    metaTitle: 'Personalized Anniversary Gifts | UNIKMO',
    metaDescription: 'Create a personalized anniversary gift from your own memories, photos, voice or video. Give your relationship story a physical UNIKMO keepsake.',
  },
  'long-distance-gifts': {
    slug: 'long-distance-gifts',
    primaryKeyword: 'long-distance relationship gifts',
    supportingKeywords: ['long-distance gifts', 'gifts for boyfriend', 'gifts for girlfriend'],
    eyebrow: 'Something close when you cannot be',
    title: 'Long-distance relationship gifts should shorten the emotional distance.',
    intro: 'UNIKMO gives your partner something physical to keep while your voice, video, photo or message stays privately accessible whenever the distance feels especially far.',
    situationTitle: 'The gift does not need to replace being there',
    situationCopy: 'The best long-distance gifts do something simpler: they create a small ritual of closeness. A card on a nightstand, a voice they can replay, a message for the next difficult goodbye, or a memory they can open when time zones do not line up.',
    whyTitle: 'Built for being apart without feeling absent',
    whyPoints: [
      { title: 'A physical reminder remains with them', copy: 'The card is there even when you are asleep, travelling or in another time zone.' },
      { title: 'Your voice travels better than generic copy', copy: 'Record exactly what you want them to hear instead of choosing a prewritten message.' },
      { title: 'Open-when moments work naturally', copy: 'Multi-card sets can become “open when you miss me”, “open after a hard day” or “open before our next trip” moments.' },
    ],
    examplesTitle: 'Long-distance message ideas',
    examplesIntro: 'Create messages around the moments distance actually makes harder.',
    examples: [
      { title: 'Open when you miss me', copy: 'A calm voice note or short video they can return to without scheduling a call.' },
      { title: 'Open before our next visit', copy: 'Share one thing you are most looking forward to doing together.' },
      { title: 'Open after a hard day', copy: 'Give them the version of your support they can access immediately, even across time zones.' },
    ],
    productFit: ['One anchor message for the distance.', 'Four open-when moments.', 'Seven messages for a longer stretch apart.'],
    faqs: [
      { question: 'What is a good long-distance relationship gift?', answer: 'Something that creates repeatable closeness rather than a one-time surprise. A private message they can revisit works well because it remains useful after the delivery day.' },
      { question: 'Can I make open-when cards?', answer: 'Yes. The multi-card options are a natural fit for different situations or moods across the relationship.' },
      { question: 'Does the message expire after one view?', answer: 'The product is designed around revisiting the moment rather than a one-time disappearing message.' },
      { question: 'Can this work for a boyfriend or girlfriend in another country?', answer: 'Yes. The experience is digital once the recipient has the physical card, so distance does not change how they unlock the moment.' },
    ],
    related: ['personalized-anniversary-gifts', 'sentimental-gifts', 'personalized-video-message'],
    metaTitle: 'Long-Distance Relationship Gifts | UNIKMO',
    metaDescription: 'Create a long-distance relationship gift they can keep close: a physical UNIKMO card connected to your private voice, video, photo or message.',
  },
  'personalized-video-message': {
    slug: 'personalized-video-message',
    primaryKeyword: 'personalized video message',
    supportingKeywords: ['video message gift', 'video gift'],
    eyebrow: 'Your message. Your face. A gift they can hold.',
    title: 'Turn a personalized video message into a physical gift.',
    intro: 'Record the video on your phone, connect it to a UNIKMO card, and give the recipient a private way to watch it again. The physical card makes a digital message feel intentional rather than disposable.',
    situationTitle: 'A video message becomes more meaningful when it has a place to live',
    situationCopy: 'A video sent in a chat can disappear into months of messages. UNIKMO separates the important message from the everyday feed and gives it a physical anchor. The recipient scans the card, enters the private access code, and opens the moment.',
    whyTitle: 'Why use UNIKMO for a video gift',
    whyPoints: [
      { title: 'No editing studio required', copy: 'A sincere phone video is enough. The value is the person speaking, not cinematic production.' },
      { title: 'It is given like a real gift', copy: 'The recipient opens a physical card rather than receiving another link in a messaging app.' },
      { title: 'It stays private', copy: 'The video is not a social post and the recipient does not need a public profile to watch it.' },
    ],
    examplesTitle: 'Personalized video message ideas',
    examplesIntro: 'Short works. Aim for one emotional point rather than a speech.',
    examples: [
      { title: 'Birthday video message', copy: 'Tell them what you noticed or admired about the year they just lived.' },
      { title: 'Anniversary video', copy: 'Choose one shared memory and explain why it still matters.' },
      { title: 'Message for later', copy: 'Record something they can revisit when you are apart, travelling or simply missing you.' },
    ],
    productFit: ['One video message, one card.', 'Four videos or mixed-format moments.', 'Seven moments for a complete video-led story.'],
    faqs: [
      { question: 'How do I make a personalized video message gift?', answer: 'Record a short video, create the private UNIKMO moment, and give the connected physical card to the recipient.' },
      { question: 'Does the recipient need to install anything?', answer: 'No. The moment opens in the browser after they scan and use the private access code.' },
      { question: 'Can I use a video I already recorded?', answer: 'Yes. The point is the message, so an existing clip can work if it is the moment you want to preserve.' },
      { question: 'Can I include more than one video?', answer: 'Use the 4-card or 7-card option when several messages or chapters make more sense than one long video.' },
    ],
    related: ['personalized-birthday-gifts', 'long-distance-gifts', 'thoughtful-gifts'],
    metaTitle: 'Personalized Video Message Gift | UNIKMO',
    metaDescription: 'Turn a personalized video message into a physical gift. UNIKMO connects your private video to a premium card they can keep and revisit.',
  },
  'qr-code-gift': {
    slug: 'qr-code-gift',
    primaryKeyword: 'QR code gift',
    supportingKeywords: ['QR code card', 'gift with QR code'],
    eyebrow: 'A QR code should unlock something worth opening',
    title: 'A QR code gift that leads to a private memory—not a generic webpage.',
    intro: 'UNIKMO uses the QR code as the bridge between a physical card and the private digital moment you created. The recipient scans, enters the private access code, and opens your voice, video, photo or message.',
    situationTitle: 'The QR code is the mechanism, not the gift',
    situationCopy: 'A QR code by itself is just a shortcut. What matters is what waits behind it. UNIKMO pairs the scan with a premium physical card, a private access step and a personal moment created for one recipient.',
    whyTitle: 'What makes this different from printing your own QR code',
    whyPoints: [
      { title: 'A deliberate recipient experience', copy: 'The scan leads into a private moment rather than a random file or public link.' },
      { title: 'Physical and digital are designed together', copy: 'The card is not an afterthought attached to a URL; it is the keepsake that brings the recipient back.' },
      { title: 'Private access is part of the flow', copy: 'The QR code is paired with a private access code so the experience is not simply an open public page.' },
    ],
    examplesTitle: 'What can the QR code card unlock?',
    examplesIntro: 'Use the format that best fits the message rather than forcing one content type.',
    examples: [
      { title: 'A private video', copy: 'Ideal when facial expression and voice carry more than written words.' },
      { title: 'A voice note', copy: 'Personal and intimate without needing to be on camera.' },
      { title: 'A photo or written message', copy: 'Perfect for a memory with a story that deserves context.' },
    ],
    productFit: ['One QR-connected private moment.', 'Four cards with four separate moments.', 'Seven cards for a complete sequence.'],
    faqs: [
      { question: 'What is a QR code gift?', answer: 'It is a physical gift or card that uses a QR code to connect the recipient to digital content. With UNIKMO, that content is a private personal moment rather than a public webpage.' },
      { question: 'Can anyone who sees the QR code open the message?', answer: 'UNIKMO adds a private access-code step rather than relying on the QR code alone.' },
      { question: 'Does the QR code open an app?', answer: 'No. The recipient can use the browser on their phone.' },
      { question: 'Can each card have a different memory?', answer: 'Yes. Multi-card sets are intended for separate moments or chapters.' },
    ],
    related: ['personalized-video-message', 'thoughtful-gifts', 'sentimental-gifts'],
    metaTitle: 'QR Code Gift & QR Code Card | UNIKMO',
    metaDescription: 'Create a QR code gift that unlocks a private video, voice note, photo or message. UNIKMO pairs the QR experience with a physical keepsake card.',
  },
};

export function buildAcquisitionMetadata(page: AcquisitionPage): Metadata {
  const url = `https://www.unikmo.com/${page.slug}`;
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url,
      siteName: 'UNIKMO',
      type: 'website',
      images: ['https://www.unikmo.com/og-image.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.metaTitle,
      description: page.metaDescription,
      images: ['https://www.unikmo.com/og-image.jpg'],
    },
  };
}
