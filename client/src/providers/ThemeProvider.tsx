import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'ruta-theme';

const DARK_QUERY = '(prefers-color-scheme: dark)';

export type ThemeContextValue = {
  preference: ThemePreference;
  theme: ResolvedTheme;
  setPreference: (next: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  const media = window.matchMedia(DARK_QUERY);

  listeners.add(onChange);
  media.addEventListener('change', onChange);
  window.addEventListener('storage', onChange);

  return () => {
    listeners.delete(onChange);
    media.removeEventListener('change', onChange);
    window.removeEventListener('storage', onChange);
  };
}

function isPreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

function readPreference(): ThemePreference {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isPreference(stored) ? stored : 'system';
  } catch {
    return 'system';
  }
}

function systemTheme(): ResolvedTheme {
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
}

function resolveTheme(preference: ThemePreference, system: ResolvedTheme): ResolvedTheme {
  return preference === 'system' ? system : preference;
}

function getSnapshot(): string {
  return `${readPreference()}|${systemTheme()}`;
}

function getServerSnapshot(): string {
  return 'system|light';
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [preference, system] = snapshot.split('|') as [ThemePreference, ResolvedTheme];

  const setPreference = useCallback((next: ThemePreference) => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}

    document.documentElement.classList.toggle('dark', resolveTheme(next, systemTheme()) === 'dark');
    listeners.forEach((listener) => listener());
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ preference, theme: resolveTheme(preference, system), setPreference }),
    [preference, system, setPreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) throw new Error('useTheme must be used inside a ThemeProvider.');

  return context;
}
