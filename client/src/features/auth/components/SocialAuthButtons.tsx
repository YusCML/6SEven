import Image from 'next/image';
import googleMark from '@/assets/brand/google.svg';
import LabeledDivider from '@/components/ui/LabeledDivider';

type SocialAuthButtonsProps = {
  label: string;
};

export default function SocialAuthButtons({ label }: SocialAuthButtonsProps) {
  return (
    <div>
      <LabeledDivider label={label} />

      <a
        href="/api/auth/google/start"
        className="mt-6 flex h-14 items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900/15"
      >
        <Image src={googleMark} alt="" aria-hidden width={20} height={20} className="h-5 w-5" />
        Google
      </a>
    </div>
  );
}
