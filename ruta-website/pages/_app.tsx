// pages/_app.tsx
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Link from 'next/link'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Global Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <span>🌐 RUTA / SakayMetrics</span>
        </div>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/home" className="hover:text-blue-600">Home</Link>
          <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
          <Link href="/routes" className="hover:text-blue-600">Routes</Link>
          <Link href="/commuter guide" className="hover:text-blue-600">Commuter Guide</Link>
          <Link href="/about" className="hover:text-blue-600">About</Link>
          <Link href="/dashboard/profile" className="hover:text-blue-600 font-semibold text-blue-600 border border-blue-600 px-3 py-1 rounded-md hover:bg-blue-50">Profile</Link>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
    </div>
  )
}