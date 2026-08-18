import AcquisitionLandingPage from '@/components/AcquisitionLandingPage';
import { acquisitionPages, buildAcquisitionMetadata } from '@/lib/acquisition-pages';

const page = acquisitionPages['long-distance-gifts'];

export const metadata = buildAcquisitionMetadata(page);

export default function LongDistanceGiftsPage() {
  return <AcquisitionLandingPage page={page} />;
}
