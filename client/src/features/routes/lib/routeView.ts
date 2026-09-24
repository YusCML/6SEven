import type { RouteData, RouteStop } from '@/types/route';
import { formatKm, formatMinutes, formatPeso, jeepneyFare, rideMinutes } from './fare';
import { nearestIndex, pathMeters, type LatLng } from './geo';

export type RouteMode = 'loop' | 'oneWay';

export type NumberedStop = RouteStop & { number: number };

export type RouteView = {
  path: LatLng[];
  terminal: string;
  farEnd: string;
  distance: string;
  duration: string;
  fare: string;
  stops: NumberedStop[];
};

/** What the card and the map show for a route: the whole loop, or terminal to far end only. */
export function routeView(route: RouteData, mode: RouteMode): RouteView {
  const outbound = route.path.slice(0, route.turnIndex + 1);
  const inbound = route.path.slice(route.turnIndex);
  const path = mode === 'loop' ? route.path : outbound;
  const meters = pathMeters(path);
  const longestRideKm = Math.max(pathMeters(outbound), pathMeters(inbound)) / 1000;

  const stops = route.stops
    .map((stop) => ({ stop, index: nearestIndex(route.path, stop.position) }))
    .filter(({ index }) => mode === 'loop' || index <= route.turnIndex)
    .map(({ stop }, i) => ({ ...stop, number: i + 1 }));

  return {
    path,
    terminal: route.segments[0]?.from ?? route.title,
    farEnd: route.segments[0]?.to ?? '',
    distance: formatKm(meters),
    duration: formatMinutes(rideMinutes(meters / 1000)),
    fare:
      mode === 'loop'
        ? `${formatPeso(jeepneyFare(0))}–${formatPeso(jeepneyFare(longestRideKm))}`
        : formatPeso(jeepneyFare(meters / 1000)),
    stops,
  };
}
