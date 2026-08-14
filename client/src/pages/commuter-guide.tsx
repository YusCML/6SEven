import PageMeta from '@/components/PageMeta';
import CommuterGuide from '@/features/commuterGuide/components/CommuterGuide';

export default function CommuterGuidePage() {
  return (
    <>
      <PageMeta
        title="Commuter Guide"
        description="Fares, routes and practical tips for getting around Metro Manila by train, bus and jeepney."
      />
      <CommuterGuide />
    </>
  );
}
