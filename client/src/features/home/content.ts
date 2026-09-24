import type { ComponentType, SVGProps } from 'react';
import type { StaticImageData } from 'next/image';
import { ClockIcon, CloudSunIcon, RouteIcon, TicketIcon } from '@/components/icons';
import cpuPhoto from '@/assets/home/ride-cpu.jpg';
import jaroPhoto from '@/assets/home/ride-jaro.jpg';
import smIloiloPhoto from '@/assets/home/ride-sm-iloilo.jpg';

export type StatTone = 'brand' | 'success' | 'warning' | 'accent';

export type LandingStat = {
  label: string;
  value: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  tone: StatTone;
};

export const landingStats: LandingStat[] = [
  { label: 'Routes Mapped', value: '25', Icon: RouteIcon, tone: 'brand' },
  { label: 'Jeepney Fare', value: '₱13 base', Icon: TicketIcon, tone: 'success' },
  { label: 'Peak Hours', value: '7–9 AM', Icon: ClockIcon, tone: 'warning' },
  { label: 'Weather', value: '28°C Clear', Icon: CloudSunIcon, tone: 'accent' },
];

export type RideTag = {
  label: string;
  tone: 'brand' | 'neutral';
};

export type FrequentRide = {
  id: string;
  from: string;
  to: string;
  title: string;
  duration: string;
  tags: RideTag[];
  photo: StaticImageData;
  favorite?: boolean;
};

export const frequentRides: FrequentRide[] = [
  {
    id: 'cpu',
    from: 'Home',
    to: 'Campus',
    title: 'Central Philippine University',
    duration: '~25 mins',
    tags: [
      { label: 'Jeepney', tone: 'brand' },
      { label: 'Jaro–CPU', tone: 'neutral' },
    ],
    photo: cpuPhoto,
    favorite: true,
  },
  {
    id: 'jaro-plaza',
    from: 'Boarding House',
    to: 'Plaza',
    title: 'Jaro Plaza',
    duration: '~15 mins',
    tags: [{ label: 'Jeepney', tone: 'brand' }],
    photo: jaroPhoto,
  },
  {
    id: 'sm-iloilo',
    from: 'Home',
    to: 'Mall',
    title: 'SM City Iloilo',
    duration: '~30 mins',
    tags: [
      { label: 'Jeepney', tone: 'brand' },
      { label: 'Ungka–SM', tone: 'neutral' },
    ],
    photo: smIloiloPhoto,
  },
];

export type TrafficHighlight = {
  title: string;
  description: string;
};

export const trafficHighlights: TrafficHighlight[] = [
  {
    title: 'Alternative Routes',
    description: 'Always get a Plan B when the main roads are blocked.',
  },
  {
    title: 'Journey Fare Calculator',
    description: 'Never overpay again. Accurate fare computation based on LTFRB matrix.',
  },
];

export type FareRow = {
  mode: string;
  amount: number;
  note: string;
};

export const fareGuide: FareRow[] = [
  { mode: 'Jeepney', amount: 13, note: 'First 4 km, +₱1.80 per km' },
  { mode: 'Tricycle', amount: 25, note: 'Short hops within a district' },
  { mode: 'Taxi', amount: 45, note: 'Flagdown, then metered' },
];

export const fareDiscount = {
  label: 'Students, seniors & PWD',
  value: '20% off',
  note: 'Present a valid ID when boarding.',
};
