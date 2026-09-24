import type { RouteData } from '@/types/route';
import type { RouteMode, RouteView } from '@/features/routes/lib/routeView';

interface RouteOptionCardProps {
  route: RouteData;
  view: RouteView;
  mode: RouteMode;
  selected?: boolean;
  onClick?: () => void;
}

export default function RouteOptionCard({ route, view, mode, selected, onClick }: RouteOptionCardProps) {
  return (
    <div
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
        selected
          ? 'border-slate-900 bg-white shadow-md'
          : 'border-slate-200 hover:border-slate-300 bg-white'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <span className="inline-block px-2 py-1 text-xs font-bold rounded-full mb-1 bg-slate-100 text-slate-900">
            {mode === 'loop' ? 'Loop' : 'One way'}
          </span>
          <h3 className="font-bold text-slate-900 text-sm">
            <span className="text-slate-400">#{route.routeNumber}</span> {route.title}
          </h3>
          <p className="mt-1 text-xs font-semibold text-slate-600">
            {route.localNames.length > 0
              ? `Also known as ${route.localNames.join(' · ')}`
              : 'New route under the 2024 route plan'}
          </p>
          <p className="mt-1 text-xs text-slate-500">{route.description}</p>
        </div>
        <div className="ml-2 text-right">
          <div className="text-lg font-black text-slate-900">{view.duration}</div>
        </div>
      </div>

      <p className="mb-3 text-xs font-semibold text-slate-700">
        {view.terminal} → {view.farEnd}
        {mode === 'loop' ? ` → back to ${view.terminal}` : ''}
      </p>

      <div className="flex items-center justify-between py-2 border-t border-slate-100">
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-wide">
            {mode === 'loop' ? 'Fare per ride' : 'Fare'}
          </div>
          <div className="font-black text-slate-900">{view.fare}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400 uppercase tracking-wide">Distance</div>
          <div className="font-black text-slate-900">{view.distance}</div>
        </div>
      </div>
    </div>
  );
}
