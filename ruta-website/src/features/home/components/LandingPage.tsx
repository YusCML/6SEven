import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mb-6">Empowering the <span className="text-blue-600">Filipino Commuter</span></h1>
        <p className="text-lg text-slate-600 mb-8">Navigate the metro seamlessly. Get real-time updates, incident reports, and efficient transit analytics.</p>
        <div className="bg-white p-4 shadow-xl rounded-xl border border-slate-100 mb-6"><label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Saan ka pupunta?</label><input type="text" placeholder="Enter destination..." className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
        <div className="flex gap-4"><Link href="/auth/register" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">Get Started</Link><Link href="/auth/login" className="border border-slate-300 px-6 py-3 rounded-lg font-medium hover:bg-slate-100 transition">Log In</Link></div>
      </div>
      <div className="bg-slate-200 rounded-2xl h-96 flex items-center justify-center text-slate-400 font-medium shadow-inner relative overflow-hidden"><div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10" />🗺️ [Interactive Map Preview]</div>
    </div>
  );
}
