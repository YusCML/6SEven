import FrequentRides from './FrequentRides';
import HeroSearch from './HeroSearch';
import LiveTraffic from './LiveTraffic';
import StatStrip from './StatStrip';

export default function LandingPage() {
  return (
    <>
      <HeroSearch />
      <StatStrip />
      <FrequentRides />
      <LiveTraffic />
    </>
  );
}
