import type { Metadata } from 'next';
import TestPage from './test/page';

export const metadata: Metadata = {
  title: 'UNIKMO | Give a moment they can revisit',
  description: 'Turn a private video, voice note, photo or message into a physical UNIKMO card they can scan and keep.',
  alternates: { canonical: 'https://www.unikmo.com/' },
};

export default function HomePage() {
  return <TestPage />;
}
