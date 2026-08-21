import Link from 'next/link';
import { ChevronRightIcon, SlidersIcon } from '@/components/icons';

export default function ProfileBreadcrumb() {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm font-semibold">
          <li>
            <Link href="/home" className="text-slate-400 transition hover:text-slate-600">
              Home
            </Link>
          </li>
          <li aria-hidden className="text-slate-300">
            <ChevronRightIcon className="h-4 w-4" />
          </li>
          <li aria-current="page" className="text-blue-600">
            Profile
          </li>
        </ol>
      </nav>

      <Link
        href="/dashboard/settings"
        className="flex h-11 items-center gap-2 rounded-lg bg-slate-900 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
      >
        <SlidersIcon className="h-4 w-4" />
        Account Settings
      </Link>
    </div>
  );
}
