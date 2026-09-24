export type LatLng = [number, number];

const EARTH_RADIUS_M = 6371000;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

export function distanceMeters([lat1, lng1]: LatLng, [lat2, lng2]: LatLng): number {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

/** Distance from the start of the path to each of its points, in meters. */
export function cumulativeMeters(path: LatLng[]): number[] {
  const steps = path.map((point, i) => (i === 0 ? 0 : distanceMeters(path[i - 1], point)));
  let total = 0;
  return steps.map((step) => (total += step));
}

export function pathMeters(path: LatLng[]): number {
  return cumulativeMeters(path).at(-1) ?? 0;
}

export function nearestIndex(path: LatLng[], point: LatLng): number {
  return path.reduce(
    (best, candidate, i) => (distanceMeters(candidate, point) < distanceMeters(path[best], point) ? i : best),
    0,
  );
}

/** The point a given distance along the path. */
export function pointAlong(path: LatLng[], cumulative: number[], meters: number): LatLng {
  const i = cumulative.findIndex((c) => c >= meters);
  if (i < 0) return path[path.length - 1];
  if (i === 0) return path[0];
  const span = cumulative[i] - cumulative[i - 1] || 1;
  const t = (meters - cumulative[i - 1]) / span;
  const [a, b] = [path[i - 1], path[i]];
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

/** The part of the path between two distances along it, keeping its road vertices. */
export function slicePath(path: LatLng[], cumulative: number[], fromM: number, toM: number): LatLng[] {
  const inside = path.filter((_, i) => cumulative[i] > fromM && cumulative[i] < toM);
  return [pointAlong(path, cumulative, fromM), ...inside, pointAlong(path, cumulative, toM)];
}
