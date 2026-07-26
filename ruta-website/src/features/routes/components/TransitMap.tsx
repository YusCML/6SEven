import dynamic from 'next/dynamic';
<<<<<<< Updated upstream
import type { TransitIncident } from '@/features/routes/data/transitRoutes';

export type TransitMapProps = {
  variant: 'preview' | 'planner' | 'dashboard';
  selectedRouteId?: string;
  incidents?: TransitIncident[];
  showIncidents?: boolean;
=======

export type TransitMapProps = {
  variant: 'preview' | 'planner';
  selectedRouteId?: string;
>>>>>>> Stashed changes
  className?: string;
};

const TransitMapClient = dynamic<TransitMapProps>(() => import('./TransitMapClient'), {
  ssr: false,
  loading: () => (
<<<<<<< Updated upstream
    <div className="flex h-full min-h-80 w-full animate-pulse items-center justify-center bg-slate-200 text-sm font-medium text-slate-500">
=======
    <div className="h-full min-h-80 w-full animate-pulse bg-slate-200 text-sm font-medium text-slate-500 flex items-center justify-center">
>>>>>>> Stashed changes
      Loading map...
    </div>
  ),
});

export default function TransitMap(props: TransitMapProps) {
  return <TransitMapClient {...props} />;
}
