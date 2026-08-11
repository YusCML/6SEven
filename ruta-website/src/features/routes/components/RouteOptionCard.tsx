interface RouteOptionCardProps {
  title: string;
  duration: string;
  description: string;
  selected?: boolean;
  onClick?: () => void;
}

export default function RouteOptionCard({ title, duration, description, selected, onClick }: RouteOptionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg border transition-colors ${
        selected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="flex justify-between items-center">
        <span className="font-semibold text-sm text-slate-900">{title}</span>
        <span className="text-xs text-slate-500">{duration}</span>
      </div>
      <p className="text-xs text-slate-400 mt-1">{description}</p>
    </button>
  );
}