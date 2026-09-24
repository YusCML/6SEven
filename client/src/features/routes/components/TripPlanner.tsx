import TextField from '@/components/ui/TextField';
import type { Pin } from '@/features/routes/lib/landmarks';

export type PinTarget = 'origin' | 'destination';

interface TripPlannerProps {
  origin: Pin | null;
  destination: Pin | null;
  picking: PinTarget | null;
  notice: string | null;
  onPick: (target: PinTarget) => void;
  onSwap: () => void;
  onClear: () => void;
}

function PickButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-2.5 py-1 text-xs font-bold transition ${
        active ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
    >
      {active ? 'Click the map…' : 'Pick on map'}
    </button>
  );
}

export default function TripPlanner({ origin, destination, picking, notice, onPick, onSwap, onClear }: TripPlannerProps) {
  const hint =
    picking === 'origin'
      ? 'Click the map where your trip starts.'
      : picking === 'destination'
        ? 'Now click the map where you are going.'
        : null;

  return (
    <div className="space-y-3">
      <TextField
        label="Origin"
        type="text"
        readOnly
        value={origin?.label ?? ''}
        placeholder="Pin your starting point on the map"
        labelAction={<PickButton active={picking === 'origin'} onClick={() => onPick('origin')} />}
      />
      <TextField
        label="Destination"
        type="text"
        readOnly
        value={destination?.label ?? ''}
        placeholder="Pin where you are going on the map"
        labelAction={<PickButton active={picking === 'destination'} onClick={() => onPick('destination')} />}
      />

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onSwap}
          disabled={!origin && !destination}
          className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-200 disabled:opacity-50"
        >
          Swap
        </button>
        <button
          type="button"
          onClick={onClear}
          disabled={!origin && !destination}
          className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-200 disabled:opacity-50"
        >
          Clear
        </button>
      </div>

      {hint && <p className="text-xs font-semibold text-slate-500">{hint}</p>}
      {notice && <p className="text-xs font-semibold text-red-600">{notice}</p>}
    </div>
  );
}
