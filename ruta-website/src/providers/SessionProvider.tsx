import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as authApi from '@/features/auth/api';
import type { SessionPayload, SessionUser } from '@/types/session';

/**
 * App-wide session state, hydrated from `/api/auth/session` on mount.
 *
 * The cookie itself is HttpOnly, so the browser cannot read it — this context
 * is the single place that knows whether someone is signed in.
 */

export type SessionStatus = 'loading' | 'authenticated' | 'guest';

export type SessionContextValue = {
  status: SessionStatus;
  user: SessionUser | null;
  /** Username when signed in, otherwise the generated `User…` guest name. */
  displayName: string;
  isAuthenticated: boolean;
  /** True until the first `/api/auth/session` response lands. */
  isLoading: boolean;
  refresh: () => Promise<void>;
  /** Adopts a payload returned by login/register/profile without a second round trip. */
  applySession: (payload: SessionPayload) => void;
  signOut: () => Promise<void>;
};

export const SessionContext = createContext<SessionContextValue | null>(null);

function displayNameOf(payload: SessionPayload | null): string {
  if (!payload) return 'Guest';
  return payload.user?.username ?? payload.guest?.name ?? 'Guest';
}

/**
 * Resolves to null when the API is unreachable — the caller then treats the
 * visitor as an anonymous guest rather than leaving the UI stuck on "loading".
 */
async function loadSession(): Promise<SessionPayload | null> {
  try {
    return await authApi.fetchSession();
  } catch {
    return null;
  }
}

export default function SessionProvider({ children }: { children: ReactNode }) {
  const [payload, setPayload] = useState<SessionPayload | null>(null);
  const [status, setStatus] = useState<SessionStatus>('loading');

  const applySession = useCallback((next: SessionPayload) => {
    setPayload(next);
    setStatus(next.status);
  }, []);

  /** Same as `applySession`, but tolerates the null we use for "API unreachable". */
  const adopt = useCallback((next: SessionPayload | null) => {
    setPayload(next);
    setStatus(next?.status ?? 'guest');
  }, []);

  const refresh = useCallback(async () => {
    adopt(await loadSession());
  }, [adopt]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const next = await loadSession();
      if (!cancelled) adopt(next);
    })();

    return () => {
      cancelled = true;
    };
  }, [adopt]);

  const signOut = useCallback(async () => {
    try {
      applySession(await authApi.logout());
    } catch {
      // The cookie may still have been cleared; re-read rather than guess.
      await refresh();
    }
  }, [applySession, refresh]);

  const value = useMemo<SessionContextValue>(
    () => ({
      status,
      user: payload?.user ?? null,
      displayName: displayNameOf(payload),
      isAuthenticated: status === 'authenticated',
      isLoading: status === 'loading',
      refresh,
      applySession,
      signOut,
    }),
    [status, payload, refresh, applySession, signOut],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
