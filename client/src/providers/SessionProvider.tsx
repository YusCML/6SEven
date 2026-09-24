import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { SessionPayload, SessionUser } from '@shared/types/session';
import { sessionDisplayName } from '@/lib/session';
import * as authApi from '@/services/auth.service';

export type SessionContextValue = {
  user: SessionUser | null;
  displayName: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  refresh: () => Promise<void>;
  applySession: (payload: SessionPayload) => void;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

function fetchSessionOrNull(): Promise<SessionPayload | null> {
  return authApi.fetchSession().catch(() => null);
}

export default function SessionProvider({ children }: { children: ReactNode }) {
  const [payload, setPayload] = useState<SessionPayload | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    fetchSessionOrNull().then((next) => {
      if (!cancelled) setPayload(next);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = useCallback(async () => {
    setPayload(await fetchSessionOrNull());
  }, []);

  const signOut = useCallback(async () => {
    setPayload(await authApi.logout().catch(fetchSessionOrNull));
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      user: payload?.user ?? null,
      displayName: sessionDisplayName(payload),
      isAuthenticated: payload?.status === 'authenticated',
      isLoading: payload === undefined,
      refresh,
      applySession: setPayload,
      signOut,
    }),
    [payload, refresh, signOut],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);

  if (!context) throw new Error('useSession must be used inside a SessionProvider.');

  return context;
}
