import Image from 'next/image';
import heroPhoto from '@/assets/landing/hero-emperador.jpg';
import useSession from '@/hooks/useSession';
import RoutePlannerCard from './RoutePlannerCard';

export default function HeroSearch() {
  const { isAuthenticated, displayName } = useSession();

  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src={heroPhoto}
        alt=""
        aria-hidden
        fill
        priority
        quality={85}
        sizes="100vw"
        className="-z-10 object-cover object-center"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-r from-slate-950/90 via-slate-950/70 to-slate-950/35"
      />

      <div className="mx-auto w-full max-w-[1440px] px-6 pb-28 pt-14 sm:px-11">
        <h1 className="max-w-xl text-[28px] font-black leading-tight tracking-tight text-white sm:text-4xl">
          {isAuthenticated ? `Saan ka pupunta, ${displayName}?` : 'Saan Ka Pupunta?'}
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
