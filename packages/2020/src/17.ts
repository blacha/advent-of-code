import { AoC, Vec3, Vec4 } from 'aocf';

function* xyzAround(): Generator<Vec3> {
  for (let z = -1; z < 2; z++) {
    for (let y = -1; y < 2; y++) {
      for (let x = -1; x < 2; x++) {
        if (x == 0 && y == 0 && z === 0) continue;
        yield { x, y, z };
      }
    }
  }
}

function* xyzwAround(): Generator<Vec4> {
  for (let w = -1; w < 2; w++) {
    for (let z = -1; z < 2; z++) {
      for (let y = -1; y < 2; y++) {
        for (let x = -1; x < 2; x++) {
          if (x == 0 && y == 0 && z === 0 && w == 0) continue;
          yield { x, y, z, w };
        }
      }
    }
  }
}

export type AoCD17Input = Map<string, Vec4>;

export class AoC2020Day17 extends AoC<AoCD17Input> {
  constructor() {
    super(2020, 17);
  }

  parse(i: string): AoCD17Input {
    const grids: AoCD17Input = new Map();
    i.split('\n').map((c, y) =>
      c.split('').forEach((k, x) => {
        if (k == '#') grids.set(`${x}:${y}:0:0`, { x, y, z: 0, w: 0 });
      }),
    );
    return grids;
  }

  partA(input: AoCD17Input): number {
    let current = input;
    for (let i = 0; i < 6; i++) {
      const newGrid: AoCD17Input = new Map();
      const counts = new Map<string, number>();
      for (const { x, y, z } of current.values()) {
        for (const otherPts of xyzAround()) {
          const x0 = otherPts.x + x;
          const y0 = otherPts.y + y;
          const z0 = otherPts.z + z;

          const countKey = `${x0}:${y0}:${z0}:0`;
          counts.set(countKey, (counts.get(countKey) ?? 0) + 1);
        }
      }

      for (const [key, value] of counts) {
        if (value < 2 || value > 3) continue;
        const [x, y, z, w] = key.split(':').map(Number);
        if ((current.has(key) && value == 2) || value == 3) newGrid.set(key, { x, y, z, w });
      }
      current = newGrid;
    }
    return current.size;
  }

  partB(input: AoCD17Input): number {
    let current = input;
    for (let i = 0; i < 6; i++) {
      const newGrid: AoCD17Input = new Map();
      const counts = new Map<string, number>();
      for (const { x, y, z, w } of current.values()) {
        for (const otherPts of xyzwAround()) {
          const x0 = otherPts.x + x;
          const y0 = otherPts.y + y;
          const z0 = otherPts.z + z;
          const w0 = otherPts.w + w;
          const countKey = `${x0}:${y0}:${z0}:${w0}`;
          counts.set(countKey, (counts.get(countKey) ?? 0) + 1);
        }
      }

      for (const [key, value] of counts) {
        if (value < 2 || value > 3) continue;
        const [x, y, z, w] = key.split(':').map(Number);
        if ((current.has(key) && value == 2) || value == 3) newGrid.set(key, { x, y, z, w });
      }
      current = newGrid;
    }
    return current.size;
  }
}

export const aoc2020day17 = new AoC2020Day17();
aoc2020day17.test();
