const legendItems = [{ label: 'Light', className: 'text-green-600' }, { label: 'Moderate', className: 'text-amber-500' }, { label: 'Heavy', className: 'text-red-500' }];

export default function MapLegend() {
  return <div className="absolute top-4 right-4 bg-white shadow px-3 py-2 rounded-md text-xs font-medium flex gap-2">{legendItems.map((item) => <span key={item.label} className={`flex items-center gap-1 ${item.className}`}>● {item.label}</span>)}</div>;
}
