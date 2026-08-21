import type { ReactNode } from 'react';

type AlertProps = {
  tone: 'error' | 'success' | 'info';
  children: ReactNode;
  className?: string;
};

const tones = {
  error: 'border-red-200 bg-red-50 text-red-700',
  success: 'border-green-200 bg-green-50 text-green-700',
  info: 'border-slate-300 bg-slate-100 text-slate-900',
} as const;

export default function Alert({ tone, children, className = '' }: AlertProps) {
  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={`rounded-xl border px-4 py-3 text-sm ${tones[tone]} ${className}`}
    >
      {children}
    </p>
  );
}
