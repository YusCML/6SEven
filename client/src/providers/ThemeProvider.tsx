import { createContext, useCallback, useMemo, useSyncExternalStore, type ReactNode } from 'react';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'ruta-theme';

export type ThemeContextValue = {
  preference: ThemePreference;
  theme: ResolvedTheme;
  setPreference: (next: ThemePreference) => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

/*
 * The preference lives in localStorage and the system hint in matchMedia, so
 * this reads as an external store rather than component state. Doing it any
 * other way means syncing in an effect, which cascades a second render on every
 * mount and cannot match what the server rendered anyway.
 */
function subscribe(onChange: () => void) {
  listeners.add(onChange);

  const media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener('change', onChange);
  window.addEventListener('storage', onChange);

  return () => {
    listeners.delete(onChange);
    media.removeEventListener('change', onChange);
    window.removeEventListener('storage', onChange);
  };
}

function readPreference(): ThemePreference {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
  } catch {
    return 'system';
  }
}

// Snapshots must be primitives — returning a fresh object each call loops.
function getSnapshot(): string {
  const preference = readPreference();
  const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  return `${preference}|${system}`;
}

function getServerSnapshot(): string {
  return 'system|light';
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [preference, system] = snapshot.split('|') as [ThemePreference, ResolvedTheme];
  const theme: ResolvedTheme = preference === 'system' ? system : preference;

  const setPreference = useCallback((next: ThemePreference) => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // private mode — the choice just will not persist
    }

    const resolved =
      next === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : next;

    document.documentElement.classList.toggle('dark', resolved === 'dark');
    notify();
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ preference, theme, setPreference }),
    [preference, theme, setPreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
