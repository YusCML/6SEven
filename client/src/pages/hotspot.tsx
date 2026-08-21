import { useMemo, useState } from 'react';
import PageMeta from '@/components/PageMeta';
import Alert from '@/components/ui/Alert';
import { PlusIcon } from '@/components/icons';
import AddHotspotDialog from '@/features/hotspot/components/AddHotspotDialog';
import HotspotCard from '@/features/hotspot/components/HotspotCard';
import { CATEGORIES, HOTSPOTS, type HotspotCategory } from '@/features/hotspot/data';

export default function HotspotPage() {
  const [category, setCategory] = useState<HotspotCategory>('All');
  const [adding, setAdding] = useState(false);

  const visible = useMemo(
    () => (category === 'All' ? HOTSPOTS : HOTSPOTS.filter((hotspot) => hotspot.category === category)),
    [category],
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <PageMeta title="Hotspot" description="Places around Iloilo City shared by fellow commuters." />

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Hotspot</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Places worth knowing around Iloilo City, pinned by fellow commuters.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex h-11 items-center gap-2 rounded-lg bg-slate-900 px-5 text-sm font-bold text-white transition hover:bg-slate-700"
        >
          <PlusIcon className="h-4 w-4" />
          Add a place
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={category === option}
            onClick={() => setCategory(option)}
            className={`h-9 rounded-full px-4 text-xs font-bold transition ${
              category === option
                ? 'bg-slate-900 text-white'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <Alert tone="info">No places pinned under {category} yet.</Alert>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {visible.map((hotspot) => (
            <HotspotCard key={hotspot.id} hotspot={hotspot} />
          ))}
        </div>
      )}

      {adding ? <AddHotspotDialog onClose={() => setAdding(false)} /> : null}
    </div>
  );
}
