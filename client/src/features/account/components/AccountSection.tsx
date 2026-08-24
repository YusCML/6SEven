import type { ReactNode } from 'react';

type AccountSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function AccountSection({ title, description, children }: AccountSectionProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <header className="border-b border-slate-100 px-6 py-5">
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
        {description ? <p className="mt-0.5 text-xs font-medium text-slate-500">{description}</p> : null}
      </header>

      <div className="px-6 py-5">{children}</div>
    </section>
  );
}
