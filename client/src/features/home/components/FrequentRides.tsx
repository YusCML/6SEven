import Link from 'next/link';
import { frequentRides } from '../content';
import RideCard from './RideCard';

export default function FrequentRides() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Your Frequent Rides</h2>
        <Link
          href="/routes"
          className="text-sm font-semibold text-slate-500 transition hover:text-slate-900"
        >
          See all
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {frequentRides.map((ride) => (
          <RideCard key={ride.id} ride={ride} />
        ))}
      </div>
    </section>
  );
}
