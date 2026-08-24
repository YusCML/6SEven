import { useContext } from 'react';
import { ThemeContext, type ThemeContextValue } from '@/providers/ThemeProvider';

export default function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used inside a ThemeProvider.');
  }

  return context;
}
