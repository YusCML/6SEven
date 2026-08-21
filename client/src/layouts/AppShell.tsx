import { useState, type ReactNode } from 'react';
import Sidebar from '@/components/navigation/Sidebar';
import Topbar from '@/components/navigation/Topbar';

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const [navOpen, setNavOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-white font-sans text-slate-900">
      <Sidebar open={navOpen} onToggle={() => setNavOpen(!navOpen)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
