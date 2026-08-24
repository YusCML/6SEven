import { useEffect, useState } from 'react';
import { errorMessage, getJson } from '@/lib/http';
import type { RouteData } from '@/types/route';

type RoutesState = {
  routes: RouteData[];
  loading: boolean;
  error: string | null;
};

export function useRoutes(): RoutesState {
  const [state, setState] = useState<RoutesState>({ routes: [], loading: true, error: null });

  useEffect(() => {
    let cancelled = false;

    async function loadRoutes() {
      try {
        const routes = await getJson<RouteData[]>('/api/routes');
        if (!cancelled) setState({ routes, loading: false, error: null });
      } catch (error) {
        if (!cancelled) {
          setState({ routes: [], loading: false, error: errorMessage(error, 'Failed to load routes.') });
        }
      }
    }

    loadRoutes();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
