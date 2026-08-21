import Image, { type StaticImageData } from 'next/image';
import defaultAvatar from '@/assets/avatar/default-avatar.png';

type AvatarProps = {
  name: string;
  src?: StaticImageData | string | null;
  size?: 'sm' | 'md' | 'lg';
};

const sizes = {
  sm: { box: 'h-8 w-8', px: 32 },
  md: { box: 'h-10 w-10', px: 40 },
  lg: { box: 'h-24 w-24', px: 96 },
} as const;

export default function Avatar({ name, src, size = 'md' }: AvatarProps) {
  const style = sizes[size];

  return (
    <Image
      src={src || defaultAvatar}
      alt={name}
      width={style.px}
      height={style.px}
      className={`${style.box} shrink-0 rounded-full border border-slate-100 object-cover`}
    />
  );
}
