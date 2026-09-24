import type { RouteModel, SegmentModel } from '@/generated/prisma/models';
import { prisma } from '@/db/prisma';
import { NotFoundError } from '@/errors';
import routeData from '../../prisma/data/routes.json';

export type RouteCategory = 'recommended' | 'loop';

export type JourneySegment = {
  mode: string;
  from: string;
  to: string;
  duration: string;
  distance?: string;
};

export type RouteStop = {
  name: string;
  position: [number, number];
};

export type RouteRecord = {
  id: string;
  routeNumber: number;
  title: string;
  duration: string;
  description: string;
  color: string;
  fare: string;
  distance: string;
  category: RouteCategory;
  path: [number, number][];
  turnIndex: number;
  stops: RouteStop[];
  segments: JourneySegment[];
};

type RouteWithSegments = RouteModel & { segments: SegmentModel[] };

// Landmark stops and the one-way turning point are static reference data kept next to the seed.
const STATIC_BY_NUMBER = new Map(
  routeData.map((route) => [
    route.routeNumber,
    {
      turnIndex: route.turnIndex,
      stops: route.stops.map((stop): RouteStop => ({
        name: stop.name,
        position: [stop.position[0], stop.position[1]],
      })),
    },
  ]),
);

function isCoordinate(value: unknown): value is [number, number] {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === 'number' &&
    typeof value[1] === 'number' &&
    Number.isFinite(value[0]) &&
    Number.isFinite(value[1])
  );
}

function toCoordinates(value: unknown): [number, number][] {
  if (!Array.isArray(value)) return [];
  return value.filter(isCoordinate);
}

function toCategory(value: string): RouteCategory {
  return value === 'loop' ? 'loop' : 'recommended';
}

function toSegment(segment: SegmentModel): JourneySegment {
  return {
    mode: segment.mode,
    from: segment.from,
    to: segment.to,
    duration: segment.duration,
    ...(segment.distance ? { distance: segment.distance } : {}),
  };
}

export function toRecord(route: RouteWithSegments): RouteRecord {
  return {
    id: route.id,
    routeNumber: route.routeNumber,
    title: route.title,
    duration: route.duration,
    description: route.description,
    color: route.color,
    fare: route.fare,
    distance: route.distance,
    category: toCategory(route.category),
    path: toCoordinates(route.path),
    turnIndex: STATIC_BY_NUMBER.get(route.routeNumber)?.turnIndex ?? 0,
    stops: STATIC_BY_NUMBER.get(route.routeNumber)?.stops ?? [],
    segments: [...route.segments].sort((a, b) => a.order - b.order).map(toSegment),
  };
}

export async function listRoutes(): Promise<RouteRecord[]> {
  const routes = await prisma.route.findMany({
    include: { segments: { orderBy: { order: 'asc' } } },
    orderBy: { routeNumber: 'asc' },
  });

  return routes.map(toRecord);
}

async function findRouteById(id: string): Promise<RouteRecord | null> {
  const route = await prisma.route.findUnique({ where: { id }, include: { segments: { orderBy: { order: 'asc' } } } });
  return route ? toRecord(route) : null;
}

async function findRouteByNumber(routeNumber: number): Promise<RouteRecord | null> {
  const route = await prisma.route.findUnique({ where: { routeNumber }, include: { segments: { orderBy: { order: 'asc' } } } });
  return route ? toRecord(route) : null;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function findRoute(idOrNumber: string): Promise<RouteRecord | null> {
  const asNumber = Number(idOrNumber);

  if (Number.isInteger(asNumber)) return findRouteByNumber(asNumber);
  if (UUID_PATTERN.test(idOrNumber)) return findRouteById(idOrNumber);

  return null;
}

export async function getRoute(idOrNumber: string): Promise<RouteRecord> {
  const route = await findRoute(idOrNumber);

  if (!route) throw new NotFoundError('Route not found.');

  return route;
}
