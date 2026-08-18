import AcquisitionLandingPage from '@/components/AcquisitionLandingPage';
import { acquisitionPages, buildAcquisitionMetadata } from '@/lib/acquisition-pages';

const page = acquisitionPages['personalized-birthday-gifts'];

export const metadata = buildAcquisitionMetadata(page);

export default function PersonalizedBirthdayGiftsPage() {
  return <AcquisitionLandingPage page={page} />;
}
