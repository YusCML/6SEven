import PageMeta from '@/components/PageMeta';
import LandingPage from '@/features/home/components/LandingPage';

export default function HomePage() {
  return (
    <>
      <PageMeta
        title="Home"
        description="Compare jeepney, bus and tricycle routes around Iloilo City — fares, travel time and transfers."
      />
      <LandingPage />
    </>
  );
}
