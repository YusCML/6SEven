// LTFRB traditional jeepney fare: ₱13 for the first 4 km, ₱1.80 for every km after,
// rounded to the nearest 25 centavos like the printed fare matrix.
const BASE_FARE = 13;
const BASE_KM = 4;
const PER_KM = 1.8;

// Average jeepney speed in Iloilo City traffic, stops included.
export const JEEPNEY_KMH = 16;

export function jeepneyFare(km: number): number {
  const extraKm = Math.max(0, Math.ceil(km) - BASE_KM);
  return Math.round((BASE_FARE + PER_KM * extraKm) * 4) / 4;
}

export function formatPeso(amount: number): string {
  return `₱${amount.toFixed(2)}`;
}

export function rideMinutes(km: number): number {
  return Math.max(5, Math.round(((km / JEEPNEY_KMH) * 60) / 5) * 5);
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} mins`;
  const rest = minutes % 60;
  return rest ? `${Math.floor(minutes / 60)} hr ${rest} mins` : `${Math.floor(minutes / 60)} hr`;
}

export function formatKm(meters: number): string {
  return `${(meters / 1000).toFixed(1)} km`;
}
