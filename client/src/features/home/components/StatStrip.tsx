import { landingStats, type StatTone } from '../content';

const toneStyles: Record<StatTone, string> = {
  brand: 'bg-blue-50 text-blue-600',
  success: 'bg-emerald-50 text-emerald-600',
  warning: 'bg-amber-50 text-amber-600',
  accent: 'bg-violet-50 text-violet-600',
};

export default function StatStrip() {
  return (
    <section
      aria-labelledby="network-status-heading"
      className="mx-auto w-full max-w-6xl px-6 pt-6"
    >
      <h2 id="network-status-heading" className="sr-only">
        Network status
      </h2>

      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-slate-100 bg-slate-200 md:grid-cols-4">
        {landingStats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-3 bg-white p-4 lg:gap-3.5 lg:p-5">
            <span
              aria-hidden
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-md lg:h-10 lg:w-10 ${toneStyles[stat.tone]}`}
            >
              <stat.Icon className="h-[18px] w-[18px] lg:h-5 lg:w-5" />
            </span>

            <div className="min-w-0">
              <dt className="text-[10px] font-bold uppercase tracking-wide text-slate-500 lg:text-[11px]">
                {stat.label}
              </dt>
              <dd className="mt-0.5 text-base font-black leading-tight tracking-tight text-slate-900 lg:text-xl">
                {stat.value}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}
