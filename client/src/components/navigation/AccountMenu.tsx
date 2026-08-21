import Link from 'next/link';
import Avatar from '@/components/ui/Avatar';
import ThemeToggle from '@/components/ui/ThemeToggle';
import useSession from '@/hooks/useSession';

function SignedIn({ displayName, avatarUrl }: { displayName: string; avatarUrl: string | null }) {
  return (
    <Link href="/dashboard/profile" className="flex items-center gap-3 transition hover:opacity-75">
      <span className="relative inline-flex shrink-0 rounded-full ring-2 ring-amber-400 ring-offset-2 ring-offset-white">
        <Avatar name={displayName} src={avatarUrl} />
        <span
          className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500"
          aria-hidden
        />
        <span className="sr-only">Online</span>
      </span>

      <span className="hidden min-w-8 max-w-36 truncate text-sm font-bold text-slate-900 sm:block">
        {displayName}
      </span>
    </Link>
  );
}

function SignedOut() {
  return (
    <Link href="/auth/login" className="flex items-center gap-3 transition hover:opacity-75">
      <Avatar name="Sign In" />

      <span className="hidden leading-tight sm:block">
        <span className="block text-sm font-bold text-slate-900">Sign In</span>
        <span className="block text-xs font-medium text-slate-500">Guest Member</span>
      </span>
    </Link>
  );
}

export default function AccountMenu() {
  const { isAuthenticated, isLoading, displayName, user } = useSession();

  if (isLoading) {
    return <span className="h-12 w-44 animate-pulse rounded-full bg-slate-100" aria-hidden />;
  }

  return (
    <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white p-1.5">
      {isAuthenticated ? <SignedIn displayName={displayName} avatarUrl={user?.avatarUrl ?? null} /> : <SignedOut />}

      <span className="h-6 w-px shrink-0 bg-slate-200" aria-hidden />

      <ThemeToggle />
    </div>
  );
}
