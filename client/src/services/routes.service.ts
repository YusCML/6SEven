import { getJson } from '@/lib/http';
import type { Route } from '@shared/types/route';

export function fetchRoutes(): Promise<Route[]> {
  return getJson<Route[]>('/api/routes');
}
