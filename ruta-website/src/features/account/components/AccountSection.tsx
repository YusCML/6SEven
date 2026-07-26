import type { ReactNode } from 'react';

type AccountSectionProps = {
  title: string;
  children: ReactNode;
};

export default function AccountSection({ title, children }: AccountSectionProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">{title}</h2>
      {children}
    </div>
  );
}
