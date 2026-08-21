import type { ReactNode } from 'react';
import { ClockIcon, FlameIcon } from '@/components/icons';

export type DayTrips = { day: string; minutes: number };

type CommuteAnalysisProps = {
  streakDays: number;
  minutesOnTransit: number;
  week: DayTrips[];
  activeDay?: string;
};

const AXIS_STEPS = 6;

function StatTile({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-5">
      <span className="shrink-0">{icon}</span>
      <div>
        <span className="block text-xl font-extrabold leading-tight text-slate-900">{value}</span>
        <span className="text-xs font-semibold text-slate-500">{label}</span>
      </div>
    </div>
  );
}

export default function CommuteAnalysis({ streakDays, minutesOnTransit, week, activeDay }: CommuteAnalysisProps) {
  const peak = Math.max(60, ...week.map((entry) => entry.minutes));
  const ticks = Array.from({ length: AXIS_STEPS + 1 }, (_, index) => Math.round((peak / AXIS_STEPS) * index)).reverse();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatTile
          icon={<FlameIcon className="h-5 w-5 text-orange-500" />}
          value={`${streakDays}`}
          label="Day streak"
        />
        <StatTile
          icon={<ClockIcon className="h-5 w-5 text-amber-500" />}
          value={`${Math.round(minutesOnTransit / 60)}h`}
          label="On transit"
        />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex gap-3">
          <ul className="flex h-44 w-10 shrink-0 flex-col justify-between text-right text-[10px] font-semibold text-slate-400">
            {ticks.map((tick) => (
              <li key={tick} className="leading-none">
                {tick}m
              </li>
            ))}
          </ul>

          <ul className="flex h-44 flex-1 items-end gap-2 border-l border-dashed border-slate-200 pl-3">
            {week.map((entry) => {
              const height = peak === 0 ? 0 : Math.round((entry.minutes / peak) * 100);
              const isActive = entry.day === activeDay;

              return (
                <li key={entry.day} className="flex h-full flex-1 flex-col items-center justify-end">
                  <div
                    className={`flex w-full items-start justify-center rounded-md ${
                      isActive ? 'bg-gradient-to-b from-blue-600 to-indigo-400' : 'bg-slate-100'
                    }`}
                    style={{ height: `${Math.max(height, 2)}%` }}
                  >
                    {isActive && height > 15 ? (
                      <span className="pt-1 text-[10px] font-bold text-white">{entry.minutes}m</span>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <ul className="mt-2 flex gap-2 pl-[3.25rem]">
          {week.map((entry) => (
            <li
              key={entry.day}
              className={`flex-1 text-center text-[11px] font-semibold ${
                entry.day === activeDay ? 'text-blue-600' : 'text-slate-400'
              }`}
            >
              {entry.day}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
