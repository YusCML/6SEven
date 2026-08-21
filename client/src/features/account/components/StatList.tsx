import type { ReactNode } from 'react';

export type StatListItem = {
  label: string;
  value: number | string;
  icon: ReactNode;
  tone?: 'slate' | 'blue' | 'green' | 'red' | 'amber';
};

const tones: Record<NonNullable<StatListItem['tone']>, string> = {
  slate: 'bg-slate-50 text-slate-500',
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-emerald-50 text-emerald-600',
  red: 'bg-red-50 text-red-600',
  amber: 'bg-amber-50 text-amber-600',
};

export default function StatList({ items }: { items: StatListItem[] }) {
  return (
    <ul className="space-y-3">
      {items.map(({ label, value, icon, tone = 'slate' }) => (
        <li
          key={label}
          className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${tones[tone]}`}>{icon}</span>
            <span className="text-sm font-bold text-slate-800">{label}</span>
          </div>
          <span className="text-sm font-extrabold text-slate-900">{value}</span>
        </li>
      ))}
    </ul>
  );
}
