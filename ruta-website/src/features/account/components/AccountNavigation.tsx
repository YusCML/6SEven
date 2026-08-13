import Link from 'next/link';
import { useRouter } from 'next/router';
import useSession from '@/hooks/useSession';

type AccountNavigationProps = {
  active: 'profile' | 'settings';
  title: string;
  showSignOut?: boolean;
};

const inactiveClassName = 'flex items-center gap-2 p-2 rounded text-slate-600 hover:bg-slate-50';
const activeClassName = 'flex items-center gap-2 p-2 rounded bg-blue-50 text-blue-700';

export default function AccountNavigation({ active, title, showSignOut = false }: AccountNavigationProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, signOut } = useSession();

  const handleSignOut = async () => {
    await signOut();
    router.push('/home');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider">{title}</h3>
      <ul className="space-y-1 text-sm font-medium">
        <li>
          <Link href="/dashboard/profile" className={active === 'profile' ? activeClassName : inactiveClassName}>
            👤 Account Profile
          </Link>
        </li>
        <li>
          <Link href="/routes" className={inactiveClassName}>📍 Saved Routes</Link>
        </li>
        <li>
          <Link href="/dashboard/settings" className={active === 'settings' ? activeClassName : inactiveClassName}>
            {active === 'settings' ? '⚙️ Platform Settings' : '🛡️ Security & Privacy'}
          </Link>
        </li>

        {showSignOut && !isLoading ? (
          <li>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full text-left flex items-center gap-2 p-2 rounded text-red-600 hover:bg-red-50 mt-4 border-t border-slate-100 pt-3 cursor-pointer"
              >
                🚪 Sign Out
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-2 p-2 rounded text-blue-600 hover:bg-blue-50 mt-4 border-t border-slate-100 pt-3"
              >
                🔑 Sign In
              </Link>
            )}
          </li>
        ) : null}
      </ul>
    </div>
  );
}
