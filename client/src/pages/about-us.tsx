import PageMeta from '@/components/PageMeta';
import AboutUs from '@/features/about-us/components/AboutUs';

export default function AboutUsPage() {
  return (
    <>
      <PageMeta title="About Us" description="Meet the team building RUTA, the commuter platform for Metro Manila transit." />
      <AboutUs />
    </>
  );
}
