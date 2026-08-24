import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { ChevronRightIcon } from '@/components/icons';

type PrimaryButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
  children: ReactNode;
  loading?: boolean;
  loadingLabel?: string;
  withChevron?: boolean;
};

export default function PrimaryButton({
  children,
  loading = false,
  loadingLabel,
  withChevron = false,
  disabled,
  ...buttonProps
}: PrimaryButtonProps) {
  return (
    <button
      {...buttonProps}
      disabled={disabled || loading}
      className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-base font-bold text-white shadow-sm transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
    >
      {loading ? loadingLabel ?? 'Please wait…' : children}
      {withChevron && !loading ? <ChevronRightIcon className="h-4 w-4" /> : null}
    </button>
  );
}
