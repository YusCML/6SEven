import type { LatLng } from '@/features/routes/lib/geo';

type NominatimReverse = {
  name?: string;
  address?: Record<string, string | undefined>;
};

export type PlaceName = {
  /** "Spot, Street, District" when OpenStreetMap knows a place or street there */
  label: string | null;
  district: string | null;
};

/** A short, readable name for a pinned spot from OpenStreetMap's Nominatim. */
export async function reverseGeocode([lat, lng]: LatLng, signal?: AbortSignal): Promise<PlaceName> {
  const url =
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=18&addressdetails=1&accept-language=en` +
    `&lat=${lat.toFixed(6)}&lon=${lng.toFixed(6)}`;

  try {
    const response = await fetch(url, { signal });
    if (!response.ok) return { label: null, district: null };
    const place = (await response.json()) as NominatimReverse;
    const address = place.address ?? {};
    const spot = place.name || address.amenity || address.building;
    const street = address.road !== spot ? address.road : undefined;
    const district = address.city_district || address.suburb || address.quarter || address.village || null;
    const label = spot || street ? [spot, street, district].filter(Boolean).join(', ') : null;
    return { label, district };
  } catch {
    return { label: null, district: null };
  }
}
