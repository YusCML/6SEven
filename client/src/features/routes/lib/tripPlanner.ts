import type { RouteData } from '@/types/route';
import { jeepneyFare, JEEPNEY_KMH } from './fare';
import { cumulativeMeters, distanceMeters, pointAlong, slicePath, type LatLng } from './geo';

const STEP_M = 60; // spacing of the places you can get on or off along a route
const MAX_WALK_M = 800; // to the first jeep and from the last one
const MAX_TRANSFER_M = 300; // between two jeeps
const DIRECT_WALK_M = 1200; // offer a walk-only trip when the two places are this close
const WALK_MPS = 1.2; // about 4.3 km/h
const WALK_DETOUR = 1.3; // streets are longer than a straight line
const RIDE_MPS = (JEEPNEY_KMH * 1000) / 3600;
const WAIT_S = 4 * 60; // waiting for each jeep
const TRANSFER_S = 5 * 60; // changing jeeps feels about 5 minutes worse than the clock says
const MAX_OPTIONS = 4;
const MAX_SEARCHES = 10;
const STOP_NAME_M = 500;
const GRID_DEG = 0.003; // ~330 m cells for nearby lookups

export type WalkLeg = {
  kind: 'walk';
  from: LatLng;
  to: LatLng;
  meters: number;
  minutes: number;
};

export type RideLeg = {
  kind: 'ride';
  routeId: string;
  routeNumber: number;
  title: string;
  color: string;
  board: LatLng;
  alight: LatLng;
  boardName: string | null;
  alightName: string | null;
  path: LatLng[];
  meters: number;
  minutes: number;
  fare: number;
};

export type TripLeg = WalkLeg | RideLeg;

export type TripOption = {
  legs: TripLeg[];
  minutes: number;
  fare: number;
  walkMeters: number;
  rides: number;
};

type Node = { route: number; along: number; position: LatLng };

type Network = {
  routes: RouteData[];
  cumulative: number[][];
  lengths: number[];
  nodes: Node[];
  firstNode: number[];
  grid: Map<string, number[]>;
  transfers: { to: number; meters: number }[][];
};

const cellKey = (row: number, col: number) => `${row}:${col}`;
const cellOf = ([lat, lng]: LatLng): [number, number] => [Math.floor(lat / GRID_DEG), Math.floor(lng / GRID_DEG)];

function nearbyNodes(network: Network, point: LatLng, radius: number): { node: number; meters: number }[] {
  const [row, col] = cellOf(point);
  const span = Math.ceil(radius / (GRID_DEG * 110000)) + 1;
  const found: { node: number; meters: number }[] = [];
  for (let r = row - span; r <= row + span; r += 1) {
    for (let c = col - span; c <= col + span; c += 1) {
      for (const node of network.grid.get(cellKey(r, c)) ?? []) {
        const meters = distanceMeters(point, network.nodes[node].position);
        if (meters <= radius) found.push({ node, meters });
      }
    }
  }
  return found;
}

/** Boarding points every STEP_M along each route, plus the short walks that link routes. */
export function buildNetwork(routes: RouteData[]): Network {
  const cumulative = routes.map((route) => cumulativeMeters(route.path));
  const lengths = cumulative.map((c) => c.at(-1) ?? 0);
  const nodes: Node[] = [];
  const firstNode: number[] = [];

  routes.forEach((route, r) => {
    firstNode.push(nodes.length);
    for (let along = 0; along < lengths[r]; along += STEP_M) {
      nodes.push({ route: r, along, position: pointAlong(route.path, cumulative[r], along) });
    }
  });
  firstNode.push(nodes.length);

  const grid = new Map<string, number[]>();
  nodes.forEach((node, i) => {
    const key = cellKey(...cellOf(node.position));
    grid.set(key, [...(grid.get(key) ?? []), i]);
  });

  const partial: Network = { routes, cumulative, lengths, nodes, firstNode, grid, transfers: [] };
  const transfers = nodes.map((node) =>
    nearbyNodes(partial, node.position, MAX_TRANSFER_M)
      .filter(({ node: other }) => nodes[other].route !== node.route)
      .map(({ node: to, meters }) => ({ to, meters })),
  );

  return { ...partial, transfers };
}

const walkSeconds = (meters: number) => (meters * WALK_DETOUR) / WALK_MPS;

