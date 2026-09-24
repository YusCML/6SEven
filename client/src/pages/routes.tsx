import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import PageMeta from '@/components/PageMeta';
import MapLegend from '@/features/routes/components/MapLegend';
import RouteOptionCard from '@/features/routes/components/RouteOptionCard';
import TripOptionCard from '@/features/routes/components/TripOptionCard';
import TripPlanner, { type PinTarget } from '@/features/routes/components/TripPlanner';
import type { LatLng } from '@/features/routes/lib/geo';
import { isPinnable } from '@/features/routes/lib/iloiloArea';
import { nearestLandmark, type Pin } from '@/features/routes/lib/landmarks';
import { routeView, type RouteMode } from '@/features/routes/lib/routeView';
import { buildNetwork, planTrips, type TripOption } from '@/features/routes/lib/tripPlanner';
import { useRoutes } from '@/hooks/useRoutes';
import { reverseGeocode } from '@/services/places.service';
import { fetchWalkingPath } from '@/services/walking.service';

const RouteMap = dynamic(() => import('@/features/routes/components/RouteMap'), {
  ssr: false,
  loading: () => <p className="text-slate-400 font-mono text-sm">Loading map…</p>,
});

const MODE_TABS: { id: RouteMode; label: string }[] = [
  { id: 'loop', label: 'Loop' },
  { id: 'oneWay', label: 'One way' },
];

const MIN_TRAIL_M = 30;

type WalkTrails = { trip: TripOption | null; paths: Record<number, LatLng[]> };

export default function RouteExplorer() {
  const { routes, loading, error } = useRoutes();
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [mode, setMode] = useState<RouteMode>('loop');
  const [origin, setOrigin] = useState<Pin | null>(null);
  const [destination, setDestination] = useState<Pin | null>(null);
  const [picking, setPicking] = useState<PinTarget | null>('origin');
  const [notice, setNotice] = useState<string | null>(null);
  const [tripIndex, setTripIndex] = useState(0);
  const [showTrip, setShowTrip] = useState(true);
  const [trails, setTrails] = useState<WalkTrails>({ trip: null, paths: {} });

  const views = useMemo(() => new Map(routes.map((route) => [route.id, routeView(route, mode)])), [routes, mode]);
  const network = useMemo(() => (routes.length > 0 ? buildNetwork(routes) : null), [routes]);
  // Plan on the pins' positions only, so a place name arriving later doesn't re-plan or re-zoom the map.
  const originPoint = origin?.position ?? null;
  const destinationPoint = destination?.position ?? null;
  const options = useMemo(
    () => (network && originPoint && destinationPoint ? planTrips(network, originPoint, destinationPoint) : null),
    [network, originPoint, destinationPoint],
  );

  const activeRoute = routes.find((route) => route.id === selectedRouteId) ?? routes[0] ?? null;
  const trip = showTrip && options ? (options[tripIndex] ?? null) : null;

  useEffect(() => {
    if (!trip) return undefined;
    const controller = new AbortController();
    const walks = trip.legs.flatMap((leg, i) => (leg.kind === 'walk' && leg.meters >= MIN_TRAIL_M ? [{ leg, i }] : []));

    Promise.all(
      walks.map(({ leg, i }) => fetchWalkingPath(leg.from, leg.to, controller.signal).then((path) => [i, path] as const)),
    ).then((entries) => {
      if (!controller.signal.aborted) setTrails({ trip, paths: Object.fromEntries(entries) });
    });

    return () => controller.abort();
  }, [trip]);

  const setPin = (target: PinTarget) => (target === 'origin' ? setOrigin : setDestination);

  function placePin(target: PinTarget, point: LatLng): boolean {
    if (!isPinnable(point)) {
      setNotice('Pick a spot on land inside Iloilo City.');
      return false;
    }
    setNotice(null);
    setTripIndex(0);
    setShowTrip(true);
    setPin(target)({ position: point, label: nearestLandmark(routes, point) });

    reverseGeocode(point).then((name) => {
      if (!name) return;
      // the pin may have been swapped or moved meanwhile: name whichever pin still sits on this point
      const relabel = (current: Pin | null) => (current && current.position === point ? { ...current, label: name } : current);
      setOrigin(relabel);
      setDestination(relabel);
    });
    return true;
  }

  function handleMapClick(point: LatLng) {
    if (!picking || !placePin(picking, point)) return;
    setPicking(picking === 'origin' && !destination ? 'destination' : null);
  }

  function handleSwap() {
    setOrigin(destination);
    setDestination(origin);
    setTripIndex(0);
    setShowTrip(true);
  }

  function handleClear() {
    setOrigin(null);
    setDestination(null);
    setPicking('origin');
    setNotice(null);
    setTripIndex(0);
  }

  return (
    <div className="h-[calc(100vh-73px)] flex flex-col md:flex-row overflow-hidden">
      <PageMeta
        title="Routes"
        description="Pin where you are and where you are going to see which Iloilo City jeepneys to ride, where to change, and the fare."
      />
      <div className="w-full md:w-96 bg-white border-r border-slate-200 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <TripPlanner
            origin={origin}
            destination={destination}
            picking={picking}
            notice={notice}
            onPick={(target) => setPicking(picking === target ? null : target)}
            onSwap={handleSwap}
            onClear={handleClear}
          />
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {options && origin && destination && (
            <section className="pt-4">
              <h3 className="font-bold text-sm text-slate-900 mb-3">
                {options.length === 0
                  ? 'No jeepney trip found'
                  : options.length === 1
                    ? '1 way to get there'
                    : `${options.length} ways to get there`}
              </h3>
              {options.length === 0 && (
                <p className="mb-4 text-sm text-slate-500">
                  No jeep passes within walking distance of both points. Try a spot closer to a main road.
                </p>
              )}
              <div className="space-y-3 pb-4">
                {options.map((option, i) => (
                  <TripOptionCard
                    key={i}
                    option={option}
                    origin={origin}
                    destination={destination}
                    selected={showTrip && i === tripIndex}
                    onClick={() => {
                      setTripIndex(i);
                      setShowTrip(true);
                    }}
                  />
                ))}
              </div>
            </section>
          )}

          <div className="pt-4 pb-2">
            <h3 className="font-bold text-sm text-slate-900 mb-3">
              {loading ? 'Loading routes…' : `${routes.length} Jeep Routes`}
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {MODE_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setMode(tab.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-full transition ${
                    mode === tab.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="py-4 text-sm text-red-600">Could not load routes: {error}</p>}

          <div className="space-y-3 pb-4">
            {routes.map((route) => {
              const view = views.get(route.id);
              return view ? (
                <RouteOptionCard
                  key={route.id}
                  route={route}
                  view={view}
                  mode={mode}
                  selected={!trip && route.id === activeRoute?.id}
                  onClick={() => {
                    setSelectedRouteId(route.id);
                    setShowTrip(false);
                  }}
                />
              ) : null;
            })}
          </div>
        </div>
      </div>
      <div className="flex-grow bg-slate-100 relative">
        <MapLegend />
        <RouteMap
          view={activeRoute ? (views.get(activeRoute.id) ?? null) : null}
          color={activeRoute?.color ?? '#0f172a'}
          title={activeRoute?.title ?? ''}
          trip={trip}
          walkPaths={trails.trip === trip ? trails.paths : {}}
          origin={origin}
          destination={destination}
          picking={picking}
          onMapClick={handleMapClick}
          onPinMove={placePin}
        />
      </div>
    </div>
  );
}
