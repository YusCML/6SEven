import { useEffect, useMemo } from 'react';
import {
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { LatLng } from '@/features/routes/lib/geo';
import { ILOILO_BOUNDS } from '@/features/routes/lib/iloiloArea';
import type { Pin } from '@/features/routes/lib/landmarks';
import type { RouteView } from '@/features/routes/lib/routeView';
import type { TripOption } from '@/features/routes/lib/tripPlanner';
import type { PinTarget } from './TripPlanner';

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

function pinIcon(letter: string, color: string) {
  return L.divIcon({
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    html: `<span class="grid h-[30px] w-[30px] place-items-center rounded-full border-[3px] border-white text-sm font-black text-white shadow-lg" style="background-color:${color}">${letter}</span>`,
  });
}

const ORIGIN_ICON = pinIcon('A', '#16a34a');
const DESTINATION_ICON = pinIcon('B', '#dc2626');
const WALK_STYLE = { color: '#334155', weight: 4, dashArray: '2 8', lineCap: 'round' as const };

const ILOILO_CENTER: LatLng = [10.7202, 122.5621];
const MAX_BOUNDS = L.latLngBounds(ILOILO_BOUNDS).pad(0.05);

interface RouteMapProps {
  view: RouteView | null;
  color: string;
  title: string;
  trip: TripOption | null;
  walkPaths: Record<number, LatLng[]>;
  origin: Pin | null;
  destination: Pin | null;
  picking: PinTarget | null;
  onMapClick: (point: LatLng) => void;
  onPinMove: (target: PinTarget, point: LatLng) => boolean;
}

function FitTo({ points }: { points: LatLng[] }) {
  const map = useMap();

  useEffect(() => {
    // instant (not animated) so the view always lands, even if the tab isn't painting frames
    if (points.length > 1) map.fitBounds(points, { padding: [40, 40], animate: false });
    else if (points.length === 1) map.setView(points[0], Math.max(map.getZoom(), 15), { animate: false });
  }, [map, points]);

  return null;
}

function MapClicks({ picking, onMapClick }: { picking: PinTarget | null; onMapClick: (point: LatLng) => void }) {
  const map = useMapEvents({
    click(event) {
      if (picking) onMapClick([event.latlng.lat, event.latlng.lng]);
    },
  });

  useEffect(() => {
    map.getContainer().style.cursor = picking ? 'crosshair' : '';
  }, [map, picking]);

  return null;
}

function PinMarker({
  pin,
  target,
  onPinMove,
}: {
  pin: Pin;
  target: PinTarget;
  onPinMove: (target: PinTarget, point: LatLng) => boolean;
}) {
  return (
    <Marker
      position={pin.position}
      icon={target === 'origin' ? ORIGIN_ICON : DESTINATION_ICON}
      draggable
      eventHandlers={{
        dragend(event) {
          const marker = event.target as L.Marker;
          const { lat, lng } = marker.getLatLng();
          if (!onPinMove(target, [lat, lng])) marker.setLatLng(pin.position);
        },
      }}
    >
      <Tooltip direction="top" offset={[0, -14]}>
        {target === 'origin' ? 'From' : 'To'}: {pin.label}
      </Tooltip>
    </Marker>
  );
}

function TripLayer({ trip, walkPaths }: { trip: TripOption; walkPaths: Record<number, LatLng[]> }) {
  return (
    <>
      {trip.legs.map((leg, i) =>
        leg.kind === 'walk' ? (
          <Polyline key={`walk-${i}`} positions={walkPaths[i] ?? [leg.from, leg.to]} pathOptions={WALK_STYLE} />
        ) : (
          <Polyline key={`ride-${i}`} positions={leg.path} pathOptions={{ color: leg.color, weight: 6, opacity: 0.95 }} />
        ),
      )}
      {trip.legs.flatMap((leg, i) =>
        leg.kind === 'ride'
          ? [
              <CircleMarker
                key={`board-${i}`}
                center={leg.board}
                radius={7}
                pathOptions={{ color: leg.color, weight: 3, fillColor: '#ffffff', fillOpacity: 1 }}
              >
                <Tooltip direction="top">
                  Board Route {leg.routeNumber}
                  {leg.boardName ? ` near ${leg.boardName}` : ''}
                </Tooltip>
              </CircleMarker>,
              <CircleMarker
                key={`alight-${i}`}
                center={leg.alight}
                radius={7}
                pathOptions={{ color: leg.color, weight: 3, fillColor: leg.color, fillOpacity: 1 }}
              >
                <Tooltip direction="top">
                  Get off Route {leg.routeNumber}
                  {leg.alightName ? ` near ${leg.alightName}` : ''}
                </Tooltip>
              </CircleMarker>,
            ]
          : [],
      )}
    </>
  );
}

function RouteLayer({ view, color, title }: { view: RouteView; color: string; title: string }) {
  return (
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
    </>
  );
}

export default function RouteMap({
  view,
  color,
  title,
  trip,
  walkPaths,
  origin,
  destination,
  picking,
  onMapClick,
  onPinMove,
}: RouteMapProps) {
  const focus = useMemo<LatLng[]>(
    () => (trip ? trip.legs.flatMap((leg) => (leg.kind === 'ride' ? leg.path : [leg.from, leg.to])) : (view?.path ?? [])),
    [trip, view],
  );

  return (
    <MapContainer
      center={ILOILO_CENTER}
      zoom={13}
      minZoom={12}
      maxBounds={MAX_BOUNDS}
      maxBoundsViscosity={1}
      scrollWheelZoom
      className="isolate h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {trip ? (
        <TripLayer trip={trip} walkPaths={walkPaths} />
      ) : (
        view && view.path.length > 0 && <RouteLayer view={view} color={color} title={title} />
      )}

      {origin && <PinMarker pin={origin} target="origin" onPinMove={onPinMove} />}
      {destination && <PinMarker pin={destination} target="destination" onPinMove={onPinMove} />}

      <MapClicks picking={picking} onMapClick={onMapClick} />
      <FitTo points={focus} />
    </MapContainer>
  );
}
