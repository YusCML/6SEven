import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ComponentType, SVGProps } from 'react';
import RutaWordmark from '@/components/brand/RutaWordmark';
import { BookIcon, CrownIcon, HomeIcon, MapPinIcon, RouteIcon, RutaMarkIcon } from '@/components/icons';

export const NAV_ITEMS = [
  { href: '/home', label: 'Home', Icon: HomeIcon },
  { href: '/routes', label: 'Routes', Icon: RouteIcon },
  { href: '/hotspot', label: 'Hotspot', Icon: MapPinIcon },
  { href: '/commuter-guide', label: 'Guide', Icon: BookIcon },
] as const;

function Tooltip({ label }: { label: string }) {
  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute left-full z-50 ml-3 origin-left scale-95 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-md transition duration-150 group-hover:scale-100 group-hover:opacity-100"
    >
      {label}
    </span>
  );
}

type NavItemProps = {
  href: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  open: boolean;
  isActive: boolean;
  tone?: 'default' | 'accent';
};

function NavItem({ href, label, Icon, open, isActive, tone = 'default' }: NavItemProps) {
  const palette =
    tone === 'accent'
      ? isActive
        ? 'bg-amber-50 text-amber-700'
        : 'text-amber-600 hover:bg-amber-50'
      : isActive
        ? 'bg-slate-100 text-slate-900'
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900';

  return (
    <li>
      <Link
        href={href}
        aria-current={isActive ? 'page' : undefined}
        className={`group relative flex h-11 items-center gap-3 rounded-lg text-sm font-bold transition ${
          open ? 'px-3' : 'justify-center px-0'
        } ${palette}`}
      >
        <Icon className="h-5 w-5 shrink-0" />
        {open ? <span className="truncate">{label}</span> : <span className="sr-only">{label}</span>}
        {open ? null : <Tooltip label={label} />}
      </Link>
    </li>
  );
}

type SidebarProps = {
  open: boolean;
  onToggle: () => void;
};

export default function Sidebar({ open, onToggle }: SidebarProps) {
  const { pathname } = useRouter();

  return (
    <aside
      className={`sticky top-0 z-30 flex h-screen shrink-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-200 ${
        open ? 'w-60' : 'w-[4.5rem]'
      }`}
    >
      <div className={`flex h-24 items-center gap-3 px-4 ${open ? '' : 'justify-center'}`}>
        <button
          type="button"
          onClick={onToggle}
          aria-label={open ? 'Collapse navigation' : 'Expand navigation'}
          aria-expanded={open}
          className="group relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-900 text-white transition hover:bg-slate-700"
        >
          <RutaMarkIcon className="h-5 w-5" />
          {open ? null : <Tooltip label="Expand" />}
        </button>

        {open ? <RutaWordmark /> : null}
      </div>

      <nav aria-label="Main" className="flex-1 px-3 py-2">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ href, label, Icon }) => (
            <NavItem key={href} href={href} label={label} Icon={Icon} open={open} isActive={pathname === href} />
          ))}

          <NavItem
            href="/upgrade"
            label="Upgrade"
            Icon={CrownIcon}
            open={open}
            isActive={pathname === '/upgrade'}
            tone="accent"
          />
        </ul>
      </nav>
    </aside>
  );
}
