import type { LatLng } from '@/features/routes/lib/geo';

type NominatimReverse = {
  name?: string;
  address?: Record<string, string | undefined>;
};

/** A short, readable name for a pinned spot from OpenStreetMap's Nominatim, or null if it can't say. */
export async function reverseGeocode([lat, lng]: LatLng, signal?: AbortSignal): Promise<string | null> {
  const url =
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=18&addressdetails=1&accept-language=en` +
    `&lat=${lat.toFixed(6)}&lon=${lng.toFixed(6)}`;

  try {
    const response = await fetch(url, { signal });
    if (!response.ok) return null;
    const place = (await response.json()) as NominatimReverse;
    const address = place.address ?? {};
    const spot = place.name || address.amenity || address.building;
    const street = address.road !== spot ? address.road : undefined;
    const district = address.city_district || address.suburb || address.quarter || address.village;
    if (!spot && !street) return null; // a bare district name is too vague to find the place
    return [spot, street, district].filter(Boolean).join(', ');
  } catch {
    return null;
  }
}
