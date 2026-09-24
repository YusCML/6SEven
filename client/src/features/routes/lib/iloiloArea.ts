import area from '@/features/routes/data/iloiloArea.json';
import type { RouteData } from '@/types/route';
import { distanceMeters, type LatLng } from './geo';

// A ~55 m grid over metro Iloilo marking land within ~600 m of an OpenStreetMap road or a jeep route
// (Guimaras left out), so pins can't be dropped on the sea.
const { south, west, cell, rows, cols, bits } = area.grid;

const LAND = Uint8Array.from(atob(bits), (char) => char.charCodeAt(0));

export const MAX_WALK_TO_JEEP_M = 20 * 1609; // 20 miles: past this, no jeep route is any use

export const ILOILO_BOUNDS: [LatLng, LatLng] = [
  [south, west],
  [south + rows * cell, west + cols * cell],
];

export function onLand([lat, lng]: LatLng): boolean {
  const row = Math.floor((lat - south) / cell);
  const col = Math.floor((lng - west) / cell);
  if (row < 0 || col < 0 || row >= rows || col >= cols) return false;
  const index = row * cols + col;
  return ((LAND[index >> 3] >> (index & 7)) & 1) === 1;
}

export function distanceToNearestRoute(routes: RouteData[], point: LatLng): number {
  return routes.reduce(
    (best, route) => route.path.reduce((min, vertex) => Math.min(min, distanceMeters(vertex, point)), best),
    Infinity,
  );
}

/** Why a spot can't be a trip pin, or null if it can. */
export function pinProblem(routes: RouteData[], point: LatLng): string | null {
  if (!onLand(point)) return 'Pick a spot on land, not on the water.';
  if (distanceToNearestRoute(routes, point) > MAX_WALK_TO_JEEP_M) {
    return 'That spot is more than 20 miles from any jeepney route.';
  }
  return null;
}
