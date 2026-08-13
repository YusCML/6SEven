import { landingStats, type StatTone } from '../content';

const toneStyles: Record<StatTone, { tile: string; value: string }> = {
  brand: { tile: 'bg-blue-50', value: 'text-slate-900' },
  success: { tile: 'bg-green-50', value: 'text-slate-900' },
  warning: { tile: 'bg-amber-50', value: 'text-yellow-600' },
  accent: { tile: 'bg-purple-50', value: 'text-slate-900' },
};

export default function StatStrip() {
  return (
    <section className="relative z-10 mx-auto -mt-16 w-full max-w-[1440px] px-6 sm:px-11">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {landingStats.map((stat) => {
          const tone = toneStyles[stat.tone];

          return (
            <div
              key={stat.label}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-lg"
            >
              <span aria-hidden className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-base ${tone.tile}`}>
                {stat.icon}
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-bold uppercase tracking-wide text-slate-400">{stat.label}</span>
                <span className={`block truncate text-base font-black sm:text-lg ${tone.value}`}>{stat.value}</span>
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
