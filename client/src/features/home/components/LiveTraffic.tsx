import Image from 'next/image';
import Link from 'next/link';
import mapPreview from '@/assets/landing/incident-map.png';
import { AlertTriangleIcon, CheckIcon } from '@/components/icons';
import Badge from '@/components/ui/Badge';
import { trafficHighlights } from '../content';

export default function LiveTraffic() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-12">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div>
          <Badge>Live Updates</Badge>

          <h2 className="mt-4 max-w-md text-xl font-extrabold leading-snug tracking-tight text-slate-900">
            Know before you go. Check real-time traffic.
          </h2>
          <p className="mt-3 max-w-md text-sm font-medium leading-relaxed text-slate-500">
            Our crowd-sourced incident reporting and live GPS tracking help you avoid heavy traffic, rain floods, and
            unexpected route changes.
          </p>

          <ul className="mt-8 space-y-5">
            {trafficHighlights.map((item) => (
              <li key={item.title} className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-900"
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
            className="mt-8 inline-flex h-11 items-center gap-2 rounded-lg bg-slate-900 px-5 text-sm font-bold text-white transition hover:bg-slate-700"
          >
            <AlertTriangleIcon className="h-4 w-4" />
            View Incident Map
          </Link>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-ink">
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
