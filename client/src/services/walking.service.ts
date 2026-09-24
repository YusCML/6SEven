import type { LatLng } from '@/features/routes/lib/geo';

type FootRoute = {
  code: string;
  routes?: { geometry: { coordinates: [number, number][] } }[];
};

/** A walking path along real streets (OpenStreetMap foot routing), or a straight line if unavailable. */
export async function fetchWalkingPath(from: LatLng, to: LatLng, signal?: AbortSignal): Promise<LatLng[]> {
  const coords = `${from[1]},${from[0]};${to[1]},${to[0]}`;
  const url = `https://routing.openstreetmap.de/routed-foot/route/v1/foot/${coords}?overview=full&geometries=geojson`;

  try {
    const response = await fetch(url, { signal });
    if (!response.ok) return [from, to];
    const data = (await response.json()) as FootRoute;
    const line = data.code === 'Ok' ? data.routes?.[0]?.geometry.coordinates : undefined;
    return line && line.length > 1 ? [from, ...line.map(([lng, lat]): LatLng => [lat, lng]), to] : [from, to];
  } catch {
    return [from, to];
  }
}
