import { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { RouteData } from '@/types/route';

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

function FitToPath({ path }: { path: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (path.length > 1) map.fitBounds(path, { padding: [32, 32] });
  }, [map, path]);

  return null;
}

export default function RouteMap({ routes, selectedRouteId }: RouteMapProps) {
  const selectedRoute = routes.find((route) => route.id === selectedRouteId);
  const path = selectedRoute?.path ?? [];

  return (
    <MapContainer center={ILOILO_CENTER} zoom={13} scrollWheelZoom className="isolate h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {selectedRoute && path.length > 0 && (
        <>
          <Polyline
            key={selectedRoute.id}
            positions={path}
            pathOptions={{
              color: selectedRoute.color,
              weight: 6,
              opacity: 1,
            }}
          />
          <Marker position={path[0]} icon={defaultIcon}>
            <Popup>
              {selectedRoute.title} — {selectedRoute.segments[0]?.from ?? 'Terminal'}
            </Popup>
          </Marker>
          <FitToPath path={path} />
        </>
      )}
    </MapContainer>
  );
}
