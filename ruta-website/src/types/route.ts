export interface JourneySegment {
  mode: string; // "Jeepney", "Tricycle", "MRT", "Walk", etc.
  from: string;
  to: string;
  duration: string;
  distance?: string;
}

export interface RouteData {
  id: string;
  title: string;
  duration: string;
  description: string;
  color: string;
  path: [number, number][];
  fare: string;
  distance: string;
  category?: 'fastest' | 'cheapest' | 'least-walk';
  segments: JourneySegment[];
}