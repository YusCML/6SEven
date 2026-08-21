import Link from 'next/link';
import { frequentRides } from '../content';
import RideCard from './RideCard';

export default function FrequentRides() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Your Frequent Rides</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">Quick access to your saved routes and locations.</p>
        </div>
        <Link
          href="/routes"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
        >
          Manage Favorites
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
