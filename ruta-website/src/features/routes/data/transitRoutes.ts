export type TrafficLevel = 'Light' | 'Moderate' | 'Heavy';

export type TransitStop = {
  name: string;
  position: [number, number];
};

export type TransitRoute = {
  id: string;
  title: string;
  duration: string;
  description: string;
  traffic: TrafficLevel;
  color: string;
  stops: TransitStop[];
};

export type TransitIncident = {
  id: number;
  routeId: string;
  route: string;
  type: string;
  status: 'Active' | 'Resolved';
  time: string;
  position: [number, number];
  severity: 'Moderate' | 'Heavy';
};

export const transitRoutes: TransitRoute[] = [
  {
    id: 'mrt-3-alternative',
    title: 'MRT-3 Alternative',
    duration: '42 mins',
    description: 'Best efficiency route, slight walking required.',
    traffic: 'Moderate',
    color: '#2563eb',
    stops: [
      { name: 'North Avenue', position: [14.6544, 121.0321] },
      { name: 'Quezon Avenue', position: [14.6426, 121.0384] },
      { name: 'GMA-Kamuning', position: [14.6339, 121.0457] },
      { name: 'Araneta Center-Cubao', position: [14.6196, 121.0527] },
      { name: 'Ortigas', position: [14.5867, 121.057] },
      { name: 'Shaw Boulevard', position: [14.5814, 121.0534] },
      { name: 'Guadalupe', position: [14.5666, 121.0452] },
      { name: 'Ayala', position: [14.5492, 121.0279] },
    ],
  },
  {
    id: 'edsa-bus-carousel',
    title: 'EDSA Bus Carousel',
    duration: '58 mins',
    description: 'Heavy traffic warning near Cubao.',
    traffic: 'Heavy',
    color: '#dc2626',
    stops: [
      { name: 'Monumento', position: [14.6577, 120.9849] },
      { name: 'Balintawak', position: [14.6579, 121.0046] },
      { name: 'North Avenue', position: [14.6544, 121.0321] },
      { name: 'Quezon Avenue', position: [14.6426, 121.0384] },
      { name: 'Araneta Center-Cubao', position: [14.6196, 121.0527] },
      { name: 'Ortigas', position: [14.5867, 121.057] },
      { name: 'Guadalupe', position: [14.5666, 121.0452] },
      { name: 'Ayala', position: [14.5492, 121.0279] },
      { name: 'PITX', position: [14.5099, 120.9917] },
    ],
  },
];

export const liveIncidents: TransitIncident[] = [
  {
    id: 1,
    routeId: 'edsa-bus-carousel',
    route: 'EDSA Bus Carousel',
    type: 'Heavy Traffic',
    status: 'Active',
    time: '5 mins ago',
    position: [14.6196, 121.0527],
    severity: 'Heavy',
  },
  {
    id: 2,
    routeId: 'mrt-3-alternative',
    route: 'MRT-3 Ayala',
    type: 'Long Lines',
    status: 'Active',
    time: '12 mins ago',
    position: [14.5492, 121.0279],
    severity: 'Moderate',
  },
  {
    id: 3,
    routeId: 'mrt-3-alternative',
    route: 'MRT-3 Shaw Boulevard',
    type: 'Platform crowding cleared',
    status: 'Resolved',
    time: '1 hr ago',
    position: [14.5814, 121.0534],
    severity: 'Moderate',
  },
];
