import Image from 'next/image';
import facebookMark from '@/assets/brand/facebook.svg';
import googleMark from '@/assets/brand/google.svg';
import LabeledDivider from '@/components/ui/LabeledDivider';

export type SocialProvider = 'Google' | 'Facebook';

type SocialAuthButtonsProps = {
  /** Divider caption — "Or continue with" on login, "Or sign up with" on register. */
  label: string;
  /**
   * Called when a provider is picked. There is no OAuth backend yet, so the
   * parent surfaces a message instead of the buttons failing silently.
   */
  onSelect: (provider: SocialProvider) => void;
};

const providers: { name: SocialProvider; mark: typeof googleMark }[] = [
  { name: 'Google', mark: googleMark },
  { name: 'Facebook', mark: facebookMark },
];

export default function SocialAuthButtons({ label, onSelect }: SocialAuthButtonsProps) {
  return (
    <div>
      <LabeledDivider label={label} />

      <div className="mt-6 grid grid-cols-2 gap-5">
        {providers.map(({ name, mark }) => (
          <button
            key={name}
            type="button"
            onClick={() => onSelect(name)}
            className="flex h-14 items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
          >
            {/* Brand marks keep their official colours, so they are images rather than currentColor icons. */}
            <Image src={mark} alt="" aria-hidden width={20} height={20} className="h-5 w-5" />
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
