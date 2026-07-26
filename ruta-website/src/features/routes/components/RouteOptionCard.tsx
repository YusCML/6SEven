type RouteOptionCardProps = {
  title: string;
  duration: string;
  description: string;
  traffic?: string;
  color?: string;
  selected?: boolean;
  onClick?: () => void;
};

export default function RouteOptionCard({
  title,
  duration,
  description,
  traffic,
  color,
  selected = false,
  onClick,
}: RouteOptionCardProps) {
  const className = selected
    ? 'w-full rounded-lg border-2 border-blue-500 bg-blue-50/50 p-3 text-left cursor-pointer'
    : 'w-full rounded-lg border border-slate-200 p-3 text-left transition hover:border-slate-300 cursor-pointer';

  return (
    <button type="button" className={className} onClick={onClick} aria-pressed={selected}>
      <div className="flex items-start justify-between gap-3 text-sm font-semibold">
        <span className="flex min-w-0 items-center gap-2">
          {color ? <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} /> : null}
          <span>{title}</span>
        </span>
        <span className={selected ? 'shrink-0 text-blue-600' : 'shrink-0 text-slate-600'}>{duration}</span>
      </div>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
      {traffic ? <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{traffic} traffic</p> : null}
    </button>
  );
}
