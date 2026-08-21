import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import AppShell from '@/layouts/AppShell';
import SessionProvider from '@/providers/SessionProvider';
import ThemeProvider from '@/providers/ThemeProvider';
import type { NextPageWithLayout } from '@/types/page';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => <AppShell>{page}</AppShell>);

  return (
    <ThemeProvider>
      <SessionProvider>
        <div className={`${inter.variable} font-sans`}>{getLayout(<Component {...pageProps} />)}</div>
      </SessionProvider>
    </ThemeProvider>
  );
}
