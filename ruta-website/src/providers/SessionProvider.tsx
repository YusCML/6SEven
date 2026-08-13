import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as authApi from '@/features/auth/api';
import { sessionDisplayName, type SessionPayload, type SessionUser } from '@/types/session';

export type SessionStatus = 'loading' | 'authenticated' | 'guest';

export type SessionContextValue = {
  status: SessionStatus;
  user: SessionUser | null;
  displayName: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  refresh: () => Promise<void>;
  applySession: (payload: SessionPayload) => void;
  signOut: () => Promise<void>;
};

export const SessionContext = createContext<SessionContextValue | null>(null);

function displayNameOf(payload: SessionPayload | null): string {
  if (!payload) return 'Guest';
  return sessionDisplayName(payload);
}

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
