export type Plan = {
  id: 'free' | 'plus';
  name: string;
  tagline: string;
  monthly: number;
  yearly: number;
  features: string[];
  missing?: string[];
};

// Placeholder pricing. There is no billing integration — this page is UI only.
export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Commuter',
    tagline: 'Everything you need for the daily ride.',
    monthly: 0,
    yearly: 0,
    features: [
      'Route comparison with fares and travel time',
      'Live incident feed',
      'Browse and save Hotspot places',
      'Three saved routes',
    ],
    missing: ['Offline route packs', 'Priority incident alerts', 'Fare history'],
  },
  {
    id: 'plus',
    name: 'RUTA Plus',
    tagline: 'For people who are on the road every day.',
    monthly: 99,
    yearly: 949,
    features: [
      'Unlimited saved routes',
      'Offline route packs for weak signal areas',
      'Priority incident alerts before they hit the feed',
      'Fare history and monthly spend summary',
      'Post unlimited Hotspot places',
      'No ads anywhere in the app',
    ],
  },
];

export const PERKS = [
  {
    title: 'Plan without signal',
    body: 'Download route packs for Iloilo City and keep comparing rides when the connection drops.',
  },
  {
    title: 'Know before the queue',
    body: 'Priority alerts reach you ahead of the public feed, so you can reroute before the terminal fills.',
  },
  {
    title: 'Track what you spend',
    body: 'Every logged trip rolls into a monthly fare summary you can actually budget against.',
  },
];
