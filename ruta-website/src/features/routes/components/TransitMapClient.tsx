import { Fragment, useEffect, useMemo } from 'react';
import type { LatLngBoundsExpression } from 'leaflet';
import { CircleMarker, MapContainer, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet';
import MapLegend from '@/features/routes/components/MapLegend';
import { transitRoutes, type TransitRoute } from '@/features/routes/data/transitRoutes';
import type { TransitMapProps } from './TransitMap';

const DEFAULT_CENTER: [number, number] = [14.5995, 121.0367];

type FitMapToStopsProps = {
  route: TransitRoute;
  variant: TransitMapProps['variant'];
};

function FitMapToStops({ route, variant }: FitMapToStopsProps) {
  const map = useMap();
  const bounds = useMemo<LatLngBoundsExpression>(() => route.stops.map((stop) => stop.position), [route]);

  useEffect(() => {
    map.fitBounds(bounds, {
      animate: true,
      maxZoom: variant === 'preview' ? 12 : 13,
      padding: variant === 'preview' ? [28, 28] : [44, 44],
    });
  }, [bounds, map, variant]);

  return null;
}

function getSelectedRoute(selectedRouteId?: string) {
  return transitRoutes.find((route) => route.id === selectedRouteId) ?? transitRoutes[0];
}

<<<<<<< Updated upstream
export default function TransitMapClient({
  variant,
  selectedRouteId,
  incidents = [],
  showIncidents = false,
  className = '',
}: TransitMapProps) {
=======
export default function TransitMapClient({ variant, selectedRouteId, className = '' }: TransitMapProps) {
>>>>>>> Stashed changes
  const selectedRoute = getSelectedRoute(selectedRouteId);
  const orderedRoutes = useMemo(
    () => [...transitRoutes.filter((route) => route.id !== selectedRoute.id), selectedRoute],
    [selectedRoute],
  );

  return (
    <div className={`relative h-full min-h-80 w-full overflow-hidden bg-slate-100 ${className}`}>
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={11}
        minZoom={10}
        maxZoom={16}
<<<<<<< Updated upstream
        zoomControl={variant !== 'preview'}
        scrollWheelZoom={variant !== 'preview'}
=======
        zoomControl={variant === 'planner'}
        scrollWheelZoom={variant === 'planner'}
>>>>>>> Stashed changes
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitMapToStops route={selectedRoute} variant={variant} />
        {orderedRoutes.map((route) => {
          const isSelected = route.id === selectedRoute.id;
          const positions = route.stops.map((stop) => stop.position);

          return (
            <Fragment key={route.id}>
              <Polyline
                pathOptions={{
                  color: route.color,
<<<<<<< Updated upstream
                  opacity: isSelected || variant === 'dashboard' ? 0.95 : 0.3,
=======
                  opacity: isSelected ? 0.95 : 0.3,
>>>>>>> Stashed changes
                  weight: isSelected ? 6 : 4,
                }}
                positions={positions}
              />
              {route.stops.map((stop) => (
                <CircleMarker
                  key={`${route.id}-${stop.name}`}
                  center={stop.position}
                  pathOptions={{
                    color: route.color,
                    fillColor: '#ffffff',
<<<<<<< Updated upstream
                    fillOpacity: isSelected || variant === 'dashboard' ? 1 : 0.75,
                    opacity: isSelected || variant === 'dashboard' ? 1 : 0.45,
=======
                    fillOpacity: isSelected ? 1 : 0.75,
                    opacity: isSelected ? 1 : 0.45,
>>>>>>> Stashed changes
                    weight: isSelected ? 3 : 2,
                  }}
                  radius={isSelected ? 5 : 3}
                >
                  <Tooltip direction="top" offset={[0, -6]} opacity={0.95}>
                    <span className="text-xs font-semibold text-slate-800">{stop.name}</span>
                  </Tooltip>
                </CircleMarker>
              ))}
            </Fragment>
          );
        })}
<<<<<<< Updated upstream
        {showIncidents
          ? incidents.map((incident) => (
              <CircleMarker
                key={incident.id}
                center={incident.position}
                pathOptions={{
                  color: incident.status === 'Active' ? '#b91c1c' : '#64748b',
                  fillColor: incident.status === 'Active' ? '#ef4444' : '#94a3b8',
                  fillOpacity: 0.9,
                  opacity: 1,
                  weight: 3,
                }}
                radius={incident.severity === 'Heavy' ? 9 : 7}
              >
                <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
                  <span className="text-xs font-semibold text-slate-800">
                    {incident.route}: {incident.type}
                  </span>
                </Tooltip>
              </CircleMarker>
            ))
          : null}
      </MapContainer>
      <MapLegend showIncidents={showIncidents} />
=======
      </MapContainer>
      <MapLegend />
>>>>>>> Stashed changes
      <div className="absolute bottom-4 left-4 z-[500] max-w-[calc(100%-2rem)] rounded-md bg-white/95 px-4 py-3 text-sm shadow-lg ring-1 ring-slate-200 sm:max-w-72">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: selectedRoute.color }} />
          <p className="font-semibold text-slate-900">{selectedRoute.title}</p>
        </div>
        <p className="mt-1 text-xs text-slate-600">
          {selectedRoute.duration} - {selectedRoute.traffic} traffic
        </p>
      </div>
    </div>
  );
}
