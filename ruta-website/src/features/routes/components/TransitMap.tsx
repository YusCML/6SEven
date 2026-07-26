import dynamic from 'next/dynamic';
import type { TransitIncident } from '@/features/routes/data/transitRoutes';

export type TransitMapProps = {
  variant: 'preview' | 'planner' | 'dashboard';
  selectedRouteId?: string;
  incidents?: TransitIncident[];
  showIncidents?: boolean;
  className?: string;
};

const TransitMapClient = dynamic<TransitMapProps>(() => import('./TransitMapClient'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-80 w-full animate-pulse items-center justify-center bg-slate-200 text-sm font-medium text-slate-500">
      Loading map...
    </div>
  ),
});

export default function TransitMap(props: TransitMapProps) {
  return <TransitMapClient {...props} />;
}
