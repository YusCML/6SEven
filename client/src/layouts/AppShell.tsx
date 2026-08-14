import type { ReactNode } from 'react';
import Navbar from '@/components/navigation/Navbar';

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
    </div>
  );
}
