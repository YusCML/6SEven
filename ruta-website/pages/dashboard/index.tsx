import { useState } from 'react';

export default function Dashboard() {
  const [incidents] = useState([
    { id: 1, route: 'EDSA Carousel', type: 'Heavy Traffic', status: 'Active', time: '5 mins ago' },
    { id: 2, route: 'LRT-2 Pureza', type: 'Technical Issue', status: 'Resolved', time: '1 hr ago' },
    { id: 3, route: 'MRT-3 Ayala', type: 'Long Lines', status: 'Active', time: '12 mins ago' },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h2 className="text-xl font-bold mb-4">Incident Reporting Overview</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-red-50 p-4 rounded-lg border border-red-100"><span className="block text-2xl font-bold text-red-600">4</span><span className="text-xs text-slate-500 font-medium">Active Incidents</span></div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100"><span className="block text-2xl font-bold text-amber-600">12</span><span className="text-xs text-slate-500 font-medium">Heavy Congestion</span></div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100"><span className="block text-2xl font-bold text-green-600">92%</span><span className="text-xs text-slate-500 font-medium">Routes Operational</span></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h3 className="font-bold text-lg mb-4">Commuter Live Feed</h3>
          <div className="divide-y divide-slate-100">
            {incidents.map(inc => (
              <div key={inc.id} className="py-4 flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-slate-800">{inc.route}</h4>
                  <p className="text-sm text-slate-500">{inc.type} • {inc.time}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-bold rounded ${inc.status === 'Active' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>{inc.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-900 text-white p-6 rounded-xl relative overflow-hidden h-72 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg">Live Map View</h3>
            <p className="text-xs text-slate-400">Metro Manila Transit Lines</p>
          </div>
          <div className="text-center text-xs border border-slate-700 p-4 rounded bg-slate-800/50 backdrop-blur">
            📍 Map layers initialized (MRT, LRT, Bus Routes)
          </div>
        </div>

        <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium p-4 rounded-xl shadow transition">
          ⚠️ Report New Incident
        </button>
      </div>
    </div>
  );
}
