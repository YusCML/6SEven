import { useState } from 'react';
import Button from '@/components/ui/Button';
import Panel from '@/components/ui/Panel';
import IncidentFeed from '@/features/dashboard/components/IncidentFeed';
import MetricCard from '@/features/dashboard/components/MetricCard';

export default function Dashboard() {
  const [incidents] = useState([{ id: 1, route: 'EDSA Carousel', type: 'Heavy Traffic', status: 'Active', time: '5 mins ago' }, { id: 2, route: 'LRT-2 Pureza', type: 'Technical Issue', status: 'Resolved', time: '1 hr ago' }, { id: 3, route: 'MRT-3 Ayala', type: 'Long Lines', status: 'Active', time: '12 mins ago' }]);
  return <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8"><div className="lg:col-span-2 space-y-6"><Panel className="bg-white p-6 rounded-xl border border-slate-200"><h2 className="text-xl font-bold mb-4">Incident Reporting Overview</h2><div className="grid grid-cols-3 gap-4 mb-6"><MetricCard value="4" label="Active Incidents" tone="red" /><MetricCard value="12" label="Heavy Congestion" tone="amber" /><MetricCard value="92%" label="Routes Operational" tone="green" /></div></Panel><Panel className="bg-white p-6 rounded-xl border border-slate-200"><h3 className="font-bold text-lg mb-4">Commuter Live Feed</h3><IncidentFeed incidents={incidents} /></Panel></div><div className="space-y-6"><Panel className="bg-slate-900 text-white p-6 rounded-xl relative overflow-hidden h-72 flex flex-col justify-between"><div><h3 className="font-bold text-lg">Live Map View</h3><p className="text-xs text-slate-400">Metro Manila Transit Lines</p></div><div className="text-center text-xs border border-slate-700 p-4 rounded bg-slate-800/50 backdrop-blur">📍 Map layers initialized (MRT, LRT, Bus Routes)</div></Panel><Button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium p-4 rounded-xl shadow transition">⚠️ Report New Incident</Button></div></div>;
}
