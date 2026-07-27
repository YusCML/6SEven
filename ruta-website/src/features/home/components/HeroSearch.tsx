import Image from 'next/image';
import heroPhoto from '@/assets/landing/hero-city.jpg';
import useSession from '@/hooks/useSession';
import RoutePlannerCard from './RoutePlannerCard';

/**
 * Full-bleed hero: city photography behind a dark scrim, with the route
 * planner overlaid on the left.
 */
export default function HeroSearch() {
  const { isAuthenticated, user } = useSession();

  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src={heroPhoto}
        alt=""
        aria-hidden
        fill
        priority
        quality={85}
        // The hero spans the viewport, so ask for a source that wide — without
        // this, `fill` defaults to a guess and the picture is upscaled and soft.
        sizes="100vw"
        className="-z-10 object-cover object-center"
      />
      {/* Scrim keeps the white heading readable over a busy photo. Darkest on
          the left, where the copy sits, fading right so the skyline shows. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/35"
      />

      {/* Extra bottom padding leaves room for the stat strip to overlap. */}
      <div className="mx-auto w-full max-w-[1440px] px-6 pb-28 pt-14 sm:px-11">
        <h1 className="max-w-xl text-[28px] font-black leading-tight tracking-tight text-white sm:text-4xl">
          {isAuthenticated ? `Saan ka pupunta, ${user?.username}?` : 'Saan Ka Pupunta?'}
        </h1>
        <p className="mt-3 max-w-sm text-sm font-medium leading-relaxed text-white/85 sm:text-base">
          Smart route planning for the modern Filipino commuter. Avoid traffic, save fares, and arrive on time.
        </p>

        <div className="mt-6">
          <RoutePlannerCard />
        </div>
      </div>
    </section>
  );
}
