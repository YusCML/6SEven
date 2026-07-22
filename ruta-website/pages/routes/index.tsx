export default function RouteExplorer() {
  return (
    <div className="h-[calc(100vh-73px)] flex flex-col md:flex-row overflow-hidden">
      <div className="w-full md:w-96 bg-white border-r border-slate-200 p-6 overflow-y-auto flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Route Finder</h2>
          <div className="space-y-3 mb-6">
            <div>
              <label className="text-xs font-semibold text-slate-400">Origin</label>
              <input type="text" defaultValue="Quezon City" className="w-full border p-2 rounded text-sm bg-slate-50" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400">Destination</label>
              <input type="text" defaultValue="Makati CBD" className="w-full border p-2 rounded text-sm bg-slate-50" />
            </div>
          </div>
          
          <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-2">Suggested Routes</h3>
          <div className="space-y-2">
            <div className="p-3 border-2 border-blue-500 bg-blue-50/50 rounded-lg cursor-pointer">
              <div className="flex justify-between font-semibold text-sm"><span>MRT-3 Alternative</span><span className="text-blue-600">42 mins</span></div>
              <p className="text-xs text-slate-500 mt-1">Best efficiency route, slight walking required.</p>
            </div>
            <div className="p-3 border border-slate-200 hover:border-slate-300 rounded-lg cursor-pointer transition">
              <div className="flex justify-between font-semibold text-sm"><span>EDSA Bus Carousel</span><span className="text-slate-600">58 mins</span></div>
              <p className="text-xs text-slate-500 mt-1">Heavy traffic warning near Cubao.</p>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 text-center">
          SakayMetrics Router Engine v2.1
        </div>
      </div>

      <div className="flex-grow bg-slate-100 relative flex items-center justify-center">
        <div className="absolute top-4 right-4 bg-white shadow px-3 py-2 rounded-md text-xs font-medium flex gap-2">
          <span className="flex items-center gap-1 text-green-600">● Light</span>
          <span className="flex items-center gap-1 text-amber-500">● Moderate</span>
          <span className="flex items-center gap-1 text-red-500">● Heavy</span>
        </div>
        <p className="text-slate-400 font-mono text-sm">[Leaflet / Mapbox Map Canvas Container]</p>
      </div>
    </div>
  );
}
