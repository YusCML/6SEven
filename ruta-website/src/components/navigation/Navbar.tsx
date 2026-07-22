import Link from 'next/link';

const navigationItems = [
  { href: '/home', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/routes', label: 'Routes' },
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
        <span>🌐 RUTA / SakayMetrics</span>
      </div>
      <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
        {navigationItems.map((item) => (
          <Link key={item.href} href={item.href} className="hover:text-blue-600">
            {item.label}
          </Link>
        ))}
        <Link href="/dashboard/profile" className="hover:text-blue-600 font-semibold text-blue-600 border border-blue-600 px-3 py-1 rounded-md hover:bg-blue-50">
          Profile
        </Link>
      </nav>
    </header>
  );
}
