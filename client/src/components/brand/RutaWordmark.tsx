import Link from 'next/link';

type RutaWordmarkProps = {
  href?: string;
};

export default function RutaWordmark({ href = '/home' }: RutaWordmarkProps) {
  return (
    <Link href={href} className="flex flex-col leading-none transition hover:opacity-70">
      <span className="text-2xl font-black uppercase tracking-tight text-slate-900">Ruta</span>
      <span className="mt-1 text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400">Iloilo</span>
    </Link>
  );
}
