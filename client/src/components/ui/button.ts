import { cx } from '@/lib/cx';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonStyle = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
};

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-slate-900 text-white hover:bg-slate-700 disabled:bg-slate-300',
  secondary: 'border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-60',
  ghost: 'text-slate-600 hover:bg-slate-100 disabled:opacity-60',
  danger: 'text-red-600 hover:bg-red-50 disabled:opacity-60',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 rounded-lg px-4 text-sm',
  md: 'h-11 rounded-lg px-5 text-sm',
  lg: 'h-14 rounded-xl px-6 text-base shadow-sm',
};

export function buttonClass({ variant = 'primary', size = 'md', block = false }: ButtonStyle = {}): string {
  return cx(
    'inline-flex shrink-0 items-center justify-center gap-2 font-bold transition disabled:cursor-not-allowed',
    sizes[size],
    variants[variant],
    block && 'w-full',
  );
}
