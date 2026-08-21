import Link from 'next/link';

type RutaWordmarkProps = {
  href?: string;
};

export default function RutaWordmark({ href = '/home' }: RutaWordmarkProps) {
  return (
    <Link href={href} className="flex items-baseline gap-1.5 transition hover:opacity-75">
      <span className="border-b-2 border-slate-900 text-xl font-black leading-none tracking-tight text-slate-900">
        Ruta
      </span>
      <span className="text-base font-medium leading-none text-slate-500">Iloilo</span>
    </Link>
  );
}
