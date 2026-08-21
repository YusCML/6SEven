import { useState } from 'react';
import { MoonIcon, SunIcon } from '@/components/icons';

type Theme = 'light' | 'dark';

const options = [
  { value: 'light', label: 'Light', Icon: SunIcon },
  { value: 'dark', label: 'Dark', Icon: MoonIcon },
] as const satisfies readonly { value: Theme; label: string; Icon: typeof SunIcon }[];

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

  return (
    <div role="group" aria-label="Colour theme" className="flex shrink-0 items-center gap-1 rounded-full bg-slate-900 p-1">
      {options.map(({ value, label, Icon }) => {
        const isSelected = theme === value;

        return (
          <button
            key={value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => setTheme(value)}
            className={`grid h-8 w-8 place-items-center rounded-full transition ${
              isSelected ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'
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
