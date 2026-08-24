import { fareDiscount, fareGuide } from '../content';

const PEAK = Math.max(...fareGuide.map((row) => row.amount));

export default function FareGuide() {
  return (
    <section>
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-base font-bold text-slate-900">Fares at a Glance</h2>

        <div className="mt-5 space-y-5">
          {fareGuide.map((row) => (
            <div key={row.mode}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-bold text-slate-900">{row.mode}</span>
                <span className="shrink-0 text-sm font-extrabold tracking-tight text-slate-900">₱{row.amount}</span>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-slate-900"
                  style={{ width: `${Math.round((row.amount / PEAK) * 100)}%` }}
                />
              </div>

              <p className="mt-1.5 text-xs font-medium text-slate-500">{row.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 border-t border-slate-100 pt-4">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm font-bold text-amber-700">{fareDiscount.label}</span>
            <span className="shrink-0 text-sm font-extrabold text-amber-700">{fareDiscount.value}</span>
          </div>
          <p className="mt-1 text-xs font-medium text-slate-500">{fareDiscount.note}</p>
        </div>
      </div>
    </section>
  );
}
