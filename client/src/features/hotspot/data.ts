import type { StaticImageData } from 'next/image';
import emperador from '@/assets/landing/hero-emperador.jpg';
import cpu from '@/assets/landing/ride-cpu.jpg';
import jaro from '@/assets/landing/ride-jaro.jpg';
import smIloilo from '@/assets/landing/ride-sm-iloilo.jpg';
import esplanadePhoto from '@/assets/hotspot/esplanade.jpg';
import laPazPhoto from '@/assets/hotspot/la-paz.jpg';
import moloPhoto from '@/assets/hotspot/molo.jpg';
import muellePhoto from '@/assets/hotspot/muelle.jpg';
import tagbakPhoto from '@/assets/hotspot/tagbak.jpg';
import ungkaPhoto from '@/assets/hotspot/ungka.jpg';
export const CATEGORIES = ['All', 'Landmark', 'Transit Hub', 'Food', 'Study Spot'] as const;

export type HotspotCategory = (typeof CATEGORIES)[number];

export type Hotspot = {
  id: string;
  title: string;
  location: string;
  category: Exclude<HotspotCategory, 'All'>;
  note: string;
  // Set to a local import (preferred) or a remote URL string. Only fill this in
  // where the image really is that place — anything unset draws a generated
  // cover instead of borrowing an unrelated photo.
  photo?: StaticImageData | string;
  coverHeight: number;
  author: string;
  saves: number;
  nearestRide: string;
};

// Placeholder content. Nothing here is persisted — the Hotspot feature is UI
// only for now, so this stands in for what the API would return. Cards draw a
// generated cover; drop real photos in @/assets/hotspot and swap in an import.
export const HOTSPOTS: Hotspot[] = [
  {
    id: 'emperador',
    title: 'Emperador Clock Tower',
    location: 'Iloilo Business Park, Mandurriao',
    category: 'Landmark',
    note: 'Best light just before sunset. Plenty of space to wait for a ride.',
    photo: emperador,
    coverHeight: 260,
    author: 'shi',
    saves: 128,
    nearestRide: 'Mandurriao jeepney',
  },
  {
    id: 'sm-iloilo',
    title: 'SM City Iloilo Terminal',
    location: 'Benigno Aquino Ave, Mandurriao',
    category: 'Transit Hub',
    note: 'Covered loading bay. Queues move fastest on the north side.',
    photo: smIloilo,
    coverHeight: 200,
    author: 'nherf',
    saves: 96,
    nearestRide: 'Ungka–SM route',
  },
  {
    id: 'jaro-plaza',
    title: 'Jaro Plaza & Belfry',
    location: 'Jaro District',
    category: 'Landmark',
    note: 'Quiet on weekday mornings. Tricycles line up along the east gate.',
    photo: jaro,
    coverHeight: 240,
    author: 'denver',
    saves: 74,
    nearestRide: 'Jaro CPU jeepney',
  },
  {
    id: 'cpu',
    title: 'CPU Main Gate',
    location: 'Central Philippine University, Jaro',
    category: 'Study Spot',
    note: 'Cafes across the road stay open late during exam week.',
    photo: cpu,
    coverHeight: 180,
    author: 'novie',
    saves: 61,
    nearestRide: 'Jaro CPU jeepney',
  },
  {
    id: 'esplanade',
    title: 'Iloilo River Esplanade',
    location: 'Diversion Road',
    category: 'Landmark',
    note: 'Long walk but flat the whole way. Food carts near Gate 3 after 5pm.',
    photo: esplanadePhoto,
    coverHeight: 300,
    author: 'bryan',
    saves: 152,
    nearestRide: 'Diversion loop',
  },
  {
    id: 'tagbak',
    title: 'Tagbak Terminal',
    location: 'Jaro, northbound',
    category: 'Transit Hub',
    note: 'Departures for northern Iloilo towns. Arrive early on weekends.',
    photo: tagbakPhoto,
    coverHeight: 210,
    author: 'joe',
    saves: 43,
    nearestRide: 'Northbound vans',
  },
  {
    id: 'la-paz',
    title: 'La Paz Public Market',
    location: 'La Paz District',
    category: 'Food',
    note: 'Batchoy row. Busiest 11am to 1pm — go early or go late.',
    photo: laPazPhoto,
    coverHeight: 270,
    author: 'zephaniah',
    saves: 210,
    nearestRide: 'La Paz jeepney',
  },
  {
    id: 'molo',
    title: 'Molo Plaza',
    location: 'Molo District',
    category: 'Food',
    note: 'Pancit molo stalls open by mid-morning. Shaded benches all around.',
    photo: moloPhoto,
    coverHeight: 190,
    author: 'shi',
    saves: 88,
    nearestRide: 'Molo jeepney',
  },
  {
    id: 'muelle',
    title: 'Muelle Loney Street',
    location: 'City Proper',
    category: 'Landmark',
    note: 'Heritage row along the river. Narrow footpath, watch for trucks.',
    photo: muellePhoto,
    coverHeight: 230,
    author: 'nherf',
    saves: 37,
    nearestRide: 'City Proper loop',
  },
  {
    id: 'ungka',
    title: 'Ungka Flyover Stop',
    location: 'Pavia boundary',
    category: 'Transit Hub',
    note: 'Transfer point for Pavia and Sta. Barbara rides.',
    photo: ungkaPhoto,
    coverHeight: 250,
    author: 'denver',
    saves: 55,
    nearestRide: 'Pavia route',
  },
];

export function hotspotsBy(author: string): Hotspot[] {
  return HOTSPOTS.filter((hotspot) => hotspot.author.toLowerCase() === author.toLowerCase());
}
