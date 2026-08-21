import Link from 'next/link';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { SettingsIcon } from '@/components/icons';
import useSession from '@/hooks/useSession';
import AccountDropdown from './AccountDropdown';

export default function AccountMenu() {
  const { isLoading } = useSession();

  if (isLoading) {
    return <span className="h-10 w-64 animate-pulse rounded-full bg-slate-100" aria-hidden />;
  }

  return (
    <div className="flex items-center gap-5">
      <div className="flex items-center gap-7">
        <Link href="/about-us" className="text-sm font-semibold text-slate-600 transition hover:text-slate-900">
          About Us
        </Link>

        <Link
          href="/dashboard/settings"
          aria-label="Settings"
          className="shrink-0 text-slate-500 transition hover:text-slate-900"
        >
          <SettingsIcon className="h-6 w-6" />
        </Link>
      </div>

      <span className="h-7 w-px shrink-0 bg-slate-200" aria-hidden />

      <div className="flex items-center gap-4">
        <AccountDropdown />
        <ThemeToggle />
      </div>
    </div>
  );
}
