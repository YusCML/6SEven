import Link from 'next/link';
import { useRouter } from 'next/router';
import useSession from '@/hooks/useSession';

const navigationItems = [
  { href: '/home', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/routes', label: 'Routes' },
  { href: '/commuter_guide', label: 'Commuter Guide' },
  { href: '/about_us', label: 'About' },
];

export default function Navbar() {
  const router = useRouter();
  const { isAuthenticated, isLoading, signOut } = useSession();

  const handleSignOut = async () => {
    await signOut();
    router.push('/home');
  };

  return (
    <header className="sticky top-0 z-50 flex flex-col items-center gap-4 border-b border-slate-200 bg-white px-4 py-4 md:flex-row md:justify-between md:px-6">
      <div className="flex items-center gap-2 text-center text-xl font-bold text-blue-600">
        <span>🌐 RUTA / SakayMetrics</span>
      </div>
      <nav className="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-medium text-slate-600 md:w-auto md:justify-end md:gap-6">
        {navigationItems.map((item) => (
          <Link key={item.href} href={item.href} className="hover:text-blue-600">
            {item.label}
          </Link>
        ))}

        <Link
          href="/dashboard/profile"
          className="hover:text-blue-600 font-semibold text-blue-600 border border-blue-600 px-3 py-1 rounded-md hover:bg-blue-50"
        >
          Profile
        </Link>

        {/* Rendered only once the session resolves, so the controls never flip after paint. */}
        {isLoading ? null : isAuthenticated ? (
          <button
            type="button"
            onClick={handleSignOut}
            className="text-slate-500 hover:text-red-600 font-medium cursor-pointer"
          >
            Sign Out
          </button>
        ) : (
          <Link href="/auth/login" className="hover:text-blue-600">
            Log In
          </Link>
        )}
      </nav>
    </header>
  );
}
