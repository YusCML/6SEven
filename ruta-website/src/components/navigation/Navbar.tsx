import Link from 'next/link';
import { useRouter } from 'next/router';
import RutaLogo from '@/components/brand/RutaLogo';
import AccountMenu from './AccountMenu';

const navigationItems = [
  { href: '/home', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/routes', label: 'Routes' },
  { href: '/commuter-guide', label: 'Commuter Guide' },
  { href: '/about-us', label: 'About' },
];

export default function Navbar() {
  const { pathname } = useRouter();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center gap-10 px-6 sm:px-11">
        <RutaLogo />

        {/* Primary navigation sits beside the wordmark, per the design. */}
        <nav className="hidden flex-1 items-center gap-8 lg:flex">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`text-sm font-semibold transition hover:text-blue-600 ${
                  isActive ? 'text-blue-600' : 'text-slate-600'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Wide gap keeps Help Center from crowding the account block. */}
        <div className="ml-auto flex items-center gap-8 lg:ml-0 lg:gap-12">
          <Link
            href="/commuter-guide"
            className="hidden text-sm font-medium text-slate-400 transition hover:text-slate-600 sm:block"
          >
            Help Center
          </Link>
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}
