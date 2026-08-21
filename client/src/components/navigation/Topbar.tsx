import { useRouter } from 'next/router';
import AccountMenu from './AccountMenu';

const TITLES: Record<string, string> = {
  '/home': 'Home',
  '/routes': 'Route Planner',
  '/dashboard': 'Incidents',
  '/hotspot': 'Hotspot',
  '/commuter-guide': 'Commuter Guide',
  '/about-us': 'About Us',
  '/dashboard/profile': 'Profile',
  '/dashboard/settings': 'Settings',
};

export default function Topbar() {
  const { pathname } = useRouter();
  const title = TITLES[pathname] ?? 'RUTA';

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white">
      <div className="flex h-20 items-center justify-between gap-6 px-6">
        <h1 className="truncate text-xl font-extrabold tracking-tight text-slate-900">{title}</h1>

        <AccountMenu />
      </div>
    </header>
  );
}
