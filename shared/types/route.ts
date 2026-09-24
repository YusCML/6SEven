export type RouteCategory = 'recommended' | 'loop';

export type LatLng = [number, number];

export type JourneySegment = {
  mode: string;
  from: string;
  to: string;
  duration: string;
  distance?: string;
};

export type RouteStop = {
  name: string;
  position: LatLng;
};

export type Route = {
  id: string;
  routeNumber: number;
  title: string;
  duration: string;
  description: string;
  color: string;
  fare: string;
  distance: string;
  category: RouteCategory;
  path: LatLng[];
  turnIndex: number;
  stops: RouteStop[];
  segments: JourneySegment[];
};
