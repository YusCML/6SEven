import Link from 'next/link';
import type { ReactNode } from 'react';
import { ChevronRightIcon } from '@/components/icons';

type AccountBreadcrumbProps = {
  page: string;
  action?: ReactNode;
};

export default function AccountBreadcrumb({ page, action }: AccountBreadcrumbProps) {
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
          <li aria-current="page" className="text-slate-900">
            {page}
          </li>
        </ol>
      </nav>

      {action}
    </div>
  );
}
