import { useState } from 'react';
import Button from '@/components/ui/Button';
import AccountNavigation from '@/features/account/components/AccountNavigation';
import AccountSection from '@/features/account/components/AccountSection';
import ToggleSetting from '@/features/account/components/ToggleSetting';

export default function Settings() {
  const [settings, setSettings] = useState({ theme: 'light', twoFactor: false, publicProfile: true, dataSavingMode: false });

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 flex-1 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4"><AccountNavigation active="settings" title="Control Panel" /></div>
        <div className="md:col-span-2 space-y-6">
          <AccountSection title="System Parameters">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div><h4 className="text-sm font-semibold text-slate-800">Interface Display Mode</h4><p className="text-xs text-slate-500">Choose your ambient desktop workspace visual layer.</p></div>
                <select value={settings.theme} onChange={(event) => setSettings({ ...settings, theme: event.target.value })} className="border border-slate-200 bg-slate-50 text-sm p-2 rounded w-36">
                  <option value="light">☀️ Light Theme</option><option value="dark">🌙 Dark Theme</option><option value="system">🖥️ System Defaults</option>
                </select>
              </div>
              <hr className="border-slate-100" />
              <ToggleSetting title="Low-Data Map Strategy" description="Minimizes vector asset updates while parsing routing maps over weak cellular connections." checked={settings.dataSavingMode} onChange={(dataSavingMode) => setSettings({ ...settings, dataSavingMode })} />
              <hr className="border-slate-100" />
              <ToggleSetting title="Public Reliability Standing" description="Allows other metro commuters to view your submitted incident validation metrics." checked={settings.publicProfile} onChange={(publicProfile) => setSettings({ ...settings, publicProfile })} />
            </div>
            <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
              <Button onClick={() => alert('Settings saved!')} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded shadow-sm transition">Apply Changes</Button>
            </div>
          </AccountSection>
        </div>
      </div>
    </div>
  );
}
