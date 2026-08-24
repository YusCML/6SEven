import Image from 'next/image';
import Badge from '@/components/ui/Badge';
import type { FrequentRide } from '../content';

export default function RideCard({ ride }: { ride: FrequentRide }) {
  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:border-slate-400">
      <div className="relative aspect-[5/2]">
        <Image
          src={ride.photo}
          alt=""
          aria-hidden
          fill
          placeholder="blur"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
        {ride.favorite ? (
          <Badge tone="inverse" className="absolute left-3 top-3">
            Favorite
          </Badge>
        ) : null}
      </div>

      <div className="p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
          {ride.from} → {ride.to}
        </p>

        <h3 className="mt-1 text-base font-bold text-slate-900">{ride.title}</h3>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {ride.tags.map((tag) => (
              <Badge key={tag.label} tone={tag.tone}>
                {tag.label}
              </Badge>
            ))}
          </div>
          <span className="shrink-0 text-xs font-bold text-slate-500">{ride.duration}</span>
        </div>
      </div>
    </article>
  );
}
