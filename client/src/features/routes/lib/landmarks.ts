import type { RouteData } from '@/types/route';
import { distanceMeters, type LatLng } from './geo';

export type Pin = {
  position: LatLng;
  label: string;
};

/** "Near <official stop>" for a point, or null if no stop is within reach. */
export function nearestLandmark(routes: RouteData[], point: LatLng, withinMeters = 1000): string | null {
  const best = routes
    .flatMap((route) => route.stops)
    .filter((stop) => !stop.name.startsWith('U-turn'))
    .reduce<{ name: string; meters: number } | null>((acc, stop) => {
      const meters = distanceMeters(stop.position, point);
      return meters <= withinMeters && (!acc || meters < acc.meters) ? { name: stop.name, meters } : acc;
    }, null);
  return best ? `Near ${best.name}` : null;
}

export const coordinatesLabel = ([lat, lng]: LatLng) => `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
