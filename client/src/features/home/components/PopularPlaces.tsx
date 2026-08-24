import Image from 'next/image';
import Link from 'next/link';
import { CommentIcon, HeartIcon, MapPinIcon } from '@/components/icons';
import { HOTSPOTS } from '@/features/hotspot/data';

const FEATURED = [...HOTSPOTS].sort((a, b) => b.saves - a.saves).slice(0, 5);

export default function PopularPlaces() {
  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Popular Places</h2>

        <Link href="/hotspot" className="text-sm font-semibold text-slate-500 transition hover:text-slate-900">
          See more
        </Link>
      </div>

      <ul className="mt-6 divide-y divide-slate-100 border-y border-slate-100">
        {FEATURED.map((hotspot) => (
          <li key={hotspot.id}>
            <Link
              href="/hotspot"
              className="flex items-center gap-4 py-3 transition hover:opacity-75"
            >
              <span className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                {hotspot.photo ? (
                  <Image
                    src={hotspot.photo}
                    alt=""
                    aria-hidden
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : null}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                  {hotspot.category}
                </span>
                <span className="mt-0.5 block truncate text-sm font-bold text-slate-900">{hotspot.title}</span>
                <span className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <MapPinIcon className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{hotspot.location}</span>
                </span>
              </span>

              <span className="flex shrink-0 items-center gap-3 text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1.5">
                  <HeartIcon className="h-3.5 w-3.5" />
                  {hotspot.likes}
                </span>
                <span className="flex items-center gap-1.5">
                  <CommentIcon className="h-3.5 w-3.5" />
                  {hotspot.comments}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
