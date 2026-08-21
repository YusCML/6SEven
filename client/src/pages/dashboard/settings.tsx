import { useState } from 'react';
import PageMeta from '@/components/PageMeta';
import Alert from '@/components/ui/Alert';
import AccountBreadcrumb from '@/features/account/components/AccountBreadcrumb';
import AccountNavigation from '@/features/account/components/AccountNavigation';
import AccountSection from '@/features/account/components/AccountSection';
import ToggleSetting from '@/features/account/components/ToggleSetting';

const THEMES = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'Match system' },
];

export default function Settings() {
  const [settings, setSettings] = useState({ theme: 'light', publicProfile: true, dataSavingMode: false });
  const [saved, setSaved] = useState(false);

  const update = <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) => {
    setSettings({ ...settings, [key]: value });
    setSaved(false);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <PageMeta title="Settings" description="Control your RUTA display, data and privacy preferences." />

      <AccountBreadcrumb page="Settings" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <AccountNavigation active="settings" title="Account" />

        <div className="space-y-6">
          <AccountSection title="Appearance" description="How RUTA looks on this device.">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Theme</h3>
                <p className="mt-0.5 text-xs font-medium text-slate-500">Light, dark, or follow your system.</p>
              </div>

              <select
                aria-label="Theme"
                value={settings.theme}
                onChange={(event) => update('theme', event.target.value)}
                className="h-10 w-40 shrink-0 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700"
              >
                {THEMES.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </AccountSection>

          <AccountSection title="Data & Privacy" description="What RUTA loads and what other commuters can see.">
            <div className="space-y-5">
              <ToggleSetting
                title="Data saver"
                description="Load lighter maps on slow connections."
                checked={settings.dataSavingMode}
                onChange={(dataSavingMode) => update('dataSavingMode', dataSavingMode)}
              />

              <hr className="border-slate-100" />

              <ToggleSetting
                title="Public profile"
                description="Let other commuters see the incidents you report."
                checked={settings.publicProfile}
                onChange={(publicProfile) => update('publicProfile', publicProfile)}
              />
            </div>
          </AccountSection>

          {saved ? <Alert tone="success">Preferences saved for this session.</Alert> : null}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setSaved(true)}
              className="h-11 rounded-lg bg-blue-600 px-6 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
