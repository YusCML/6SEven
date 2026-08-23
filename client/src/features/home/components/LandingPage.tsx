import FareGuide from './FareGuide';
import FrequentRides from './FrequentRides';
import HeroSearch from './HeroSearch';
import PopularPlaces from './PopularPlaces';
import StatStrip from './StatStrip';

export default function LandingPage() {
  return (
    <>
      <HeroSearch />
      <StatStrip />
      <FrequentRides />

      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-10 lg:grid-cols-[1.5fr_1fr]">
        <PopularPlaces />
        <FareGuide />
      </div>
    </>
  );
}
