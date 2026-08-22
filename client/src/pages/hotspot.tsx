import { useMemo, useState } from 'react';
import PageMeta from '@/components/PageMeta';
import Alert from '@/components/ui/Alert';
import { PlusIcon, SearchIcon } from '@/components/icons';
import AddHotspotDialog from '@/features/hotspot/components/AddHotspotDialog';
import HotspotCard from '@/features/hotspot/components/HotspotCard';
import { CATEGORIES, HOTSPOTS, type HotspotCategory } from '@/features/hotspot/data';

export default function HotspotPage() {
  const [category, setCategory] = useState<HotspotCategory>('All');
  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState(false);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();

    return HOTSPOTS.filter((hotspot) => {
      if (category !== 'All' && hotspot.category !== category) return false;
      if (!term) return true;

      return (
        hotspot.title.toLowerCase().includes(term) ||
        hotspot.location.toLowerCase().includes(term) ||
        hotspot.note.toLowerCase().includes(term)
      );
    });
  }, [category, query]);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <PageMeta title="Hotspot" description="Places around Iloilo City shared by fellow commuters." />

      {/* The topbar already renders the page title, so this row is toolbar only. */}
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <div role="tablist" aria-label="Filter by category" className="flex flex-wrap gap-5">
          {CATEGORIES.map((option) => {
            const isActive = category === option;

            return (
              <button
                key={option}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setCategory(option)}
                className={`border-b-2 pb-1 text-sm transition ${
                  isActive
                    ? 'border-slate-900 font-bold text-slate-900'
                    : 'border-transparent font-medium text-slate-400 hover:text-slate-900'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        <div className="flex flex-1 items-center justify-end gap-3">
          <div className="relative w-full max-w-64">
            <span
              aria-hidden
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <SearchIcon className="h-4 w-4" />
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search places…"
              aria-label="Search places"
              className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm font-medium text-slate-900 transition placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex h-9 shrink-0 items-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-bold text-white transition hover:bg-slate-700"
          >
            <PlusIcon className="h-4 w-4" />
            Add a place
          </button>
        </div>
      </div>

      <div className="mt-6">
        {visible.length === 0 ? (
          <Alert tone="info">No places match {query.trim() ? `“${query.trim()}”` : 'that filter'}.</Alert>
        ) : (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {visible.map((hotspot) => (
              <HotspotCard key={hotspot.id} hotspot={hotspot} />
            ))}
          </div>
        )}
      </div>

      {adding ? <AddHotspotDialog onClose={() => setAdding(false)} /> : null}
    </div>
  );
}
