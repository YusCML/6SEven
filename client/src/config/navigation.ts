import {
  BookIcon,
  BookmarkIcon,
  CrownIcon,
  HomeIcon,
  MapPinIcon,
  RouteIcon,
  SettingsIcon,
  UserIcon,
  type IconComponent,
} from '@/components/icons';

export type NavLink = {
  href: string;
  label: string;
  title: string;
  Icon?: IconComponent;
};

export const PAGES = {
  home: { href: '/home', label: 'Home', title: 'Home', Icon: HomeIcon },
  routes: { href: '/routes', label: 'Routes', title: 'Route Planner', Icon: RouteIcon },
  hotspot: { href: '/hotspot', label: 'Hotspot', title: 'Hotspot', Icon: MapPinIcon },
  guide: { href: '/commuter-guide', label: 'Guide', title: 'Commuter Guide', Icon: BookIcon },
  upgrade: { href: '/upgrade', label: 'Upgrade', title: 'RUTA Plus', Icon: CrownIcon },
  about: { href: '/about-us', label: 'About Us', title: 'About Us' },
  profile: { href: '/dashboard/profile', label: 'Profile', title: 'Profile', Icon: UserIcon },
  settings: { href: '/dashboard/settings', label: 'Settings', title: 'Settings', Icon: SettingsIcon },
  login: { href: '/auth/login', label: 'Sign In', title: 'Sign In' },
  register: { href: '/auth/register', label: 'Create an account', title: 'Create Account' },
} satisfies Record<string, NavLink>;

export const MAIN_NAV = [PAGES.home, PAGES.routes, PAGES.hotspot, PAGES.guide];

export const ACCOUNT_NAV = [
  PAGES.profile,
  { ...PAGES.routes, label: 'Saved Routes', Icon: MapPinIcon },
  { ...PAGES.hotspot, label: 'My Hotspots', Icon: BookmarkIcon },
  PAGES.settings,
];

export const FOOTER_NAV = [
  { title: 'Explore', links: MAIN_NAV },
  { title: 'Account', links: [PAGES.profile, PAGES.settings, PAGES.upgrade, PAGES.about] },
];

export function pageTitle(pathname: string): string {
  return Object.values(PAGES).find((page) => page.href === pathname)?.title ?? 'RUTA';
}
