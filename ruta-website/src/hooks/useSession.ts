import { useContext } from 'react';
import { SessionContext, type SessionContextValue } from '@/providers/SessionProvider';

/** Reads the app-wide session. Must be used under the `SessionProvider` in `_app.tsx`. */
export default function useSession(): SessionContextValue {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSession must be used inside a SessionProvider.');
  }

  return context;
}
