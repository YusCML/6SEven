import { useState } from 'react';
import PageMeta from '@/components/PageMeta';
import Alert from '@/components/ui/Alert';
import Badge from '@/components/ui/Badge';
import { CheckIcon, CrownIcon, XIcon } from '@/components/icons';
import { PERKS, PLANS } from '@/features/upgrade/plans';

type Cycle = 'monthly' | 'yearly';

export default function UpgradePage() {
  const [cycle, setCycle] = useState<Cycle>('monthly');

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <PageMeta title="RUTA Plus" description="Compare RUTA Commuter and RUTA Plus plans." />

      <header className="max-w-xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-amber-700">
          <CrownIcon className="h-3.5 w-3.5" />
          RUTA Plus
        </span>

        <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900">
          Commute like you already know the way.
        </h2>
        <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">
          Offline routes, earlier alerts and a record of what you spend getting around Iloilo City.
        </p>
      </header>

      <div className="mt-8 inline-flex rounded-lg border border-slate-200 bg-white p-1">
        {(['monthly', 'yearly'] as const).map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={cycle === option}
            onClick={() => setCycle(option)}
            className={`h-9 rounded-md px-5 text-xs font-bold capitalize transition ${
              cycle === option ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {PLANS.map((plan) => {
          const price = cycle === 'monthly' ? plan.monthly : plan.yearly;
          const isPlus = plan.id === 'plus';

          return (
            <section
              key={plan.id}
              className={`rounded-lg border bg-white p-6 ${isPlus ? 'border-amber-300' : 'border-slate-200'}`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-bold text-slate-900">{plan.name}</h3>
                {isPlus ? <Badge tone="brand">Recommended</Badge> : <Badge tone="neutral">Current</Badge>}
              </div>

              <p className="mt-1 text-xs font-medium text-slate-500">{plan.tagline}</p>

              <p className="mt-5 flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                  {price === 0 ? 'Free' : `₱${price}`}
                </span>
                {price > 0 ? (
                  <span className="text-xs font-semibold text-slate-400">
                    / {cycle === 'monthly' ? 'month' : 'year'}
                  </span>
                ) : null}
              </p>

              <ul className="mt-6 space-y-3 border-t border-slate-100 pt-5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    {feature}
                  </li>
                ))}

                {plan.missing?.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm font-medium text-slate-400">
                    <XIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                disabled={!isPlus}
                className={`mt-6 h-11 w-full rounded-lg text-sm font-bold transition ${
                  isPlus
                    ? 'bg-slate-900 text-white hover:bg-slate-700'
                    : 'border border-slate-200 text-slate-400'
                }`}
              >
                {isPlus ? 'Upgrade to Plus' : 'Your current plan'}
              </button>
            </section>
          );
        })}
      </div>

      <section className="mt-10">
        <h3 className="text-lg font-bold text-slate-900">What you get</h3>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {PERKS.map((perk) => (
            <div key={perk.title} className="rounded-lg border border-slate-200 bg-white p-5">
              <h4 className="text-sm font-bold text-slate-900">{perk.title}</h4>
              <p className="mt-2 text-xs font-medium leading-relaxed text-slate-500">{perk.body}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8">
        <Alert tone="info">Billing is not connected yet — this page is a preview.</Alert>
      </div>
    </div>
  );
}
