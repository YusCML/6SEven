import type { RouteModel, SegmentModel } from '@/generated/prisma/models';
import { prisma } from '@/db/prisma';
import { NotFoundError } from '@/errors';

export type RouteCategory = 'recommended' | 'loop';

export type JourneySegment = {
  mode: string;
  from: string;
  to: string;
  duration: string;
  distance?: string;
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
  segments: JourneySegment[];
};

type RouteWithSegments = RouteModel & { segments: SegmentModel[] };

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
    segments: [...route.segments].sort((a, b) => a.order - b.order).map(toSegment),
  };
}

const withSegments = { segments: { orderBy: { order: 'asc' } } } as const;

export async function listRoutes(): Promise<RouteRecord[]> {
  const routes = await prisma.route.findMany({
    include: withSegments,
    orderBy: { routeNumber: 'asc' },
  });

  return routes.map(toRecord);
}

async function findRouteById(id: string): Promise<RouteRecord | null> {
  const route = await prisma.route.findUnique({ where: { id }, include: withSegments });
  return route ? toRecord(route) : null;
}

async function findRouteByNumber(routeNumber: number): Promise<RouteRecord | null> {
  const route = await prisma.route.findUnique({ where: { routeNumber }, include: withSegments });
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
