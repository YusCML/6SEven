import { useEffect, useState } from 'react';
import type { RouteData } from '@/types/route';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function useRoutes() {
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchRoutes() {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/routes`);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        if (!cancelled) setRoutes(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load routes');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchRoutes();
    return () => {
      cancelled = true;
    };
  }, []);

  return { routes, loading, error };
}