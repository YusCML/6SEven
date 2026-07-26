import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import AppShell from '@/layouts/AppShell';
import SessionProvider from '@/providers/SessionProvider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <AppShell>
        <Component {...pageProps} />
      </AppShell>
    </SessionProvider>
  );
}
