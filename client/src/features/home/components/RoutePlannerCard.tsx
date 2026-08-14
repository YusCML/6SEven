import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/router';
import { ArrowsUpDownIcon, ChevronRightIcon, MapPinIcon, SearchIcon } from '@/components/icons';

const inputClassName =
  'h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-base text-slate-900 transition placeholder:text-gray-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20';

export default function RoutePlannerCard() {
  const router = useRouter();
  const [origin, setOrigin] = useState('Manila City Hall');
  const [destination, setDestination] = useState('');

  const swap = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push({ pathname: '/routes', query: { from: origin, to: destination } });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[380px] rounded-2xl bg-white p-5 shadow-2xl">
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 h-4 w-3 -translate-y-1/2 text-blue-600">
          <MapPinIcon className="h-4 w-3" />
        </span>
        <input
          aria-label="Origin"
          value={origin}
          onChange={(event) => setOrigin(event.target.value)}
          placeholder="Where from?"
          className={inputClassName}
        />
      </div>

      <div className="flex justify-center py-2">
        <button
          type="button"
          onClick={swap}
          aria-label="Swap origin and destination"
          className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-slate-400 transition hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
        >
          <ArrowsUpDownIcon className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400">
          <SearchIcon className="h-4 w-4" />
        </span>
        <input
          aria-label="Destination"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
          placeholder="Where to?"
          className={inputClassName}
        />
      </div>

      <button
        type="submit"
        className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-base font-bold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600/40 focus:ring-offset-2"
      >
        Find Best Ride
        <ChevronRightIcon className="h-4 w-4" />
      </button>
    </form>
  );
}
