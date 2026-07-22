import FormField from '@/components/ui/FormField';
import MapLegend from '@/features/routes/components/MapLegend';
import RouteOptionCard from '@/features/routes/components/RouteOptionCard';

export default function RouteExplorer() {
  return (
    <div className="h-[calc(100vh-73px)] flex flex-col md:flex-row overflow-hidden">
      <div className="w-full md:w-96 bg-white border-r border-slate-200 p-6 overflow-y-auto flex flex-col justify-between">
        <div><h2 className="text-xl font-bold text-slate-900 mb-4">Route Finder</h2><div className="space-y-3 mb-6"><FormField label="Origin" type="text" defaultValue="Quezon City" labelClassName="text-xs font-semibold text-slate-400" inputClassName="w-full border p-2 rounded text-sm bg-slate-50" /><FormField label="Destination" type="text" defaultValue="Makati CBD" labelClassName="text-xs font-semibold text-slate-400" inputClassName="w-full border p-2 rounded text-sm bg-slate-50" /></div><h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-2">Suggested Routes</h3><div className="space-y-2"><RouteOptionCard selected title="MRT-3 Alternative" duration="42 mins" description="Best efficiency route, slight walking required." /><RouteOptionCard title="EDSA Bus Carousel" duration="58 mins" description="Heavy traffic warning near Cubao." /></div></div>
        <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 text-center">SakayMetrics Router Engine v2.1</div>
      </div>
      <div className="flex-grow bg-slate-100 relative flex items-center justify-center"><MapLegend /><p className="text-slate-400 font-mono text-sm">[Leaflet / Mapbox Map Canvas Container]</p></div>
    </div>
  );
}
