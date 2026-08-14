export async function getRoadPath(
  waypoints: [number, number][]
): Promise<[number, number][]> {
  try {
    const coords = waypoints.map(([lat, lng]) => `${lng},${lat}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;

    console.log('[OSRM] Fetching:', url);

    const res = await fetch(url);

    if (!res.ok) {
      console.error('[OSRM] Request failed:', res.status, res.statusText);
      return waypoints;
    }

    const data = await res.json();
    console.log('[OSRM] Response:', data);

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