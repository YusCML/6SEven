import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { readJsonResponse } from '@/services/http/client';
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
  /** Full name when signed in, otherwise the generated `User…` guest name. */
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
 * Fetches the session without touching React state, so both the mount effect
 * and `refresh()` can share it. Resolves to null when the API is unreachable —
 * the caller then treats the visitor as an anonymous guest rather than leaving
 * the UI stuck on "loading" forever.
 */
async function fetchSession(): Promise<SessionPayload | null> {
  try {
    const response = await fetch('/api/auth/session', { credentials: 'same-origin' });
    const data = await readJsonResponse<SessionPayload>(response);

    return response.ok ? data : null;
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

  const refresh = useCallback(async () => {
    const next = await fetchSession();

    setPayload(next);
    setStatus(next?.status ?? 'guest');
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const next = await fetchSession();

      if (cancelled) return;

      setPayload(next);
      setStatus(next?.status ?? 'guest');
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const signOut = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'same-origin',
      });
      const data = await readJsonResponse<SessionPayload>(response);

      if (!response.ok) throw new Error('Sign out failed.');

      applySession(data);
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
