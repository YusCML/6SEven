import Link from 'next/link';
import { useRouter } from 'next/router';
import { LogInIcon, LogOutIcon, MapPinIcon, SlidersIcon, UserIcon } from '@/components/icons';
import useSession from '@/hooks/useSession';

type AccountNavigationProps = {
  active: 'profile' | 'settings';
  title: string;
  showSignOut?: boolean;
};

const items = [
  { key: 'profile', href: '/dashboard/profile', label: 'Account Profile', Icon: UserIcon },
  { key: 'routes', href: '/routes', label: 'Saved Routes', Icon: MapPinIcon },
  { key: 'settings', href: '/dashboard/settings', label: 'Settings', Icon: SlidersIcon },
] as const;

const base = 'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition';
const inactive = `${base} text-slate-600 hover:bg-slate-50`;
const active = `${base} bg-blue-50 text-blue-700`;

export default function AccountNavigation({ active: current, title, showSignOut = false }: AccountNavigationProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, signOut } = useSession();

  const handleSignOut = async () => {
    await signOut();
    router.push('/home');
  };

  return (
    <nav className="rounded-lg border border-slate-100 bg-white p-4" aria-label={title}>
      <h2 className="px-3 pb-3 text-xs font-bold uppercase tracking-wider text-slate-400">{title}</h2>

      <ul className="space-y-1">
        {items.map(({ key, href, label, Icon }) => (
          <li key={key}>
            <Link href={href} className={key === current ? active : inactive}>
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {showSignOut && !isLoading ? (
        <div className="mt-3 border-t border-slate-100 pt-3">
          {isAuthenticated ? (
            <button type="button" onClick={handleSignOut} className={`${base} w-full text-red-600 hover:bg-red-50`}>
              <LogOutIcon className="h-4 w-4 shrink-0" />
              Sign Out
            </button>
          ) : (
            <Link href="/auth/login" className={`${base} text-blue-600 hover:bg-blue-50`}>
              <LogInIcon className="h-4 w-4 shrink-0" />
              Sign In
            </Link>
          )}
        </div>
      ) : null}
    </nav>
  );
}
