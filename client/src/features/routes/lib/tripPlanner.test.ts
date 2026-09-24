import { describe, expect, it } from 'vitest';
import type { RouteData } from '@/types/route';
import { jeepneyFare } from './fare';
import type { LatLng } from './geo';
import { isPinnable } from './iloiloArea';
import { buildNetwork, planTrips, type RideLeg } from './tripPlanner';

function route(number: number, path: LatLng[]): RouteData {
  return {
    id: `route-${number}`,
    routeNumber: number,
    title: `Route ${number}`,
    duration: '',
    description: '',
    color: '#000000',
    path,
    turnIndex: 1,
    localNames: [],
    stops: [],
    fare: '',
    distance: '',
    category: 'loop',
    segments: [],
  };
}

// Route 1 runs east along latitude 10.70 and back; route 2 runs north from its far end and back.
const east = route(1, [
  [10.7, 122.5],
  [10.7, 122.53],
  [10.7, 122.5],
]);
const north = route(2, [
  [10.7, 122.53],
  [10.73, 122.53],
  [10.7, 122.53],
]);
const network = buildNetwork([east, north]);

const rides = (legs: { kind: string }[]) => legs.filter((leg): leg is RideLeg => leg.kind === 'ride');

describe('planTrips', () => {
  it('uses one jeep when it passes both places', () => {
    const [best] = planTrips(network, [10.7003, 122.501], [10.7003, 122.525]);
    expect(rides(best.legs).map((leg) => leg.routeNumber)).toEqual([1]);
    expect(best.fare).toBe(13);
    expect(best.legs[0].kind).toBe('walk');
    expect(best.legs.at(-1)?.kind).toBe('walk');
  });

  it('changes jeeps where the two routes meet', () => {
    const [best] = planTrips(network, [10.7003, 122.501], [10.7295, 122.5303]);
    const legs = rides(best.legs);
    expect(legs.map((leg) => leg.routeNumber)).toEqual([1, 2]);
    expect(Math.abs(legs[0].alight[1] - 122.53)).toBeLessThan(0.004);
    expect(best.fare).toBe(legs[0].fare + legs[1].fare);
  });

  it('rides forward around the loop only', () => {
    // Heading back west: the jeep first goes east to the turnaround, so the ride is longer than the gap.
    const [best] = planTrips(network, [10.7003, 122.52], [10.7003, 122.505]);
    const [leg] = rides(best.legs);
    expect(leg.meters).toBeGreaterThan(1600);
  });

  it('offers walking when the places are close', () => {
    const options = planTrips(network, [10.7003, 122.51], [10.7003, 122.513]);
    expect(options.some((option) => option.rides === 0)).toBe(true);
  });

  it('finds nothing when no jeep passes within walking distance', () => {
    expect(planTrips(network, [10.7003, 122.501], [10.78, 122.6])).toEqual([]);
  });
});

describe('jeepneyFare', () => {
  it('charges the base fare for the first 4 km', () => {
    expect(jeepneyFare(0.5)).toBe(13);
    expect(jeepneyFare(4)).toBe(13);
  });

  it('adds ₱1.80 per succeeding km, rounded to 25 centavos', () => {
    expect(jeepneyFare(4.2)).toBe(14.75);
    expect(jeepneyFare(10)).toBe(23.75);
  });
});

describe('isPinnable', () => {
  it('accepts streets in Iloilo City', () => {
    expect(isPinnable([10.6926, 122.5737])).toBe(true);
    expect(isPinnable([10.7245, 122.557])).toBe(true);
  });

  it('rejects the sea and places outside the city', () => {
    expect(isPinnable([10.688, 122.595])).toBe(false);
    expect(isPinnable([10.672, 122.52])).toBe(false);
    expect(isPinnable([10.77, 122.54])).toBe(false);
  });
});
