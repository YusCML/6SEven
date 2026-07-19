import React from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';

const HEADER_HEIGHT = 73; // px - Reference for pages that need fixed heights

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-6 py-4 flex justify-between items-center shrink-0">
        <div className="font-bold text-xl text-blue-600">🌐 RUTA</div>
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-600">
          {/* Navigation can be expanded here */}
        </nav>
      </header>

      {/* Main body naturally absorbs remaining screen window real estate */}
      <main className="flex flex-col flex-1">
        <Component {...pageProps} />
      </main>
    </div>
  );
}
