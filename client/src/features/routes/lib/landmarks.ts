import type { RouteData } from '@/types/route';
import { distanceMeters, type LatLng } from './geo';

export type Pin = {
  position: LatLng;
  label: string;
};

/** "Near <official stop>" for a point, used until (or instead of) a street address comes back. */
export function nearestLandmark(routes: RouteData[], point: LatLng, withinMeters = 500): string {
  const best = routes
    .flatMap((route) => route.stops)
    .filter((stop) => !stop.name.startsWith('U-turn'))
    .reduce<{ name: string; meters: number } | null>((acc, stop) => {
      const meters = distanceMeters(stop.position, point);
      return meters <= withinMeters && (!acc || meters < acc.meters) ? { name: stop.name, meters } : acc;
    }, null);
  return best ? `Near ${best.name}` : `${point[0].toFixed(5)}, ${point[1].toFixed(5)}`;
}
