import { MoonIcon, SunIcon } from '@/components/icons';
import useTheme from '@/hooks/useTheme';
import type { ResolvedTheme } from '@/providers/ThemeProvider';

const options = [
  { value: 'light', label: 'Light', Icon: SunIcon, active: 'bg-slate-900 text-white shadow-sm' },
  { value: 'dark', label: 'Dark', Icon: MoonIcon, active: 'bg-slate-900 text-white shadow-sm' },
] as const satisfies readonly {
  value: ResolvedTheme;
  label: string;
  Icon: typeof SunIcon;
  active: string;
}[];

/*
 * Track and thumb both follow the theme: a black thumb on a light track in light
 * mode, and the inverse in dark mode, so the selected side always carries the
 * strongest contrast on the strip.
 */
export default function ThemeToggle() {
  const { theme, setPreference } = useTheme();

  return (
    <div
      role="group"
      aria-label="Colour theme"
      className="flex shrink-0 items-center gap-1 rounded-full bg-slate-100 p-1"
    >
      {options.map(({ value, label, Icon, active }) => {
        const isSelected = theme === value;

        return (
          <button
            key={value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => setPreference(value)}
            className={`grid h-8 w-8 place-items-center rounded-full transition ${
              isSelected ? active : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="sr-only">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
