import Image, { type StaticImageData } from 'next/image';

type AvatarProps = {
  name: string;
  src?: StaticImageData | string;
  size?: 'sm' | 'md';
};

const sizes = {
  sm: { box: 'h-8 w-8', text: 'text-xs', px: 32 },
  md: { box: 'h-10 w-10', text: 'text-sm', px: 40 },
} as const;

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function Avatar({ name, src, size = 'md' }: AvatarProps) {
  const style = sizes[size];

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={style.px}
        height={style.px}
        className={`${style.box} shrink-0 rounded-full border border-slate-200 object-cover`}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={`${style.box} ${style.text} grid shrink-0 place-items-center rounded-full border border-slate-200 bg-slate-100 font-bold text-slate-500`}
    >
      {initialsOf(name)}
    </span>
  );
}
