import { useState } from 'react';
import dynamic from 'next/dynamic';
import PageMeta from '@/components/PageMeta';
import TextField from '@/components/ui/TextField';
import MapLegend from '@/features/routes/components/Maplegend';
import RouteOptionCard from '@/features/routes/components/RouteOptionCard';
import type { RouteData } from '@/types/route';

// Leaflet touches `window`, so it must load client-side only
const RouteMap = dynamic(() => import('@/features/routes/components/RouteMap'), {
  ssr: false,
  loading: () => <p className="text-slate-400 font-mono text-sm">Loading map…</p>,
});

const ROUTES: RouteData[] = [
  {
    id: 'jaro-business-park',
    title: 'Jaro - Iloilo Business Park',
    duration: '18 mins',
    description: 'Via Diversion Road, light traffic most hours.',
    color: '#16a34a',
    path: [
      [10.7307, 122.5634],
      [10.7265, 122.5580],
      [10.7238, 122.5510],
      [10.7215, 122.5445],
    ],
  },
  {
    id: 'smcity-robinsons',
    title: 'SM City Iloilo - Robinsons Place',
    duration: '12 mins',
    description: 'Via General Luna St, moderate traffic near downtown.',
    color: '#f59e0b',
    path: [
      [10.6994, 122.5645],
      [10.6978, 122.5680],
      [10.6963, 122.5726],
    ],
  },
];

export default function RouteExplorer() {
  const [selectedRouteId, setSelectedRouteId] = useState(ROUTES[0].id);

  return (
    <div className="h-[calc(100vh-73px)] flex flex-col md:flex-row overflow-hidden">
      <PageMeta title="Routes" description="Compare transit routes across Iloilo City and pick the fastest way to your destination." />
      <div className="w-full md:w-96 bg-white border-r border-slate-200 p-6 overflow-y-auto flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Route Finder</h2>
          <div className="space-y-3 mb-6">
            <TextField label="Origin" type="text" defaultValue="Jaro, Iloilo City" />
            <TextField label="Destination" type="text" defaultValue="Iloilo Business Park" />
          </div>
          <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-2">Suggested Routes</h3>
          <div className="space-y-2">
            {ROUTES.map((route) => (
              <RouteOptionCard
                key={route.id}
                selected={route.id === selectedRouteId}
                title={route.title}
                duration={route.duration}
                description={route.description}
                onClick={() => setSelectedRouteId(route.id)}
              />
            ))}
          </div>
        </div>
        <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 text-center">
          SakayMetrics Router Engine v2.1
        </div>
      </div>
      <div className="flex-grow bg-slate-100 relative">
        <MapLegend />
        <RouteMap routes={ROUTES} selectedRouteId={selectedRouteId} />
      </div>
    </div>
  );
}