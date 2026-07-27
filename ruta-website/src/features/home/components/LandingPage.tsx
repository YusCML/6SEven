import FrequentRides from './FrequentRides';
import HeroSearch from './HeroSearch';
import LiveTraffic from './LiveTraffic';
import StatStrip from './StatStrip';

/** The `/home` landing page — the first thing a visitor sees. */
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
