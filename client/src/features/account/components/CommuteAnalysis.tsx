import type { ReactNode } from 'react';
import { ClockIcon, FlameIcon } from '@/components/icons';

export type DayTrips = { day: string; minutes: number };

type CommuteAnalysisProps = {
  streakDays: number;
  minutesOnTransit: number;
  week: DayTrips[];
  activeDay?: string;
};

function StatTile({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-50 text-slate-500">{icon}</span>
      <div>
        <span className="block text-xl font-extrabold leading-tight text-slate-900">{value}</span>
        <span className="text-xs font-semibold text-slate-500">{label}</span>
      </div>
    </div>
  );
}

export default function CommuteAnalysis({ streakDays, minutesOnTransit, week, activeDay }: CommuteAnalysisProps) {
  const peak = Math.max(60, ...week.map((entry) => entry.minutes));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatTile
          icon={<FlameIcon className="h-5 w-5" />}
          value={`${streakDays}`}
          label={streakDays === 1 ? 'Day streak' : 'Day streak'}
        />
        <StatTile
          icon={<ClockIcon className="h-5 w-5" />}
          value={`${Math.round(minutesOnTransit / 60)}h`}
          label="On transit"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex gap-3">
          <div className="flex h-40 w-10 shrink-0 flex-col justify-between py-1 text-right text-[10px] font-semibold text-slate-400">
            <span>{peak}m</span>
            <span>{Math.round(peak / 2)}m</span>
            <span>0m</span>
          </div>

          <ul className="flex h-40 flex-1 items-end gap-2">
            {week.map((entry) => {
              const height = peak === 0 ? 0 : Math.round((entry.minutes / peak) * 100);
              const isActive = entry.day === activeDay;

              return (
                <li key={entry.day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <div
                    className={`flex w-full items-start justify-center rounded-md transition-all ${
                      isActive ? 'bg-gradient-to-b from-blue-600 to-indigo-400' : 'bg-slate-100'
                    }`}
                    style={{ height: `${Math.max(height, 2)}%` }}
                  >
                    {isActive && height > 15 ? (
                      <span className="pt-1 text-[10px] font-bold text-white">{entry.minutes}m</span>
                    ) : null}
                  </div>
                  <span
                    className={`text-[11px] font-semibold ${isActive ? 'text-blue-600' : 'text-slate-400'}`}
                  >
                    {entry.day}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
