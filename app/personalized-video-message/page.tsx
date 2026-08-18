import AcquisitionLandingPage from '@/components/AcquisitionLandingPage';
import { acquisitionPages, buildAcquisitionMetadata } from '@/lib/acquisition-pages';

const page = acquisitionPages['personalized-video-message'];

export const metadata = buildAcquisitionMetadata(page);

export default function PersonalizedVideoMessagePage() {
  return <AcquisitionLandingPage page={page} />;
}
