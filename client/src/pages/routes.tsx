import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import PageMeta from '@/components/PageMeta';
import TextField from '@/components/ui/TextField';
import MapLegend from '@/features/routes/components/MapLegend';
import RouteOptionCard from '@/features/routes/components/RouteOptionCard';
import { routeView, type RouteMode } from '@/features/routes/lib/routeView';
import { useRoutes } from '@/hooks/useRoutes';

const RouteMap = dynamic(() => import('@/features/routes/components/RouteMap'), {
  ssr: false,
  loading: () => <p className="text-slate-400 font-mono text-sm">Loading map…</p>,
});

const MODE_TABS: { id: RouteMode; label: string }[] = [
  { id: 'loop', label: 'Loop' },
  { id: 'oneWay', label: 'One way' },
];

export default function RouteExplorer() {
  const { routes, loading, error } = useRoutes();
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [mode, setMode] = useState<RouteMode>('loop');

  const views = useMemo(() => new Map(routes.map((route) => [route.id, routeView(route, mode)])), [routes, mode]);

  const activeRoute = routes.find((route) => route.id === selectedRouteId) ?? routes[0] ?? null;

  return (
    <div className="h-[calc(100vh-73px)] flex flex-col md:flex-row overflow-hidden">
      <PageMeta title="Routes" description="Compare transit routes across Iloilo City and pick the fastest way to your destination." />
      <div className="w-full md:w-96 bg-white border-r border-slate-200 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <div className="space-y-3">
            <TextField label="Origin" type="text" defaultValue="Plaza Jaro" />
            <TextField label="Destination" type="text" defaultValue="CPU Main Gate" />
          </div>
        </div>

        <div className="px-6 pt-4 pb-2">
          <h3 className="font-bold text-sm text-slate-900 mb-3">
            {loading ? 'Loading routes…' : `${routes.length} Routes`}
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {MODE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMode(tab.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-full transition ${
                  mode === tab.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {error && (
            <p className="py-4 text-sm text-red-600">
              Could not load routes: {error}
            </p>
          )}

          <div className="space-y-3 pb-4">
            {routes.map((route) => {
              const view = views.get(route.id);
              return view ? (
                <RouteOptionCard
                  key={route.id}
                  route={route}
                  view={view}
                  mode={mode}
                  selected={route.id === activeRoute?.id}
                  onClick={() => setSelectedRouteId(route.id)}
                />
              ) : null;
            })}
          </div>
        </div>
      </div>
      <div className="flex-grow bg-slate-100 relative">
        <MapLegend />
        {activeRoute && (
          <RouteMap view={views.get(activeRoute.id) ?? null} color={activeRoute.color} title={activeRoute.title} />
        )}
      </div>
    </div>
  );
}
