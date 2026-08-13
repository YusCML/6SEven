type AuthStatusStripProps = {
  status: string;
  stacked?: boolean;
};

const COPYRIGHT = '© 2024 RUTA. Ingat sa biyahe!';

export default function AuthStatusStrip({ status, stacked = false }: AuthStatusStripProps) {
  const statusLine = (
    <span className="flex items-center gap-2">
      <span className="h-2 w-2 rounded-full bg-green-500" />
      <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{status}</span>
    </span>
  );

  if (stacked) {
    return (
      <div className="flex flex-col items-center gap-2">
        {statusLine}
        <span className="text-xs text-slate-400">{COPYRIGHT}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {statusLine}
      <span className="h-4 w-px bg-slate-200" />
      <span className="text-xs text-slate-400">{COPYRIGHT}</span>
    </div>
  );
}
