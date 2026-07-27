import type { ReactNode } from 'react';

export type BadgeTone = 'brand' | 'neutral' | 'muted' | 'inverse';

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
};

const tones: Record<BadgeTone, string> = {
  /** Blue pill — transit modes, "Favorite", "Live Updates". */
  brand: 'bg-blue-50 text-blue-600',
  /** Slate pill — secondary transit modes. */
  neutral: 'bg-slate-100 text-slate-600',
  /** Uppercase label with no fill — route endpoints like "Home → Campus". */
  muted: 'text-slate-400',
  /** Solid white pill used over photography. */
  inverse: 'bg-white/90 text-blue-600 backdrop-blur',
};

/**
 * Small rounded label. The design uses this shape in eight places — transit
 * tags, favourite markers, section eyebrows — so it lives here rather than
 * being re-declared per section.
 */
export default function Badge({ children, tone = 'brand', className = '' }: BadgeProps) {
  const base =
    tone === 'muted'
      ? 'text-[10px] font-bold uppercase tracking-wider'
      : 'rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide';

  return <span className={`inline-flex items-center gap-1 ${base} ${tones[tone]} ${className}`}>{children}</span>;
}
