import type { RouteData } from '@/types/route';

interface RouteOptionCardProps {
  route: RouteData;
  selected?: boolean;
  onClick?: () => void;
}

const getModeIcon = (mode: string) => {
  const icons: Record<string, string> = {
    Jeepney: '🚐',
    Tricycle: '🛺',
    MRT: '🚇',
    Bus: '🚌',
    Walk: '🚶',
  };
  return icons[mode] || '🚌';
};

export default function RouteOptionCard({ route, selected, onClick }: RouteOptionCardProps) {
  return (
    <div
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
        selected
          ? 'border-blue-500 bg-white shadow-md'
          : 'border-slate-200 hover:border-slate-300 bg-white'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          {route.category && (
            <span className="inline-block px-2 py-1 text-xs font-bold rounded-full mb-1 bg-blue-100 text-blue-600">
              {route.category === 'fastest' && '⚡ FASTEST'}
              {route.category === 'cheapest' && '💰 CHEAPEST'}
              {route.category === 'least-walk' && '🚶 LEAST WALK'}
            </span>
          )}
          <h3 className="font-bold text-slate-900 text-sm">{route.title}</h3>
        </div>
        <div className="ml-2 text-right">
          <div className="text-lg font-black text-slate-900">{route.duration}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {route.segments.map((segment, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded"
          >
            {getModeIcon(segment.mode)} {segment.mode}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mb-3 py-2 border-t border-b border-slate-100">
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-wide">Total Fare</div>
          <div className="font-black text-slate-900">{route.fare}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-wide">Distance</div>
          <div className="font-black text-slate-900">{route.distance}</div>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        {route.segments.map((segment, idx) => (
          <div key={idx} className="flex gap-2 text-xs">
            <span className="font-semibold text-slate-900 min-w-12">{idx + 1}.</span>
            <div className="flex-1">
              <div className="font-medium text-slate-900">
                {segment.mode} {segment.distance && `(${segment.distance})`}
              </div>
              <div className="text-slate-500">
                {segment.from} → {segment.to}
              </div>
              <div className="text-slate-400">~{segment.duration}</div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="w-full py-2.5 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition"
        >
          ▶ Start Navigation
        </button>
      )}
    </div>
  );
}
