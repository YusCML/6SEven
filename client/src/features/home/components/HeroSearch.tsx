import Image from 'next/image';
import heroPhoto from '@/assets/landing/hero-emperador.jpg';
import useSession from '@/hooks/useSession';
import RoutePlannerCard from './RoutePlannerCard';

export default function HeroSearch() {
  const { isAuthenticated, displayName } = useSession();

  return (
    <section className="mx-auto w-full max-w-6xl px-6 pt-8">
      {/*
        The photo is 2560x1086 (2.36:1). Keep the frame narrower than that ratio
        or object-cover trims the building off the top. The scrim runs left to
        right so the copy stays legible while the facade keeps its brightness.
      */}
      <div className="relative isolate flex min-h-[24rem] flex-col justify-center overflow-hidden rounded-2xl sm:min-h-[26rem] lg:min-h-[30rem]">
        <Image
          src={heroPhoto}
          alt=""
          aria-hidden
          fill
          priority
          quality={85}
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="-z-10 object-cover object-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-linear-to-r from-ink/90 via-ink/55 to-ink/10"
        />

        <div className="w-full max-w-2xl p-8 lg:p-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-paper/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-paper/85 ring-1 ring-paper/20 backdrop-blur">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Iloilo City · Live
          </span>

          <h2 className="mt-5 text-3xl font-black leading-[1.05] tracking-tight text-paper sm:text-4xl lg:text-5xl">
            {isAuthenticated ? `Saan ka pupunta, ${displayName}?` : 'Saan ka pupunta?'}
          </h2>

          <p className="mt-3 max-w-xs text-sm font-medium leading-relaxed text-paper/70">
            Every ride compared — fare, time and transfers.
          </p>

          <div className="mt-7">
            <RoutePlannerCard />
          </div>
        </div>
      </div>
    </section>
  );
}
