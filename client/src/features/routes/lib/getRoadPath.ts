export async function getRoadPath(
  waypoints: [number, number][]
): Promise<[number, number][]> {
  if (waypoints.length < 2) return waypoints;

  try {
    const coords = waypoints.map(([lat, lng]) => `${lng},${lat}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;

    const res = await fetch(url);

    if (!res.ok) {
      console.error('[OSRM] Request failed:', res.status, res.statusText);
      return waypoints;
    }

    const data = await res.json();

    if (data.code !== 'Ok' || !data.routes?.length) {
      console.error('[OSRM] No route found:', data.code, data.message);
      return waypoints;
    }

    return data.routes[0].geometry.coordinates.map(
      ([lng, lat]: [number, number]) => [lat, lng] as [number, number]
    );
  } catch (err) {
    console.error('[OSRM] Fetch threw an error:', err);
    return waypoints;
  }
}
