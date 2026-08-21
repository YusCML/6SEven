import Image from 'next/image';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { BookmarkIcon, MapPinIcon } from '@/components/icons';
import HotspotCover from './HotspotCover';
import type { Hotspot } from '../data';

export default function HotspotCard({ hotspot }: { hotspot: Hotspot }) {
  return (
    <article className="mb-4 break-inside-avoid overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:border-slate-400">
      <div className="relative">
        {typeof hotspot.photo === 'string' ? (
          // Remote URLs carry no intrinsic size, so they need a fixed frame.
          <div className="relative aspect-4/3 w-full">
            <Image
              src={hotspot.photo}
              alt={hotspot.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        ) : hotspot.photo ? (
          <Image
            src={hotspot.photo}
            alt={hotspot.title}
            placeholder="blur"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="h-auto w-full object-cover"
          />
        ) : (
          <HotspotCover hotspot={hotspot} height={hotspot.coverHeight} />
        )}

        <div className="absolute left-3 top-3">
          <Badge tone="inverse">{hotspot.category}</Badge>
        </div>

        <button
          type="button"
          aria-label={`Save ${hotspot.title}`}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-paper/90 text-ink backdrop-blur transition hover:bg-paper"
        >
          <BookmarkIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-bold text-slate-900">{hotspot.title}</h3>

        <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <MapPinIcon className="h-3.5 w-3.5 shrink-0" />
          {hotspot.location}
        </p>

        <p className="mt-3 text-xs leading-relaxed text-slate-600">{hotspot.note}</p>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <span className="flex items-center gap-2">
            <Avatar name={hotspot.author} size="sm" />
            <span className="text-xs font-bold text-slate-700">{hotspot.author}</span>
          </span>

          <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
            <BookmarkIcon className="h-3.5 w-3.5" />
            {hotspot.saves}
          </span>
        </div>
      </div>
    </article>
  );
}
