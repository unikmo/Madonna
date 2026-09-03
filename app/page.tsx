import type { Metadata } from 'next';
import HashAlias from '@/components/HashAlias';
import CuratedUnikmoTeaser from '@/components/CuratedUnikmoTeaser';
import TestPage from './test/page';

export const metadata: Metadata = {
  title: 'UNIKMO | Give a moment they can revisit',
  description: 'Turn a private video, voice note, photo or message into a physical UNIKMO card they can scan and keep.',
  alternates: { canonical: 'https://www.unikmo.com/' },
};

export default function HomePage() {
  return (
    <div className="production-home">
      <HashAlias />
      <TestPage />
      <CuratedUnikmoTeaser />
    </div>
  );
}
