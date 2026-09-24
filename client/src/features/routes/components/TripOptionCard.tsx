import { formatKm, formatMinutes, formatPeso } from '@/features/routes/lib/fare';
import { distanceMeters } from '@/features/routes/lib/geo';
import type { Pin } from '@/features/routes/lib/landmarks';
import type { RideLeg, TripOption } from '@/features/routes/lib/tripPlanner';

const NEAR_PIN_M = 250;

interface TripOptionCardProps {
  option: TripOption;
  origin: Pin;
  destination: Pin;
  selected?: boolean;
  onClick?: () => void;
}

function rideSummary(option: TripOption): string {
  if (option.rides === 0) return 'Walk only';
  return option.rides === 1 ? '1 jeep' : `${option.rides} jeeps`;
}

/** Where to get on or off, in words a driver or a passenger would recognise. */
function placeName(leg: RideLeg, end: 'board' | 'alight', origin: Pin, destination: Pin): string {
  const point = end === 'board' ? leg.board : leg.alight;
  const pin = end === 'board' ? origin : destination;
  if (distanceMeters(point, pin.position) <= NEAR_PIN_M) return `near ${pin.label}`;
  const stop = end === 'board' ? leg.boardName : leg.alightName;
  return stop ? `near ${stop}` : `along Route ${leg.routeNumber}`;
}

function walkTarget(option: TripOption, index: number, destinationLabel: string): string {
  const next = option.legs[index + 1];
  if (!next) return ` to ${destinationLabel}`;
  return next.kind === 'ride' ? ` to the Route ${next.routeNumber} jeep` : '';
}

export default function TripOptionCard({ option, origin, destination, selected, onClick }: TripOptionCardProps) {
  const rides = option.legs.flatMap((leg) => (leg.kind === 'ride' ? [leg] : []));

  return (
    <div
      onClick={onClick}
      className={`w-full cursor-pointer rounded-xl border-2 p-4 text-left transition-all ${
        selected ? 'border-slate-900 bg-white shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-black text-slate-900">{formatMinutes(Math.round(option.minutes))}</div>
          <div className="text-xs font-semibold text-slate-500">
            {rideSummary(option)} · walk {formatKm(option.walkMeters)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-wide text-slate-400">Total fare</div>
          <div className="font-black text-slate-900">{formatPeso(option.fare)}</div>
        </div>
      </div>

      {rides.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-1.5 text-xs font-bold">
          {rides.map((ride, i) => (
            <span key={`${ride.routeNumber}-${i}`} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-slate-400">→</span>}
              <span className="rounded px-2 py-1 text-white" style={{ backgroundColor: ride.color }}>
                Route {ride.routeNumber}
              </span>
            </span>
          ))}
        </div>
      )}

      <ol className="space-y-2 border-t border-slate-100 pt-3 text-xs">
        {option.legs.map((leg, i) => (
          <li key={i} className="flex gap-2">
            <span className="min-w-5 font-semibold text-slate-900">{i + 1}.</span>
            {leg.kind === 'walk' ? (
              <div className="flex-1 text-slate-600">
                <span className="font-semibold text-slate-900">Walk</span> {Math.round(leg.meters)} m (~{leg.minutes} min)
                {walkTarget(option, i, destination.label)}
              </div>
            ) : (
              <div className="flex-1">
                <div className="font-semibold text-slate-900">
                  Ride Route {leg.routeNumber} · {leg.title}
                </div>
                <div className="text-slate-500">Board {placeName(leg, 'board', origin, destination)}</div>
                <div className="text-slate-500">Get off {placeName(leg, 'alight', origin, destination)}</div>
                <div className="text-slate-400">
                  {formatKm(leg.meters)} · ~{leg.minutes} min · {formatPeso(leg.fare)}
                </div>
              </div>
            )}
          </li>
        ))}
      </ol>

      {rides.length > 0 && (
        <p className="mt-3 text-[11px] text-slate-400">Students, seniors and PWDs pay 20% less with a valid ID.</p>
      )}
    </div>
  );
}
