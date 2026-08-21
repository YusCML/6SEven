import Link from 'next/link';
import { useRouter } from 'next/router';
import RutaWordmark from '@/components/brand/RutaWordmark';
import {
  AlertTriangleIcon,
  BookIcon,
  CrownIcon,
  HomeIcon,
  MapPinIcon,
  MenuIcon,
  RouteIcon,
} from '@/components/icons';

export const NAV_ITEMS = [
  { href: '/home', label: 'Home', Icon: HomeIcon },
  { href: '/routes', label: 'Routes', Icon: RouteIcon },
  { href: '/dashboard', label: 'Incidents', Icon: AlertTriangleIcon },
  { href: '/hotspot', label: 'Hotspot', Icon: MapPinIcon },
  { href: '/commuter-guide', label: 'Guide', Icon: BookIcon },
] as const;

type SidebarProps = {
  open: boolean;
  onToggle: () => void;
};

export default function Sidebar({ open, onToggle }: SidebarProps) {
  const { pathname } = useRouter();

  return (
    <aside
      className={`sticky top-0 flex h-screen shrink-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-200 ${
        open ? 'w-60' : 'w-[4.5rem]'
      }`}
    >
      <div className={`flex h-20 items-center gap-3 px-4 ${open ? '' : 'justify-center'}`}>
        <button
          type="button"
          onClick={onToggle}
          aria-label={open ? 'Collapse navigation' : 'Expand navigation'}
          aria-expanded={open}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-900 text-white transition hover:bg-slate-700"
        >
          <MenuIcon className="h-5 w-5" />
        </button>

        {open ? <RutaWordmark /> : null}
      </div>

      <nav aria-label="Main" className="flex-1 px-3 py-2">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const isActive = pathname === href;

            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  title={open ? undefined : label}
                  className={`flex h-11 items-center gap-3 rounded-lg text-sm font-bold transition ${
                    open ? 'px-3' : 'justify-center px-0'
                  } ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {open ? <span className="truncate">{label}</span> : <span className="sr-only">{label}</span>}
                </Link>
              </li>
            );
          })}

          <li>
            <Link
              href="/upgrade"
              aria-current={pathname === '/upgrade' ? 'page' : undefined}
              title={open ? undefined : 'Upgrade'}
              className={`flex h-11 items-center gap-3 rounded-lg text-sm font-bold transition ${
                open ? 'px-3' : 'justify-center px-0'
              } ${pathname === '/upgrade' ? 'bg-amber-50 text-amber-700' : 'text-amber-600 hover:bg-amber-50'}`}
            >
              <CrownIcon className="h-5 w-5 shrink-0" />
              {open ? <span className="truncate">Upgrade</span> : <span className="sr-only">Upgrade</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
