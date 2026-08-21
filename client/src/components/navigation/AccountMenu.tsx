import Link from 'next/link';
import Avatar from '@/components/ui/Avatar';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { SettingsIcon } from '@/components/icons';
import useSession from '@/hooks/useSession';

const pill = 'flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-2';

function SignedIn({ displayName, avatarUrl }: { displayName: string; avatarUrl: string | null }) {
  return (
    <Link href="/dashboard/profile" className="flex items-center gap-2.5 transition hover:opacity-75">
      <span className="relative inline-flex shrink-0 rounded-full ring-2 ring-amber-400 ring-offset-2 ring-offset-white">
        <Avatar name={displayName} src={avatarUrl} size="sm" />
        <span
          className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500"
          aria-hidden
        />
        <span className="sr-only">Online</span>
      </span>

      <span className="hidden min-w-8 max-w-28 truncate text-sm font-bold text-slate-900 sm:block">{displayName}</span>
    </Link>
  );
}

function SignedOut() {
  return (
    <Link href="/auth/login" className="flex items-center gap-2.5 transition hover:opacity-75">
      <Avatar name="Sign In" size="sm" />
      <span className="hidden text-sm font-bold text-slate-900 sm:block">Sign In</span>
    </Link>
  );
}

export default function AccountMenu() {
  const { isAuthenticated, isLoading, displayName, user } = useSession();

  if (isLoading) {
    return <span className="h-11 w-64 animate-pulse rounded-full bg-slate-100" aria-hidden />;
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

      <div className={pill}>
        {isAuthenticated ? <SignedIn displayName={displayName} avatarUrl={user?.avatarUrl ?? null} /> : <SignedOut />}

        <span className="h-5 w-px shrink-0 bg-slate-200" aria-hidden />

        <ThemeToggle />
      </div>
    </div>
  );
}
