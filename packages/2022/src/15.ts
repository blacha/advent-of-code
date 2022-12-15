import { AoC, Point } from 'aocf';

export type Beacon = { id: number; sensor: Point; beacon: Point; distance: number; line: string };
export type Input = { min: Point; max: Point; beacons: Beacon[]; points: Set<string> };

const aoc = AoC.create<Input>(2022, 15);

function distance(a: Point, b: Point): number {
  return Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
}

aoc.parse = (l: string): Input => {
  const points = new Set<string>();
  const minMax = { min: { x: 0, y: 0 }, max: { x: 0, y: 0 } };
  const beacons = l.split('\n').map((c, i) => {
    const [sX, sY] = c.slice('Sensor at x='.length, c.indexOf(':')).split(', y=').map(Number);
    const [bX, bY] = c
      .slice(c.lastIndexOf('x=') + 2)
      .split(', y=')
      .map(Number);

    const sensor = { x: sX, y: sY };
    const beacon = { x: bX, y: bY };
    const dist = distance(sensor, beacon);

    minMax.min.x = Math.min(minMax.min.x, Math.min(sX - dist, bX - dist));
    minMax.min.y = Math.min(minMax.min.y, Math.min(sY - dist, bY - dist));

    minMax.max.x = Math.max(minMax.max.x, Math.max(sX + dist, bX + dist));
    minMax.max.y = Math.max(minMax.max.y, Math.max(sY + dist, bY + dist));

    points.add(`${bX}:${bY}`);

    return { id: i, sensor, beacon, distance: dist, line: c };
  });

  return { ...minMax, beacons, points };
};

aoc.partA = (input: Input): number => {
  const y = 2000000;
  let hits = 0;

  const { points, min, max } = input;
  const beacons = input.beacons.slice();
  const beaconHit = Array.from({ length: input.beacons.length }, () => 0);
  for (let x = min.x; x < max.x; x++) {
    // Beacons don't count
    if (points.has(`${x}:${y}`)) continue;

    const pt = { x, y };
    for (let i = 0; i < beacons.length; i++) {
      const beacon = beacons[i];
      if (distance(pt, beacon.sensor) <= beacon.distance) {
        // perf: move the beacon into first location to save iterating the list
        if (i > 1) {
          const beaconZero = beacons[0];
          beacons[0] = beacon;
          beacons[i] = beaconZero;
        }
        beaconHit[i]++;
        hits++;
        break;
      }
    }
  }

  return hits;
};

function beaconInRange(pt: Point, beacons: Beacon[]): boolean {
  for (const b of beacons) {
    if (distance(b.sensor, pt) < b.distance) return false;
  }
  return true;
}

aoc.partB = (input: Input): number => {
  // let checked = 0;
  for (const b of input.beacons) {
    for (const xOffset of [-1, 1]) {
      for (const yOffset of [-1, 1]) {
        for (let dX = 0; dX < b.distance + 3; dX++) {
          const dY = b.distance + 1 - dX;
          const x = b.sensor.x + dX * xOffset;
          const y = b.sensor.y + dY * yOffset;
          if (x <= 0 || x > 4_000_000 || y <= 0 || y > 4_000_000) continue;

          // checked++;
          if (beaconInRange({ x, y }, input.beacons)) {
            // console.log({ checked });
            return x * 4_000_000 + y;
          }
        }
      }
    }
  }

  return -1;
};
aoc.test();
