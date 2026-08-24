import Link from 'next/link';
import {
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  RutaMarkIcon,
  TwitterXIcon,
} from '@/components/icons';

const GROUPS = [
  {
    title: 'Explore',
    links: [
      { href: '/home', label: 'Home' },
      { href: '/routes', label: 'Routes' },
      { href: '/hotspot', label: 'Hotspot' },
      { href: '/commuter-guide', label: 'Commuter Guide' },
    ],
  },
  {
    title: 'Account',
    links: [
      { href: '/dashboard/profile', label: 'Profile' },
      { href: '/dashboard/settings', label: 'Settings' },
      { href: '/upgrade', label: 'RUTA Plus' },
      { href: '/about-us', label: 'About Us' },
    ],
  },
] as const;

const SOCIALS = [
  { label: 'Facebook', href: '#', Icon: FacebookIcon },
  { label: 'Instagram', href: '#', Icon: InstagramIcon },
  { label: 'X', href: '#', Icon: TwitterXIcon },
] as const;

export default function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-6 pb-10">
      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="grid gap-10 p-8 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Link href="/home" className="flex items-center gap-2.5 transition hover:opacity-75">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-900 text-white">
                <RutaMarkIcon className="h-4 w-4" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-lg font-black uppercase tracking-tight text-slate-900">Ruta</span>
                <span className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.28em] text-slate-400">Iloilo</span>
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-xs font-medium leading-relaxed text-slate-500">
              Compare jeepney, bus and tricycle routes around Iloilo City — fares, travel time and every transfer.
            </p>

            <div className="mt-5 space-y-2 text-xs font-medium text-slate-500">
              <p className="flex items-center gap-2">
                <MailIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                hello@ruta.com
              </p>
              <p className="flex items-center gap-2">
                <MapPinIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                Iloilo City, Philippines
              </p>
            </div>
          </div>

          {GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">{group.title}</h3>

              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">Social Network</h3>

            <div className="mt-4 flex items-center gap-2">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-slate-400 hover:text-slate-900"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-8 py-5 text-xs font-medium text-slate-400">
          <span>© 2026 RUTA · SakayMetrics</span>
          <span>Iloilo City, Philippines</span>
        </div>
      </div>
    </footer>
  );
}
