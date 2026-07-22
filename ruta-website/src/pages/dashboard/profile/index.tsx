import { useState } from 'react';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import AccountNavigation from '@/features/account/components/AccountNavigation';
import AccountSection from '@/features/account/components/AccountSection';
import ProfileHeader from '@/features/account/components/ProfileHeader';

export default function UserProfile() {
  const [commuteSettings, setCommuteSettings] = useState({ notifyTraffic: true, notifyDelays: true, preferredMode: 'Train (LRT/MRT)' });
  const profileFieldLabel = 'block text-xs font-semibold text-slate-400 mb-1';
  const profileFieldInput = 'w-full border border-slate-200 bg-slate-50 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <ProfileHeader />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4"><AccountNavigation active="profile" title="Navigation" showSignOut /></div>
        <div className="md:col-span-2 space-y-6">
          <AccountSection title="Profile Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Full Name" type="text" defaultValue="Juan Dela Cruz" labelClassName={profileFieldLabel} inputClassName={profileFieldInput} />
              <FormField label="Email" type="email" defaultValue="juan.delacruz@email.ph" labelClassName={profileFieldLabel} inputClassName={profileFieldInput} />
            </div>
          </AccountSection>
          <AccountSection title="Commute Preferences">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Primary Mode of Transit</label>
                <select value={commuteSettings.preferredMode} onChange={(event) => setCommuteSettings({ ...commuteSettings, preferredMode: event.target.value })} className="border border-slate-200 bg-slate-50 rounded p-2 text-sm w-full sm:w-72">
                  <option>Train (LRT/MRT)</option><option>Bus (EDSA Carousel)</option><option>UV Express / Jeepney</option>
                </select>
              </div>
              <hr className="border-slate-100 my-4" />
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Notifications Setup</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer"><input type="checkbox" checked={commuteSettings.notifyTraffic} onChange={(event) => setCommuteSettings({ ...commuteSettings, notifyTraffic: event.target.checked })} className="rounded text-blue-600 focus:ring-blue-500" />Alert me about critical rush-hour congestion delays</label>
                <label className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer"><input type="checkbox" checked={commuteSettings.notifyDelays} onChange={(event) => setCommuteSettings({ ...commuteSettings, notifyDelays: event.target.checked })} className="rounded text-blue-600 focus:ring-blue-500" />Send push reports when incident status changes active/resolved</label>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end"><Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded shadow-sm transition">Save Changes</Button></div>
          </AccountSection>
        </div>
      </div>
    </div>
  );
}
