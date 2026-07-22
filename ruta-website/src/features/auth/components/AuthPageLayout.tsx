import type { ReactNode } from 'react';

type AuthPageLayoutProps = {
  children: ReactNode;
  icon: string;
  title: string;
  description: string;
  containerClassName: string;
  headerClassName?: string;
};

export default function AuthPageLayout({ children, icon, title, description, containerClassName, headerClassName = 'text-center mb-8' }: AuthPageLayoutProps) {
  return (
    <div className={containerClassName}>
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-8">
        <div className={headerClassName}>
          <span className="text-3xl">{icon}</span>
          <h2 className="text-2xl font-bold text-slate-900 mt-2">{title}</h2>
          <p className="text-sm text-slate-500 mt-1">{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
