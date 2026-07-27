import Button from '@/components/ui/Button';
import Panel from '@/components/ui/Panel';
import IncidentFeed from '@/features/dashboard/components/IncidentFeed';
import MetricCard from '@/features/dashboard/components/MetricCard';
import TransitMap from '@/features/routes/components/TransitMap';
import { liveIncidents, transitRoutes } from '@/features/routes/data/transitRoutes';

export default function Dashboard() {
  const activeIncidents = liveIncidents.filter((incident) => incident.status === 'Active');
  const heavyIncidents = liveIncidents.filter((incident) => incident.severity === 'Heavy');
  const operationalRate = `${Math.round(((transitRoutes.length - heavyIncidents.length) / transitRoutes.length) * 100)}%`;

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Panel className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-bold">Incident Reporting Overview</h2>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <MetricCard value={String(activeIncidents.length)} label="Active Incidents" tone="red" />
            <MetricCard value={String(heavyIncidents.length)} label="Heavy Congestion" tone="amber" />
            <MetricCard value={operationalRate} label="Routes Operational" tone="green" />
          </div>
        </Panel>

        <Panel className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-lg font-bold">Routes and Live Incident Map</h3>
            <p className="text-sm text-slate-500">Metro Manila routes with active commuter reports.</p>
          </div>
          <div className="h-30rem">
            <TransitMap
              variant="dashboard"
              selectedRouteId={activeIncidents[0]?.routeId}
              incidents={liveIncidents}
              showIncidents
            />
          </div>
        </Panel>
      </div>

      <div className="space-y-6">
        <Panel className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-bold">Commuter Live Feed</h3>
          <IncidentFeed incidents={liveIncidents} />
        </Panel>
        <Button className="w-full rounded-xl bg-red-600 p-4 font-medium text-white shadow transition hover:bg-red-700">
          Report New Incident
        </Button>
      </div>
    </div>
  );
}
