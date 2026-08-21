import { landingStats, type StatTone } from '../content';

const toneStyles: Record<StatTone, string> = {
  brand: 'text-slate-900',
  success: 'text-emerald-600',
  warning: 'text-amber-600',
  accent: 'text-violet-600',
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

      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 md:grid-cols-4">
        {landingStats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-3 bg-white p-5">
            <span aria-hidden className={`shrink-0 ${toneStyles[stat.tone]}`}>
              <stat.Icon className="h-5 w-5" />
            </span>

            <div className="min-w-0">
              <dt className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                {stat.label}
              </dt>
              <dd className="mt-1 text-lg font-extrabold leading-tight tracking-tight text-slate-900">
                {stat.value}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}
