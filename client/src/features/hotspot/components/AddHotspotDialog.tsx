import { useState } from 'react';
import Alert from '@/components/ui/Alert';
import TextField from '@/components/ui/TextField';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { ImageIcon, MapPinIcon, XIcon } from '@/components/icons';
import { CATEGORIES } from '../data';

const PICKABLE = CATEGORIES.filter((category) => category !== 'All');

export default function AddHotspotDialog({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ title: '', location: '', category: PICKABLE[0], note: '' });

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-ink/60 p-4 sm:p-8">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-hotspot-title"
        className="w-full max-w-lg rounded-lg border border-slate-200 bg-white"
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <h2 id="add-hotspot-title" className="text-base font-bold text-slate-900">
              Add a hotspot
            </h2>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              Share a place other commuters should know about.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </header>

        <div className="space-y-5 px-6 py-5">
          <div>
            <span className="mb-2 block text-sm font-bold text-slate-700">Photo</span>
            <div className="grid h-40 place-items-center rounded-md border-2 border-dashed border-slate-200 bg-slate-50 text-center">
              <div>
                <ImageIcon className="mx-auto h-6 w-6 text-slate-300" />
                <p className="mt-2 text-xs font-semibold text-slate-500">Drop a photo or browse</p>
                <p className="text-[11px] text-slate-400">JPG or PNG, up to 8MB</p>
              </div>
            </div>
          </div>

          <TextField
            label="Place name"
            type="text"
            name="title"
            placeholder="Jaro Plaza & Belfry"
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
          />

          <TextField
            label="Location"
            type="text"
            name="location"
            placeholder="Jaro District, Iloilo City"
            icon={<MapPinIcon className="h-4 w-4" />}
            value={form.location}
            onChange={(event) => setForm({ ...form, location: event.target.value })}
          />

          <div>
            <span className="mb-2 block text-sm font-bold text-slate-700">Category</span>
            <div className="flex flex-wrap gap-2">
              {PICKABLE.map((category) => (
                <button
                  key={category}
                  type="button"
                  aria-pressed={form.category === category}
                  onClick={() => setForm({ ...form, category })}
                  className={`h-9 rounded-full px-4 text-xs font-bold transition ${
                    form.category === category
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="hotspot-note" className="mb-2 block text-sm font-bold text-slate-700">
              What should people know?
            </label>
            <textarea
              id="hotspot-note"
              rows={3}
              value={form.note}
              onChange={(event) => setForm({ ...form, note: event.target.value })}
              placeholder="Best time to go, where rides queue, anything useful."
              className="w-full rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 transition placeholder:text-gray-400 focus:border-slate-900 focus:bg-white"
            />
          </div>

          <Alert tone="info">Hotspots are a preview — nothing is saved yet.</Alert>
        </div>

        <footer className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-lg px-5 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
          >
            Cancel
          </button>

          <div className="w-32">
            <PrimaryButton type="button" disabled>
              Post
            </PrimaryButton>
          </div>
        </footer>
      </div>
    </div>
  );
}
