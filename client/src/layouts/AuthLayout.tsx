import Link from 'next/link';
import type { ReactNode } from 'react';
import RutaLogo from '@/components/brand/RutaLogo';

type FooterLink = {
  label: string;
  href: string;
};

type AuthLayoutProps = {
  children: ReactNode;
  footerLinks?: FooterLink[];
};

const defaultFooterLinks: FooterLink[] = [
  { label: 'Privacy Policy', href: '/about-us' },
  { label: 'Terms', href: '/about-us' },
  { label: 'Support', href: '/about-us' },
];

export default function AuthLayout({ children, footerLinks = defaultFooterLinks }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-6 sm:px-11">
          <RutaLogo />
          <Link href="/home" className="text-sm font-semibold text-slate-600 transition hover:text-slate-900">
            Back to Home
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">{children}</main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex h-20 w-full max-w-[1440px] flex-col items-center justify-between gap-3 px-6 sm:flex-row sm:px-11">
          <RutaLogo size="sm" />
          <nav className="flex items-center gap-8">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs font-medium text-slate-400 transition hover:text-slate-600"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
