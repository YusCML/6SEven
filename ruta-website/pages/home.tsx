import Link from 'next/link';

export default function DesktopHome() {
  return (
    <div className="bg-slate-50 flex-1 py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Main Search Jumbotron */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Where are you heading today?</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Enter starting terminal..."
              className="flex-1 border border-slate-200 rounded-xl p-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Enter destination point..."
              className="flex-1 border border-slate-200 rounded-xl p-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Link
              href="/routes"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition flex items-center justify-center"
            >
              Search
            </Link>
          </div>
        </div>

        {/* Shortcut Quick Links Grid layout mimicking flow modules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2 hover:shadow-md transition">
            <span className="text-2xl">📊</span>
            <h3 className="font-bold text-slate-800">Incident Matrix Dashboard</h3>
            <p className="text-xs text-slate-500">Review line congestion parameters and live incident streams across transit sectors.</p>
            <Link href="/dashboard" className="inline-block text-xs font-semibold text-blue-600 pt-2 hover:underline">
              Open Live Feed →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2 hover:shadow-md transition">
            <span className="text-2xl">🗺️</span>
            <h3 className="font-bold text-slate-800">Alternative Route Explorer</h3>
            <p className="text-xs text-slate-500">Calculate transit route combinations leveraging active community feedback cycles.</p>
            <Link href="/routes" className="inline-block text-xs font-semibold text-blue-600 pt-2 hover:underline">
              Map Routes →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2 hover:shadow-md transition">
            <span className="text-2xl">ℹ️</span>
            <h3 className="font-bold text-slate-800">About SakayMetrics</h3>
            <p className="text-xs text-slate-500">Learn about our mission statement supporting localized transit accessibility layers.</p>
            <Link href="/about" className="inline-block text-xs font-semibold text-blue-600 pt-2 hover:underline">
              Read Story →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
