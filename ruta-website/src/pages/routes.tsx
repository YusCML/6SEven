import { useState } from 'react';
import dynamic from 'next/dynamic';
import PageMeta from '@/components/PageMeta';
import TextField from '@/components/ui/TextField';
import MapLegend from '@/features/routes/components/MapLegend';
import RouteOptionCard from '@/features/routes/components/RouteOptionCard';
import type { RouteData } from '@/types/route';

const RouteMap = dynamic(() => import('@/features/routes/components/RouteMap'), {
  ssr: false,
  loading: () => <p className="text-slate-400 font-mono text-sm">Loading map…</p>,
});

const ROUTES: RouteData[] = [
  {
    id: 'jaro-business-park',
    title: 'Jaro - Iloilo Business Park',
    duration: '22 mins',
    description: 'Via Diversion Road, light traffic most hours.',
    color: '#16a34a',
    fare: '₱12.00',
    distance: '1.2 km',
    category: 'fastest',
    path: [
      [10.7307, 122.5634],
      [10.7265, 122.5580],
      [10.7238, 122.5510],
      [10.7215, 122.5445],
    ],
    segments: [
      { mode: 'Walk', from: 'Start', to: 'Terminal', duration: '4 mins' },
      { mode: 'Jeepney', from: 'Jaro Terminal', to: 'Diversion Rd', duration: '12 mins' },
      { mode: 'Tricycle', from: 'Diversion Rd', to: 'Business Park', duration: '5 mins', distance: '0.4 km' },
    ],
  },
  {
    id: 'smcity-robinsons',
    title: 'SM City Iloilo - Robinsons Place',
    duration: '30 mins',
    description: 'Via General Luna St, moderate traffic near downtown.',
    color: '#f59e0b',
    fare: '₱18.00',
    distance: '2.1 km',
    category: 'cheapest',
    path: [
      [10.6994, 122.5645],
      [10.6978, 122.5680],
      [10.6963, 122.5726],
    ],
    segments: [
      { mode: 'Walk', from: 'Start', to: 'Terminal', duration: '3 mins' },
      { mode: 'Bus', from: 'Main Terminal', to: 'SM City', duration: '22 mins' },
      { mode: 'Walk', from: 'SM City', to: 'Destination', duration: '5 mins' },
    ],
  },
  {
    id: 'direct-via-commonwealth',
    title: 'Direct via Commonwealth',
    duration: '42 mins',
    description: 'Longer route but fewer transfers.',
    color: '#8b5cf6',
    fare: '₱25.00',
    distance: '3.2 km',
    category: 'least-walk',
    path: [
      [10.7307, 122.5634],
      [10.7200, 122.5500],
      [10.7100, 122.5400],
    ],
    segments: [
      { mode: 'Walk', from: 'Start', to: 'Stop', duration: '2 mins' },
      { mode: 'MRT', from: 'Monumento', to: 'Makati', duration: '35 mins' },
      { mode: 'Walk', from: 'Makati Station', to: 'Destination', duration: '3 mins' },
    ],
  },
];

type FilterTab = 'fastest' | 'cheapest' | 'least-walk' | 'all';

export default function RouteExplorer() {
  const [selectedRouteId, setSelectedRouteId] = useState(ROUTES[0].id);
  const [filterTab, setFilterTab] = useState<FilterTab>('all');

  const filteredRoutes = filterTab === 'all' ? ROUTES : ROUTES.filter((r) => r.category === filterTab);
  const selectedRoute = ROUTES.find((r) => r.id === selectedRouteId);

  return (
    <div className="h-[calc(100vh-73px)] flex flex-col md:flex-row overflow-hidden">
      <PageMeta title="Routes" description="Compare transit routes across Iloilo City and pick the fastest way to your destination." />
      <div className="w-full md:w-96 bg-white border-r border-slate-200 overflow-hidden flex flex-col">
        {/* Search Section */}
        <div className="p-6 border-b border-slate-200">
          <div className="space-y-3">
            <TextField label="Origin" type="text" defaultValue="Plaza Jaro" />
            <TextField label="Destination" type="text" defaultValue="CPU Main Gate" />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 pt-4 pb-2">
          <h3 className="font-bold text-sm text-slate-900 mb-3">Suggested Routes</h3>
          <div className="flex gap-2 mb-4">
            {(['fastest', 'cheapest', 'least-walk'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-3 py-1.5 text-xs font-bold rounded-full transition ${
                  filterTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab === 'fastest' && 'Fastest'}
                {tab === 'cheapest' && 'Cheapest'}
                {tab === 'least-walk' && 'Least Walk'}
              </button>
            ))}
          </div>
        </div>

        {/* Routes List */}
        <div className="flex-1 overflow-y-auto px-6">
          <div className="space-y-3 pb-4">
            {filteredRoutes.map((route) => (
              <RouteOptionCard
                key={route.id}
                route={route}
                selected={route.id === selectedRouteId}
                onClick={() => setSelectedRouteId(route.id)}
              />
            ))}
          </div>
        </div>

        {/* Passenger Info Section */}
        {selectedRoute && (
          <div className="border-t border-slate-200 p-4 bg-slate-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600">🟠</span>
                <span className="text-xs text-slate-600">15 others are currently on this route</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-amber-600">⚠️</span>
                <span className="text-xs text-amber-600 font-medium">Busy Alert: Carry Umbrella</span>
              </div>
              <button className="px-3 py-1.5 text-xs font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800">
                Share Trip
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="flex-grow bg-slate-100 relative">
        <MapLegend />
        <RouteMap routes={ROUTES} selectedRouteId={selectedRouteId} />
      </div>
    </div>
  );
}