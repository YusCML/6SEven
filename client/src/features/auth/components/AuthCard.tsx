import type { ReactNode } from 'react';

type AuthCardProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <div className="w-full max-w-[480px]">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl sm:p-10">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">{title}</h1>
        <p className="mt-2 text-base font-medium text-slate-500">{description}</p>
        <div className="mt-8">{children}</div>
      </div>
      {footer ? <div className="mt-8">{footer}</div> : null}
    </div>
  );
}
