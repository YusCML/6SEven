import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import {
  BookmarkIcon,
  ChevronDownIcon,
  LogInIcon,
  LogOutIcon,
  MapPinIcon,
  SettingsIcon,
  UserIcon,
} from '@/components/icons';
import useSession from '@/hooks/useSession';

const SIGNED_IN_LINKS = [
  { href: '/dashboard/profile', label: 'View Profile', Icon: UserIcon },
  { href: '/routes', label: 'Saved Routes', Icon: MapPinIcon },
  { href: '/hotspot', label: 'My Hotspots', Icon: BookmarkIcon },
  { href: '/dashboard/settings', label: 'Settings', Icon: SettingsIcon },
] as const;

const itemClass =
  'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900';

export default function AccountDropdown() {
  const router = useRouter();
  const { isAuthenticated, displayName, user, signOut } = useSession();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  // The shell never unmounts on navigation, so the menu has to be closed by hand.
  useEffect(() => {
    const close = () => setOpen(false);
    router.events.on('routeChangeStart', close);
    return () => router.events.off('routeChangeStart', close);
  }, [router.events]);

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
    router.push('/home');
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2.5 rounded-full transition hover:opacity-75"
      >
        {isAuthenticated ? (
          <span className="relative inline-flex shrink-0 rounded-full ring-2 ring-amber-400 ring-offset-2 ring-offset-white">
            <Avatar name={displayName} src={user?.avatarUrl} size="sm" />
            <span
              className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500"
              aria-hidden
            />
            <span className="sr-only">Online</span>
          </span>
        ) : (
          <Avatar name="Sign In" size="sm" />
        )}

        <span className="hidden max-w-28 truncate text-sm font-bold text-slate-900 sm:block">
          {isAuthenticated ? displayName : 'Sign In'}
        </span>

        <ChevronDownIcon
          className={`h-4 w-4 shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="Account"
          className="absolute right-0 top-full z-50 mt-3 w-64 rounded-lg border border-slate-200 bg-white p-2 shadow-[0_18px_40px_-16px_rgb(2_6_23/0.35)]"
        >
          <div className="px-3 py-2">
            <p className="truncate text-sm font-bold text-slate-900">{displayName}</p>

            {isAuthenticated ? (
              <>
                <p className="mt-0.5 text-xs font-semibold text-slate-400">Account Status</p>
                <div className="mt-1.5">
                  <Badge tone="success">Verified Commuter</Badge>
                </div>
              </>
            ) : (
              <p className="mt-0.5 text-xs font-medium text-slate-500">Browsing as a guest</p>
            )}
          </div>

          <div className="my-2 border-t border-slate-100" />

          {isAuthenticated ? (
            <>
              <div className="space-y-0.5">
                {SIGNED_IN_LINKS.map(({ href, label, Icon }) => (
                  <Link key={href} href={href} role="menuitem" className={itemClass}>
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </Link>
                ))}
              </div>

              <div className="my-2 border-t border-slate-100" />

              <button
                type="button"
                role="menuitem"
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                <LogOutIcon className="h-4 w-4 shrink-0" />
                Sign Out
              </button>
            </>
          ) : (
            <div className="space-y-0.5">
              <Link href="/auth/login" role="menuitem" className={itemClass}>
                <LogInIcon className="h-4 w-4 shrink-0" />
                Sign In
              </Link>
              <Link href="/auth/register" role="menuitem" className={itemClass}>
                <UserIcon className="h-4 w-4 shrink-0" />
                Create an account
              </Link>
              <Link href="/dashboard/settings" role="menuitem" className={itemClass}>
                <SettingsIcon className="h-4 w-4 shrink-0" />
                Settings
              </Link>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
