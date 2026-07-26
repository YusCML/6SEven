import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import AppShell from '@/layouts/AppShell';
import SessionProvider from '@/providers/SessionProvider';
import type { NextPageWithLayout } from '@/types/page';

// Self-hosted at build time by next/font — no external request, no layout shift.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  // Pages without their own layout get the standard site chrome.
  const getLayout = Component.getLayout ?? ((page) => <AppShell>{page}</AppShell>);

  return (
    <SessionProvider>
      <div className={`${inter.variable} font-sans`}>{getLayout(<Component {...pageProps} />)}</div>
    </SessionProvider>
  );
}
