import type { StaticImageData } from 'next/image';
import emperador from '@/assets/home/hero-emperador.jpg';
import cpu from '@/assets/home/ride-cpu.jpg';
import jaro from '@/assets/home/ride-jaro.jpg';
import smIloilo from '@/assets/home/ride-sm-iloilo.jpg';
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
  photo?: StaticImageData | string;
  coverHeight: number;
  author: string;
  saves: number;
  likes: number;
  comments: number;
  nearestRide: string;
};

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
    likes: 342,
    comments: 18,
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
    likes: 204,
    comments: 11,
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
    likes: 188,
    comments: 9,
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
    likes: 147,
    comments: 23,
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
    likes: 401,
    comments: 27,
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
    likes: 96,
    comments: 5,
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
    likes: 528,
    comments: 44,
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
    likes: 219,
    comments: 14,
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
    likes: 83,
    comments: 6,
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
    likes: 112,
    comments: 8,
    nearestRide: 'Pavia route',
  },
];

export function hotspotsBy(author: string): Hotspot[] {
  return HOTSPOTS.filter((hotspot) => hotspot.author.toLowerCase() === author.toLowerCase());
}
