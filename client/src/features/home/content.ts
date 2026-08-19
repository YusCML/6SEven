import type { ComponentType, SVGProps } from 'react';
import type { StaticImageData } from 'next/image';
import { AlertTriangleIcon, CloudSunIcon, RouteIcon, ShieldCheckIcon } from '@/components/icons';
import cpuPhoto from '@/assets/landing/ride-cpu.jpg';
import jaroPhoto from '@/assets/landing/ride-jaro.jpg';
import smIloiloPhoto from '@/assets/landing/ride-sm-iloilo.jpg';

export type StatTone = 'brand' | 'success' | 'warning' | 'accent';

export type LandingStat = {
  label: string;
  value: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  tone: StatTone;
};

export const landingStats: LandingStat[] = [
  { label: 'Active Routes', value: '482', Icon: RouteIcon, tone: 'brand' },
  { label: 'Status', value: 'Normal', Icon: ShieldCheckIcon, tone: 'success' },
  { label: 'Reports', value: '3 Alerts', Icon: AlertTriangleIcon, tone: 'warning' },
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
    duration: '~45 mins',
    tags: [
      { label: 'Jeepney', tone: 'brand' },
      { label: 'LRT-2', tone: 'neutral' },
    ],
    photo: cpuPhoto,
    favorite: true,
  },
  {
    id: 'jaro-plaza',
    from: 'Boarding House',
    to: 'Plaza',
    title: 'Jaro Plaza',
    duration: '~30 mins',
    tags: [{ label: 'UV Express', tone: 'brand' }],
    photo: jaroPhoto,
  },
  {
    id: 'sm-iloilo',
    from: 'Home',
    to: 'Mall',
    title: 'SM City Iloilo',
    duration: '~55 mins',
    tags: [
      { label: 'P2P Bus', tone: 'brand' },
      { label: 'MRT-3', tone: 'neutral' },
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
