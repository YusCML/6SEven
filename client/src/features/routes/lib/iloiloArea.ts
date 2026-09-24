import area from '@/features/routes/data/iloiloArea.json';
import type { LatLng } from './geo';

// Iloilo City's boundary (OpenStreetMap, via Nominatim) and a ~55 m grid of cells that sit on
// land within about 200 m of a road. Together they keep pins off the sea and outside the city.
const BOUNDARY = area.boundary as LatLng[];
const { south, west, cell, rows, cols, bits } = area.grid;

const LAND = Uint8Array.from(atob(bits), (char) => char.charCodeAt(0));

export const ILOILO_BOUNDS: [LatLng, LatLng] = [
  [south, west],
  [south + rows * cell, west + cols * cell],
];

export function insideBoundary([lat, lng]: LatLng): boolean {
  return BOUNDARY.reduce((inside, [lat1, lng1], i) => {
    const [lat2, lng2] = BOUNDARY[(i + 1) % BOUNDARY.length];
    const crosses = lat1 > lat !== lat2 > lat && lng < ((lng2 - lng1) * (lat - lat1)) / (lat2 - lat1) + lng1;
    return crosses ? !inside : inside;
  }, false);
}

export function onLandNearRoad([lat, lng]: LatLng): boolean {
  const row = Math.floor((lat - south) / cell);
  const col = Math.floor((lng - west) / cell);
  if (row < 0 || col < 0 || row >= rows || col >= cols) return false;
  const index = row * cols + col;
  return ((LAND[index >> 3] >> (index & 7)) & 1) === 1;
}

export function isPinnable(point: LatLng): boolean {
  return insideBoundary(point) && onLandNearRoad(point);
}
