import { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { RouteView } from '@/features/routes/lib/routeView';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function stopIcon(number: number, color: string) {
  return L.divIcon({
    className: '',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    html: `<span class="grid h-[22px] w-[22px] place-items-center rounded-full border-2 bg-white text-[10px] font-black text-slate-900 shadow" style="border-color:${color}">${number}</span>`,
  });
}

const ILOILO_CENTER: [number, number] = [10.7202, 122.5621];

interface RouteMapProps {
  view: RouteView | null;
  color: string;
  title: string;
}

function FitToPath({ path }: { path: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (path.length > 1) map.fitBounds(path, { padding: [32, 32] });
  }, [map, path]);

  return null;
}

export default function RouteMap({ view, color, title }: RouteMapProps) {
  return (
    <MapContainer center={ILOILO_CENTER} zoom={13} scrollWheelZoom className="isolate h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {view && view.path.length > 0 && (
        <>
          <Polyline key={title} positions={view.path} pathOptions={{ color, weight: 6, opacity: 1 }} />
          <Marker position={view.path[0]} icon={defaultIcon}>
            <Popup>
              {title} — {view.terminal}
            </Popup>
          </Marker>
          {view.stops.map((stop) => (
            <Marker key={`${stop.number}-${stop.name}`} position={stop.position} icon={stopIcon(stop.number, color)}>
              <Tooltip direction="top" offset={[0, -10]}>
                {stop.number}. {stop.name}
              </Tooltip>
            </Marker>
          ))}
          <FitToPath path={view.path} />
        </>
      )}
    </MapContainer>
  );
}