type Via = 'board' | 'ride' | 'transfer' | 'alight' | 'walk';

/** Cheapest trip (by time) that avoids the banned routes, as the list of nodes it passes. */
function search(network: Network, origin: LatLng, destination: LatLng, banned: Set<number>) {
  const n = network.nodes.length;
  const ORIGIN = n;
  const DEST = n + 1;
  const cost = new Float64Array(n + 2).fill(Infinity);
  const prev = new Int32Array(n + 2).fill(-1);
  const via: Via[] = new Array(n + 2);
  const done = new Uint8Array(n + 2);

  const nearDestination = new Map(
    nearbyNodes(network, destination, MAX_WALK_M).map(({ node, meters }) => [node, meters]),
  );

  // binary heap of [cost, node]
  const heap: [number, number][] = [];
  const push = (item: [number, number]) => {
    heap.push(item);
    let i = heap.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (heap[parent][0] <= heap[i][0]) break;
      [heap[parent], heap[i]] = [heap[i], heap[parent]];
      i = parent;
    }
  };
  const pop = (): [number, number] => {
    const top = heap[0];
    const last = heap.pop() as [number, number];
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      for (;;) {
        const [l, r] = [2 * i + 1, 2 * i + 2];
        let m = i;
        if (l < heap.length && heap[l][0] < heap[m][0]) m = l;
        if (r < heap.length && heap[r][0] < heap[m][0]) m = r;
        if (m === i) break;
        [heap[m], heap[i]] = [heap[i], heap[m]];
        i = m;
      }
    }
    return top;
  };
  const relax = (from: number, to: number, add: number, how: Via) => {
    const next = cost[from] + add;
    if (next < cost[to]) {
      cost[to] = next;
      prev[to] = from;
      via[to] = how;
      push([next, to]);
    }
  };

  cost[ORIGIN] = 0;
  push([0, ORIGIN]);

  while (heap.length > 0) {
    const [, u] = pop();
    if (done[u]) continue;
    done[u] = 1;
    if (u === DEST) break;

    if (u === ORIGIN) {
      for (const { node, meters } of nearbyNodes(network, origin, MAX_WALK_M)) {
        if (!banned.has(network.nodes[node].route)) relax(ORIGIN, node, walkSeconds(meters) + WAIT_S, 'board');
      }
      continue;
    }

    const node = network.nodes[u];
    const last = network.firstNode[node.route + 1] - 1;
    const next = u === last ? network.firstNode[node.route] : u + 1;
    const rideMeters = u === last ? network.lengths[node.route] - node.along : network.nodes[next].along - node.along;
    relax(u, next, rideMeters / RIDE_MPS, 'ride');

    if (via[u] === 'ride') {
      for (const { to, meters } of network.transfers[u]) {
        if (!banned.has(network.nodes[to].route)) relax(u, to, walkSeconds(meters) + WAIT_S + TRANSFER_S, 'transfer');
      }
      const toDestination = nearDestination.get(u);
      if (toDestination !== undefined) relax(u, DEST, walkSeconds(toDestination), 'alight');
    }
  }

  if (prev[DEST] < 0) return null;
  const steps: { node: number; via: Via }[] = [];
  for (let at = DEST; at !== ORIGIN; at = prev[at]) steps.unshift({ node: at, via: via[at] });
  return steps;
}

function nearestStopName(network: Network, route: number, point: LatLng): string | null {
  const own = network.routes[route];
  const candidates = [own, ...network.routes.filter((r) => r !== own)]
    .flatMap((r) => r.stops)
    .filter((stop) => !stop.name.startsWith('U-turn'));
  const best = candidates.reduce<{ name: string; meters: number } | null>((acc, stop) => {
    const meters = distanceMeters(stop.position, point);
    return meters < STOP_NAME_M && (!acc || meters < acc.meters) ? { name: stop.name, meters } : acc;
  }, null);
  return best ? best.name : null;
}

function walkLeg(from: LatLng, to: LatLng): WalkLeg {
  const meters = distanceMeters(from, to) * WALK_DETOUR;
  return { kind: 'walk', from, to, meters, minutes: Math.max(1, Math.round(meters / WALK_MPS / 60)) };
}

