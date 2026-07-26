import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { ChevronRightIcon } from '@/components/icons';

type PrimaryButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
  children: ReactNode;
  loading?: boolean;
  /** Label swapped in while `loading` is true. */
  loadingLabel?: string;
  /** Trailing chevron, as used on the auth call-to-action buttons. */
  withChevron?: boolean;
};

/** Full-width 56px primary action: 12px radius, blue-600 fill. */
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
      className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-base font-bold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-300"
    >
      {loading ? loadingLabel ?? 'Please wait…' : children}
      {withChevron && !loading ? <ChevronRightIcon className="h-4 w-4" /> : null}
    </button>
  );
}
