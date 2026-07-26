import PageMeta from '@/components/PageMeta';
import LandingPage from '@/features/home/components/LandingPage';

export default function HomePage() {
  return (
    <>
      <PageMeta
        title="Home"
        description="Navigate the metro seamlessly with real-time updates, incident reports and transit analytics for Filipino commuters."
      />
      <LandingPage />
    </>
  );
}
