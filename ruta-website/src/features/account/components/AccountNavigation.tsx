import Link from 'next/link';
import Panel from '@/components/ui/Panel';

type AccountNavigationProps = {
  active: 'profile' | 'settings';
  title: string;
  showSignOut?: boolean;
};

const inactiveClassName = 'flex items-center gap-2 p-2 rounded text-slate-600 hover:bg-slate-50';
const activeClassName = 'flex items-center gap-2 p-2 rounded bg-blue-50 text-blue-700';

export default function AccountNavigation({ active, title, showSignOut = false }: AccountNavigationProps) {
  return (
    <Panel className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider">{title}</h3>
      <ul className="space-y-1 text-sm font-medium">
        <li><Link href="/dashboard/profile" className={active === 'profile' ? activeClassName : inactiveClassName}>👤 Account Profile</Link></li>
        {active === 'profile' ? <li><Link href="/routes" className={inactiveClassName}>📍 Saved Routes</Link></li> : <li><a href="#" className={inactiveClassName}>📍 Saved Routes</a></li>}
        <li><Link href="/dashboard/settings" className={active === 'settings' ? activeClassName : inactiveClassName}>{active === 'settings' ? '⚙️ Platform Settings' : '🛡️ Security & Privacy'}</Link></li>
        {showSignOut ? <li><a href="#" className="flex items-center gap-2 p-2 rounded text-red-600 hover:bg-red-50 mt-4 border-t border-slate-100 pt-3">🚪 Sign Out</a></li> : null}
      </ul>
    </Panel>
  );
}
