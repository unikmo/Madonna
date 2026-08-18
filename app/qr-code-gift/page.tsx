import AcquisitionLandingPage from '@/components/AcquisitionLandingPage';
import { acquisitionPages, buildAcquisitionMetadata } from '@/lib/acquisition-pages';

const page = acquisitionPages['qr-code-gift'];

export const metadata = buildAcquisitionMetadata(page);

export default function QrCodeGiftPage() {
  return <AcquisitionLandingPage page={page} />;
}
