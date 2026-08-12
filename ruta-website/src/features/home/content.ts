import type { StaticImageData } from 'next/image';
import makatiPhoto from '@/assets/landing/ride-makati.jpg';
import moaPhoto from '@/assets/landing/ride-moa.jpg';
import upPhoto from '@/assets/landing/ride-up.jpg';

/**
 * Placeholder content for the landing page.
 *
 * Kept out of the components so the markup stays a single loop per section
 * rather than three near-identical copies, and so swapping to real API data
 * later means replacing this file, not rewriting JSX.
 */

export type StatTone = 'brand' | 'success' | 'warning' | 'accent';

export type LandingStat = {
  label: string;
  value: string;
  icon: string;
  tone: StatTone;
};

export const landingStats: LandingStat[] = [
  { label: 'Active Routes', value: '482', icon: '🚏', tone: 'brand' },
  { label: 'Status', value: 'Normal', icon: '✅', tone: 'success' },
  { label: 'Reports', value: '3 Alerts', icon: '⚠️', tone: 'warning' },
  { label: 'Weather', value: '28°C Clear', icon: '🌤️', tone: 'accent' },
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
    id: 'up-diliman',
    from: 'Home',
    to: 'Campus',
    title: 'University of the Philippines',
    duration: '~45 mins',
    tags: [
      { label: 'Jeepney', tone: 'brand' },
      { label: 'LRT-2', tone: 'neutral' },
    ],
    photo: upPhoto,
    favorite: true,
  },
  {
    id: 'moa',
    from: 'Boarding House',
    to: 'Mall',
    title: 'SM Mall of Asia',
    duration: '~30 mins',
    tags: [{ label: 'UV Express', tone: 'brand' }],
    photo: moaPhoto,
  },
  {
    id: 'makati-cbd',
    from: 'Home',
    to: 'Office',
    title: 'Makati CBD (Ayala Ave)',
    duration: '~55 mins',
    tags: [
      { label: 'P2P Bus', tone: 'brand' },
      { label: 'MRT-3', tone: 'neutral' },
    ],
    photo: makatiPhoto,
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
