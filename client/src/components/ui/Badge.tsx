import type { ReactNode } from 'react';

export type BadgeTone = 'brand' | 'neutral' | 'muted' | 'inverse' | 'success';

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
};

const tones: Record<BadgeTone, string> = {
  brand: 'bg-slate-100 text-slate-900',
  neutral: 'bg-slate-100 text-slate-600',
  muted: 'text-slate-400',
  inverse: 'bg-paper/90 text-ink backdrop-blur',
  success: 'bg-emerald-50 text-emerald-600',
};

export default function Badge({ children, tone = 'brand', className = '' }: BadgeProps) {
  const base =
    tone === 'muted'
      ? 'text-[10px] font-bold uppercase tracking-wider'
      : 'rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide';

  return <span className={`inline-flex items-center gap-1 ${base} ${tones[tone]} ${className}`}>{children}</span>;
}
