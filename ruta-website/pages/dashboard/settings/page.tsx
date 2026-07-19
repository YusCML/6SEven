import React, { useState } from 'react';
import Link from 'next/link';

export default function Settings() {
  const [settings, setSettings] = useState({
    theme: 'light',
    twoFactor: false,
    publicProfile: true,
    dataSavingMode: false
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 flex-1 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Navigation Column matching Profile styling */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider">Control Panel</h3>
            <ul className="space-y-1 text-sm font-medium">
              <li><Link href="/profile" className="flex items-center gap-2 p-2 rounded text-slate-600 hover:bg-slate-50">👤 Account Profile</Link></li>
              <li><Link href="/settings" className="flex items-center gap-2 p-2 rounded bg-blue-50 text-blue-700">⚙️ Platform Settings</Link></li>
              <li><a href="#" className="flex items-center gap-2 p-2 rounded text-slate-600 hover:bg-slate-50">📍 Saved Routes</a></li>
            </ul>
          </div>
        </div>

        {/* Configuration Columns */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">System Parameters</h2>
            
            <div className="space-y-6">
              {/* Theme Selector */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Interface Display Mode</h4>
                  <p className="text-xs text-slate-500">Choose your ambient desktop workspace visual layer.</p>
                </div>
                <select 
                  value={settings.theme} 
                  onChange={(e) => setSettings({...settings, theme: e.target.value})}
                  className="border border-slate-200 bg-slate-50 text-sm p-2 rounded w-36"
                >
                  <option value="light">☀️ Light Theme</option>
                  <option value="dark">🌙 Dark Theme</option>
                  <option value="system">🖥️ System Defaults</option>
                </select>
              </div>

              <hr className="border-slate-100" />

              {/* Data Optimization Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Low-Data Map Strategy</h4>
                  <p className="text-xs text-slate-500">Minimizes vector asset updates while parsing routing maps over weak cellular connections.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={settings.dataSavingMode}
                  onChange={(e) => setSettings({...settings, dataSavingMode: e.target.checked})}
                  className="rounded text-blue-600 w-5 h-5 focus:ring-blue-500 border-slate-300"
                />
              </div>

              <hr className="border-slate-100" />

              {/* Privacy and Profile Visibility */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Public Reliability Standing</h4>
                  <p className="text-xs text-slate-500">Allows other metro commuters to view your submitted incident validation metrics.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={settings.publicProfile}
                  onChange={(e) => setSettings({...settings, publicProfile: e.target.checked})}
                  className="rounded text-blue-600 w-5 h-5 focus:ring-blue-500 border-slate-300"
                />
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => alert("Settings saved!")} 
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded shadow-sm transition"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}