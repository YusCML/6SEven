import { useState } from 'react';
import FormField from '@/components/ui/FormField';
import RouteOptionCard from '@/features/routes/components/RouteOptionCard';
import TransitMap from '@/features/routes/components/TransitMap';
import { transitRoutes } from '@/features/routes/data/transitRoutes';

export default function RouteExplorer() {
  const [selectedRouteId, setSelectedRouteId] = useState(transitRoutes[0].id);

  return (
    <div className="flex min-h-[calc(100vh-73px)] flex-col md:h-[calc(100vh-73px)] md:flex-row md:overflow-hidden">
      <div className="flex w-full flex-col justify-between border-r border-slate-200 bg-white p-6 md:w-96 md:overflow-y-auto">
        <div>
          <h2 className="mb-4 text-xl font-bold text-slate-900">Route Finder</h2>
          <div className="mb-6 space-y-3">
            <FormField
              label="Origin"
              type="text"
              defaultValue="Quezon City"
              labelClassName="text-xs font-semibold text-slate-400"
              inputClassName="w-full border p-2 rounded text-sm bg-slate-50"
            />
            <FormField
              label="Destination"
              type="text"
              defaultValue="Makati CBD"
              labelClassName="text-xs font-semibold text-slate-400"
              inputClassName="w-full border p-2 rounded text-sm bg-slate-50"
            />
          </div>
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-400">Suggested Routes</h3>
          <div className="space-y-2">
            {transitRoutes.map((route) => (
              <RouteOptionCard
                key={route.id}
                selected={route.id === selectedRouteId}
                title={route.title}
                duration={route.duration}
                description={route.description}
                traffic={route.traffic}
                color={route.color}
                onClick={() => setSelectedRouteId(route.id)}
              />
            ))}
          </div>
        </div>
        <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 text-center">SakayMetrics Router Engine v2.1</div>
      </div>
      <div className="relative min-h-[28rem] flex-grow bg-slate-100 md:min-h-0">
        <TransitMap variant="planner" selectedRouteId={selectedRouteId} />
      </div>
    </div>
  );
}
