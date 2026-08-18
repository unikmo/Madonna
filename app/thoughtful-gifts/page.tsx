import AcquisitionLandingPage from '@/components/AcquisitionLandingPage';
import { acquisitionPages, buildAcquisitionMetadata } from '@/lib/acquisition-pages';

const page = acquisitionPages['thoughtful-gifts'];

export const metadata = buildAcquisitionMetadata(page);

export default function ThoughtfulGiftsPage() {
  return <AcquisitionLandingPage page={page} />;
}
