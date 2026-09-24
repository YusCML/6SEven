import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import PageMeta from '@/components/PageMeta';
import TextField from '@/components/ui/TextField';
import MapLegend from '@/features/routes/components/MapLegend';
import RouteOptionCard from '@/features/routes/components/RouteOptionCard';
import { useRoutes } from '@/hooks/useRoutes';
import type { RouteCategory } from '@/types/route';

const RouteMap = dynamic(() => import('@/features/routes/components/RouteMap'), {
  ssr: false,
  loading: () => <p className="text-slate-400 font-mono text-sm">Loading map…</p>,
});

type FilterTab = 'all' | RouteCategory;

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All Routes' },
  { id: 'recommended', label: 'Recommended' },
  { id: 'loop', label: 'Loop' },
];

export default function RouteExplorer() {
  const { routes, loading, error } = useRoutes();
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [filterTab, setFilterTab] = useState<FilterTab>('all');

  const filteredRoutes = useMemo(
    () => (filterTab === 'all' ? routes : routes.filter((route) => route.category === filterTab)),
    [routes, filterTab],
  );

  const visibleTabs = FILTER_TABS.filter(
    (tab) => tab.id === 'all' || routes.some((route) => route.category === tab.id),
  );

  const activeId =
    filteredRoutes.find((route) => route.id === selectedRouteId)?.id ?? filteredRoutes[0]?.id ?? null;

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
            {loading ? 'Loading routes…' : `${filteredRoutes.length} Routes`}
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-full transition ${
                  filterTab === tab.id
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

          {!loading && !error && filteredRoutes.length === 0 && (
            <p className="py-4 text-sm text-slate-500">No routes in this category yet.</p>
          )}

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
        {activeId && <RouteMap routes={filteredRoutes} selectedRouteId={activeId} />}
      </div>
    </div>
  );
}
