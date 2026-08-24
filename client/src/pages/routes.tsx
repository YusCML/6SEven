import { useState } from 'react';
import dynamic from 'next/dynamic';
import PageMeta from '@/components/PageMeta';
import TextField from '@/components/ui/TextField';
import MapLegend from '@/features/routes/components/MapLegend';
import RouteOptionCard from '@/features/routes/components/RouteOptionCard';
import { useRoutes } from '@/hooks/useRoutes';

const RouteMap = dynamic(() => import('@/features/routes/components/RouteMap'), {
  ssr: false,
  loading: () => <p className="text-slate-400 font-mono text-sm">Loading map…</p>,
});

type FilterTab = 'recommended';

export default function RouteExplorer() {
  const { routes, loading, error } = useRoutes();
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [filterTab, setFilterTab] = useState<FilterTab>('recommended');

  const activeId = selectedRouteId ?? routes[0]?.id ?? null;
  const filteredRoutes = filterTab === 'recommended' ? routes : routes.filter((r) => r.category === filterTab);
  const selectedRoute = routes.find((r) => r.id === activeId);

  if (loading) return <div className="p-6 text-slate-400">Loading routes…</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

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
          <h3 className="font-bold text-sm text-slate-900 mb-3">Recommended Routes</h3>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          <div className="space-y-3 pb-4">
            {filteredRoutes.map((route) => (
              <RouteOptionCard
                key={route.id}
                route={route}
                selected={route.id === activeId}
                onClick={() => setSelectedRouteId(route.id)}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex-grow bg-slate-100 relative">
        <MapLegend />
        {activeId && <RouteMap routes={routes} selectedRouteId={activeId} />}
      </div>
    </div>
  );
}