import Image from 'next/image';
import Link from 'next/link';
import mapPreview from '@/assets/landing/incident-map.png';
import { CheckIcon } from '@/components/icons';
import Badge from '@/components/ui/Badge';
import { trafficHighlights } from '../content';

export default function LiveTraffic() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-6 pb-20 sm:px-11">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <Badge>Live Updates</Badge>

          <h2 className="mt-4 max-w-md text-2xl font-black leading-snug tracking-tight text-slate-900 sm:text-3xl">
            Know before you go. Check real-time traffic.
          </h2>
          <p className="mt-3 max-w-md text-base text-slate-600">
            Our crowd-sourced incident reporting and live GPS tracking help you avoid heavy traffic, rain floods, and
            unexpected route changes.
          </p>

          <ul className="mt-8 space-y-5">
            {trafficHighlights.map((item) => (
              <li key={item.title} className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600"
                >
                  <CheckIcon className="h-3 w-3" />
                </span>
                <span>
                  <span className="block text-sm font-bold text-slate-900">{item.title}</span>
                  <span className="block text-sm text-slate-500">{item.description}</span>
                </span>
              </li>
            ))}
          </ul>

          <Link
            href="/dashboard"
            className="mt-8 inline-flex h-11 items-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-bold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/40 focus:ring-offset-2"
          >
            ⚠ View Incident Map
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border-4 border-white bg-slate-900 shadow-2xl">
          <Image
            src={mapPreview}
            alt="Live incident map of Metro Manila"
            placeholder="blur"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}
