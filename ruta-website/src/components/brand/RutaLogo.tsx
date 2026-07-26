import Link from 'next/link';
import { RutaMarkIcon } from '@/components/icons';

type RutaLogoProps = {
  /** `md` is the 40px nav mark, `sm` the 32px footer mark. */
  size?: 'sm' | 'md';
  href?: string;
};

const sizes = {
  sm: { box: 'h-8 w-8 rounded-lg', icon: 'h-4 w-4', text: 'text-sm' },
  md: { box: 'h-10 w-10 rounded-xl', icon: 'h-5 w-5', text: 'text-2xl' },
} as const;

/** The RUTA wordmark: rounded blue tile with a bus glyph, followed by the name. */
export default function RutaLogo({ size = 'md', href = '/home' }: RutaLogoProps) {
  const style = sizes[size];

  return (
    <Link href={href} className="flex items-center gap-3">
      <span className={`${style.box} grid place-items-center bg-blue-600 text-white`}>
        <RutaMarkIcon className={style.icon} />
      </span>
      <span className={`${style.text} font-black tracking-tight text-slate-900`}>RUTA</span>
    </Link>
  );
}
