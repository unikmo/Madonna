import AcquisitionLandingPage from '@/components/AcquisitionLandingPage';
import { acquisitionPages, buildAcquisitionMetadata } from '@/lib/acquisition-pages';

const page = acquisitionPages['personalized-anniversary-gifts'];

export const metadata = buildAcquisitionMetadata(page);

export default function PersonalizedAnniversaryGiftsPage() {
  return <AcquisitionLandingPage page={page} />;
}
