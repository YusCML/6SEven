export type RouteCategory = 'recommended' | 'loop';

export interface JourneySegment {
  mode: string;
  from: string;
  to: string;
  duration: string;
  distance?: string;
}

export interface RouteStop {
  name: string;
  position: [number, number];
}

export interface RouteData {
  id: string;
  routeNumber: number;
  title: string;
  duration: string;
  description: string;
  color: string;
  path: [number, number][];
  turnIndex: number;
  stops: RouteStop[];
  fare: string;
  distance: string;
  category: RouteCategory;
  segments: JourneySegment[];
}
