import Image from 'next/image';
import Badge from '@/components/ui/Badge';
import type { FrequentRide } from '../content';

export default function RideCard({ ride }: { ride: FrequentRide }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative h-36">
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
            ★ Favorite
          </Badge>
        ) : null}
      </div>

      <div className="p-5">
        <p className="flex items-center gap-1.5">
          <Badge tone="muted">{ride.from}</Badge>
          <span aria-hidden className="text-[10px] text-slate-300">
            →
          </span>
          <Badge tone="muted">{ride.to}</Badge>
        </p>

        <h3 className="mt-2 text-lg font-bold text-slate-900">{ride.title}</h3>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="flex flex-wrap gap-2">
            {ride.tags.map((tag) => (
              <Badge key={tag.label} tone={tag.tone}>
                {tag.label}
              </Badge>
            ))}
          </div>
          <span className="shrink-0 text-sm font-bold text-slate-500">{ride.duration}</span>
        </div>
      </div>
    </article>
  );
}
