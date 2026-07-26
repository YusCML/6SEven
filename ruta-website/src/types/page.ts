import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';

/**
 * Per-page layouts. A page exports `getLayout` to opt out of the default
 * `AppShell` chrome — the auth screens use this to render their own slim nav
 * instead of the full site navigation.
 *
 * See https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts
 */
export type NextPageWithLayout<P = Record<string, never>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};