function rideLeg(network: Network, route: number, fromAlong: number, toAlong: number): RideLeg {
  const data = network.routes[route];
  const cumulative = network.cumulative[route];
  const length = network.lengths[route];
  const wraps = toAlong < fromAlong;
  const meters = wraps ? length - fromAlong + toAlong : toAlong - fromAlong;
  const path = wraps
    ? [...slicePath(data.path, cumulative, fromAlong, length), ...slicePath(data.path, cumulative, 0, toAlong)]
    : slicePath(data.path, cumulative, fromAlong, toAlong);
  const board = pointAlong(data.path, cumulative, fromAlong);
  const alight = pointAlong(data.path, cumulative, toAlong);
  return {
    kind: 'ride',
    routeId: data.id,
    routeNumber: data.routeNumber,
    title: data.title,
    color: data.color,
    board,
    alight,
    boardName: nearestStopName(network, route, board),
    alightName: nearestStopName(network, route, alight),
    path,
    meters,
    minutes: Math.max(1, Math.round(meters / RIDE_MPS / 60)),
    fare: jeepneyFare(meters / 1000),
  };
}

function toOption(network: Network, origin: LatLng, destination: LatLng, steps: { node: number; via: Via }[]): TripOption {
  const legs: TripLeg[] = [];
  let rideStart: number | null = null;
  let previous: number | null = null;
  let position = origin;

  const closeRide = () => {
    if (rideStart === null || previous === null) return;
    const start = network.nodes[rideStart];
    const end = network.nodes[previous];
    legs.push(rideLeg(network, start.route, start.along, end.along));
    position = end.position;
    rideStart = null;
  };

  for (const { node, via } of steps) {
    if (node >= network.nodes.length) {
      closeRide();
      legs.push(walkLeg(position, destination));
      break;
    }
    const at = network.nodes[node];
    if (via === 'board' || via === 'transfer') {
      closeRide();
      legs.push(walkLeg(position, at.position));
      rideStart = node;
    }
    previous = node;
  }

  const rides = legs.filter((leg): leg is RideLeg => leg.kind === 'ride');
  const walkMeters = legs.reduce((sum, leg) => (leg.kind === 'walk' ? sum + leg.meters : sum), 0);
  return {
    legs: legs.filter((leg) => leg.kind === 'ride' || leg.meters >= 10),
    minutes: legs.reduce((sum, leg) => sum + leg.minutes, 0) + rides.length * (WAIT_S / 60),
    fare: rides.reduce((sum, leg) => sum + leg.fare, 0),
    walkMeters,
    rides: rides.length,
  };
}

const optionKey = (option: TripOption) =>
  option.legs.map((leg) => (leg.kind === 'ride' ? leg.routeNumber : 'w')).join('-');

/** Up to MAX_OPTIONS ways from origin to destination, quickest first, counting each change of jeep as extra time. */
export function planTrips(network: Network, origin: LatLng, destination: LatLng): TripOption[] {
  const found = new Map<string, TripOption>();
  const queue: Set<number>[] = [new Set()];
  const tried = new Set<string>();

  for (let searches = 0; queue.length > 0 && searches < MAX_SEARCHES; searches += 1) {
    const banned = queue.shift() as Set<number>;
    const steps = search(network, origin, destination, banned);
    if (!steps) continue;
    const option = toOption(network, origin, destination, steps);
    if (!found.has(optionKey(option))) found.set(optionKey(option), option);

    const usedRoutes = option.legs.flatMap((leg) =>
      leg.kind === 'ride' ? [network.routes.findIndex((r) => r.id === leg.routeId)] : [],
    );
    for (const route of usedRoutes) {
      const next = new Set([...banned, route]);
      const key = [...next].sort((a, b) => a - b).join(',');
      if (!tried.has(key)) {
        tried.add(key);
        queue.push(next);
      }
    }
  }

  const burden = (option: TripOption) => option.minutes + (Math.max(option.rides, 1) - 1) * (TRANSFER_S / 60);
  const jeepOptions = [...found.values()].sort((a, b) => burden(a) - burden(b)).slice(0, MAX_OPTIONS);
  const walkOnly =
    distanceMeters(origin, destination) <= DIRECT_WALK_M
      ? [toOption(network, origin, destination, [{ node: network.nodes.length + 1, via: 'walk' }])]
      : [];
  return [...walkOnly, ...jeepOptions].sort((a, b) => burden(a) - burden(b));
}
