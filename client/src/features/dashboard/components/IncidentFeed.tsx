type Incident = { id: number; route: string; type: string; status: string; time: string };
type IncidentFeedProps = { incidents: Incident[] };

export default function IncidentFeed({ incidents }: IncidentFeedProps) {
  return <div className="divide-y divide-slate-100">{incidents.map((incident) => <div key={incident.id} className="py-4 flex justify-between items-center"><div><h4 className="font-semibold text-slate-800">{incident.route}</h4><p className="text-sm text-slate-500">{incident.type} • {incident.time}</p></div><span className={`px-2 py-1 text-xs font-bold rounded ${incident.status === 'Active' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>{incident.status}</span></div>)}</div>;
}
