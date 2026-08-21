import PageMeta from '@/components/PageMeta';
import { AlertTriangleIcon, CheckIcon, MapPinIcon, RouteIcon, ShieldCheckIcon } from '@/components/icons';
import CommuteAnalysis, { type DayTrips } from '@/features/account/components/CommuteAnalysis';
import ConnectedAccounts from '@/features/account/components/ConnectedAccounts';
import InformationCard from '@/features/account/components/InformationCard';
import ProfileBreadcrumb from '@/features/account/components/ProfileBreadcrumb';
import StatList from '@/features/account/components/StatList';
import useSession from '@/hooks/useSession';

// Placeholder figures — RUTA does not record trips yet, so nothing here is
// wired to the database. Swap these for real queries once trip logging exists.
const WEEK: DayTrips[] = [
  { day: 'Mon', minutes: 0 },
  { day: 'Tue', minutes: 0 },
  { day: 'Wed', minutes: 0 },
  { day: 'Thu', minutes: 0 },
  { day: 'Fri', minutes: 55 },
  { day: 'Sat', minutes: 0 },
  { day: 'Sun', minutes: 0 },
];

const SAVED = [
  { label: 'Saved Routes', value: 0, icon: <RouteIcon className="h-4 w-4" />, tone: 'blue' as const },
  { label: 'Frequent Stops', value: 0, icon: <MapPinIcon className="h-4 w-4" />, tone: 'amber' as const },
  { label: 'Fare Estimates', value: 0, icon: <ShieldCheckIcon className="h-4 w-4" />, tone: 'slate' as const },
];

const ACTIVITY = [
  { label: 'Trips Completed', value: 0, icon: <CheckIcon className="h-4 w-4" />, tone: 'green' as const },
  { label: 'Incidents Reported', value: 0, icon: <AlertTriangleIcon className="h-4 w-4" />, tone: 'red' as const },
];

export default function UserProfile() {
  const { isAuthenticated } = useSession();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <PageMeta title="Profile" description="Manage your RUTA account details and commute activity." />

      <ProfileBreadcrumb />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <div>
          <InformationCard />
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="mb-4 text-lg font-bold text-slate-900">Analysis</h2>
            <CommuteAnalysis
              streakDays={0}
              minutesOnTransit={isAuthenticated ? 55 : 0}
              week={WEEK}
              activeDay="Fri"
            />
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-slate-900">Saved</h2>
            <StatList items={SAVED} />
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-slate-900">Activity</h2>
            <StatList items={ACTIVITY} />
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-slate-900">Connected Accounts</h2>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <ConnectedAccounts />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
