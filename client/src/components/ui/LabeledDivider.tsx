type LabeledDividerProps = {
  label: string;
};

export default function LabeledDivider({ label }: LabeledDividerProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="h-px flex-1 bg-slate-200" />
      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</span>
      <span className="h-px flex-1 bg-slate-200" />
    </div>
  );
}
