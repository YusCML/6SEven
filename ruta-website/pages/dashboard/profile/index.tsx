import { useState } from 'react';

export default function UserProfile() {
  const [commuteSettings, setCommuteSettings] = useState({
    notifyTraffic: true,
    notifyDelays: true,
    preferredMode: 'Train (LRT/MRT)'
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md mb-8">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white/20 backdrop-blur border-2 border-white/40 rounded-full flex items-center justify-center text-3xl font-bold shadow-inner">
            🧑‍✈️
          </div>
          <div>
            <h1 className="text-2xl font-bold">Juan Dela Cruz</h1>
            <p className="text-blue-100 text-sm">Verified Commuter since 2024</p>
            <span className="inline-block bg-white/20 text-xs px-2 py-0.5 rounded-full mt-1.5 font-medium">⭐ Route Contributor</span>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center border border-white/10 w-full md:w-auto">
          <span className="text-xs text-blue-200 block uppercase font-semibold">Reliability Score</span>
          <span className="text-3xl font-extrabold tracking-tight">98.4%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider">Navigation</h3>
            <ul className="space-y-1 text-sm font-medium">
              <li><a href="/dashboard/profile" className="flex items-center gap-2 p-2 rounded bg-blue-50 text-blue-700">👤 Account Profile</a></li>
              <li><a href="/routes" className="flex items-center gap-2 p-2 rounded text-slate-600 hover:bg-slate-50">📍 Saved Routes</a></li>
              <li><a href="/dashboard/settings" className="flex items-center gap-2 p-2 rounded text-slate-600 hover:bg-slate-50">🛡️ Security & Privacy</a></li>
              <li><a href="#" className="flex items-center gap-2 p-2 rounded text-red-600 hover:bg-red-50 mt-4 border-t border-slate-100 pt-3">🚪 Sign Out</a></li>
            </ul>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Profile Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
                <input type="text" defaultValue="Juan Dela Cruz" className="w-full border border-slate-200 bg-slate-50 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Email</label>
                <input type="email" defaultValue="juan.delacruz@email.ph" className="w-full border border-slate-200 bg-slate-50 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Commute Preferences</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Primary Mode of Transit</label>
                <select 
                  value={commuteSettings.preferredMode}
                  onChange={(e) => setCommuteSettings({...commuteSettings, preferredMode: e.target.value})}
                  className="border border-slate-200 bg-slate-50 rounded p-2 text-sm w-full sm:w-72"
                >
                  <option>Train (LRT/MRT)</option>
                  <option>Bus (EDSA Carousel)</option>
                  <option>UV Express / Jeepney</option>
                </select>
              </div>

              <hr className="border-slate-100 my-4" />

              <h3 className="text-sm font-semibold text-slate-700 mb-2">Notifications Setup</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={commuteSettings.notifyTraffic} 
                    onChange={(e) => setCommuteSettings({...commuteSettings, notifyTraffic: e.target.checked})}
                    className="rounded text-blue-600 focus:ring-blue-500" 
                  />
                  Alert me about critical rush-hour congestion delays
                </label>
                <label className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={commuteSettings.notifyDelays} 
                    onChange={(e) => setCommuteSettings({...commuteSettings, notifyDelays: e.target.checked})}
                    className="rounded text-blue-600 focus:ring-blue-500" 
                  />
                  Send push reports when incident status changes active/resolved
                </label>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded shadow-sm transition">
                Save Changes
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
