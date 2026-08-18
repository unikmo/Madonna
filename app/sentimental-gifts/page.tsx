import AcquisitionLandingPage from '@/components/AcquisitionLandingPage';
import { acquisitionPages, buildAcquisitionMetadata } from '@/lib/acquisition-pages';

const page = acquisitionPages['sentimental-gifts'];

export const metadata = buildAcquisitionMetadata(page);

export default function SentimentalGiftsPage() {
  return <AcquisitionLandingPage page={page} />;
}
