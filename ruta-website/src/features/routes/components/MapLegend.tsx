const legendItems = [
  { label: 'Light', className: 'text-green-600' },
  { label: 'Moderate', className: 'text-amber-500' },
  { label: 'Heavy', className: 'text-red-500' },
];

type MapLegendProps = {
  showIncidents?: boolean;
};

export default function MapLegend({ showIncidents = false }: MapLegendProps) {
  return (
    <div className="absolute right-4 top-4 z-[500] flex max-w-[calc(100%-2rem)] flex-wrap gap-2 rounded-md bg-white px-3 py-2 text-xs font-medium shadow-lg ring-1 ring-slate-200">
      {legendItems.map((item) => (
        <span key={item.label} className={`flex items-center gap-1 ${item.className}`}>
          ● {item.label}
        </span>
      ))}
      {showIncidents ? <span className="flex items-center gap-1 text-red-600">● Live Incident</span> : null}
    </div>
  );
}
