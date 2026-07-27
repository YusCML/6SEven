import Link from 'next/link';
import defaultAvatar from '@/assets/avatar/default-avatar.png';
import Avatar from '@/components/ui/Avatar';
import useSession from '@/hooks/useSession';

/**
 * The account control at the right of the navigation, and the only entry point
 * to the auth screens.
 *
 * - Signed out — reads "Sign In" over "Guest Member", links to login.
 * - Signed in  — shows the username over their tier, links to the profile.
 *
 * Both states share one layout — a right-aligned two-line label followed by the
 * portrait — so only the wording and destination differ.
 *
 * Rendering is held back until the session resolves, so the label never flips
 * from "Sign In" to a username after paint.
 */
export default function AccountMenu() {
  const { isAuthenticated, isLoading, displayName, user } = useSession();

  if (isLoading) {
    return <span className="h-10 w-32 animate-pulse rounded-full bg-slate-100" aria-hidden />;
  }

  const account = isAuthenticated
    ? { href: '/dashboard/profile', primary: user?.username ?? displayName, secondary: 'Pro Commuter', photo: undefined }
    : { href: '/auth/login', primary: 'Sign In', secondary: 'Guest Member', photo: defaultAvatar };

  return (
    <Link
      href={account.href}
      className="flex items-center gap-3 rounded-full transition hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
    >
      <span className="hidden text-right leading-tight sm:block">
        <span className="block text-sm font-bold text-slate-900">{account.primary}</span>
        <span className="block text-xs font-medium text-slate-500">{account.secondary}</span>
      </span>
      <Avatar name={account.primary} src={account.photo} />
    </Link>
  );
}
