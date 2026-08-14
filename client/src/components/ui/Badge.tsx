import type { ReactNode } from 'react';

export type BadgeTone = 'brand' | 'neutral' | 'muted' | 'inverse';

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
};

const tones: Record<BadgeTone, string> = {
  brand: 'bg-blue-50 text-blue-600',
  neutral: 'bg-slate-100 text-slate-600',
  muted: 'text-slate-400',
  inverse: 'bg-white/90 text-blue-600 backdrop-blur',
};

export default function Badge({ children, tone = 'brand', className = '' }: BadgeProps) {
  const base =
    tone === 'muted'
      ? 'text-[10px] font-bold uppercase tracking-wider'
      : 'rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide';

  return <span className={`inline-flex items-center gap-1 ${base} ${tones[tone]} ${className}`}>{children}</span>;
}
