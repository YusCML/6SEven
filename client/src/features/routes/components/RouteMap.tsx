import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { RouteData } from '@/types/route';
import { getRoadPath } from '@/features/routes/lib/getRoadPath';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const ILOILO_CENTER: [number, number] = [10.7202, 122.5621];

interface RouteMapProps {
  routes: RouteData[];
  selectedRouteId: string;
}

export default function RouteMap({ routes, selectedRouteId }: RouteMapProps) {
  const [resolvedPaths, setResolvedPaths] = useState<Record<string, [number, number][]>>({});

  const selectedRoute = routes.find((route) => route.id === selectedRouteId);

  useEffect(() => {
    if (!selectedRoute || resolvedPaths[selectedRoute.id]) return;

    let cancelled = false;

    async function resolveSelected(route: RouteData) {
      const path = await getRoadPath(route.path);
      if (!cancelled) {
        setResolvedPaths((current) => ({ ...current, [route.id]: path }));
      }
    }

    resolveSelected(selectedRoute);

    return () => {
      cancelled = true;
    };
  }, [selectedRoute, resolvedPaths]);

  const selectedPath = (selectedRoute && resolvedPaths[selectedRoute.id]) ?? selectedRoute?.path ?? [];

  return (
    <MapContainer center={ILOILO_CENTER} zoom={13} scrollWheelZoom className="isolate h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {selectedRoute && selectedPath.length > 0 && (
        <Polyline
          key={selectedRoute.id}
          positions={selectedPath}
          pathOptions={{
            color: selectedRoute.color,
            weight: 6,
            opacity: 1,
          }}
        />
      )}

      {selectedRoute && selectedPath.length > 0 && (
        <>
          <Marker position={selectedPath[0]} icon={defaultIcon}>
            <Popup>{selectedRoute.title} — Start</Popup>
          </Marker>
          <Marker position={selectedPath[selectedPath.length - 1]} icon={defaultIcon}>
            <Popup>{selectedRoute.title} — End</Popup>
          </Marker>
        </>
      )}
    </MapContainer>
  );
}
