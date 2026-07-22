type RouteOptionCardProps = {
  title: string;
  duration: string;
  description: string;
  selected?: boolean;
};

export default function RouteOptionCard({ title, duration, description, selected = false }: RouteOptionCardProps) {
  const className = selected ? 'p-3 border-2 border-blue-500 bg-blue-50/50 rounded-lg cursor-pointer' : 'p-3 border border-slate-200 hover:border-slate-300 rounded-lg cursor-pointer transition';
  return <div className={className}><div className="flex justify-between font-semibold text-sm"><span>{title}</span><span className={selected ? 'text-blue-600' : 'text-slate-600'}>{duration}</span></div><p className="text-xs text-slate-500 mt-1">{description}</p></div>;
}
