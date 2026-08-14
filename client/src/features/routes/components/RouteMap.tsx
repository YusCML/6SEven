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

  useEffect(() => {
    let cancelled = false;

    async function resolveAll() {
      const entries = await Promise.all(
        routes.map(async (route) => {
          const path = await getRoadPath(route.path);
          return [route.id, path] as const;
        })
      );
      if (!cancelled) {
        setResolvedPaths(Object.fromEntries(entries));
      }
    }

    resolveAll();
    return () => {
      cancelled = true;
    };
  }, [routes]);

  const selectedRoute = routes.find((r) => r.id === selectedRouteId);
  const selectedPath = resolvedPaths[selectedRouteId] ?? selectedRoute?.path ?? [];

  return (
    <MapContainer center={ILOILO_CENTER} zoom={13} scrollWheelZoom className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {routes.map((route) => {
        const isSelected = route.id === selectedRouteId;
        const path = resolvedPaths[route.id] ?? route.path;
        return (
          <Polyline
            key={route.id}
            positions={path}
            pathOptions={{
              color: route.color,
              weight: isSelected ? 6 : 3,
              opacity: isSelected ? 1 : 0.35,
            }}
          />
        );
      })}

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