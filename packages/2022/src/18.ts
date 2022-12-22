import { AoC, Vec3 } from 'aocf';

export interface VecId extends Vec3 {
  id: number;
}
export type Input = VecId[];
const aoc = AoC.create<Input>(2022, 18);
function vId(v: Vec3): string {
  return `${v.z}:${v.x}:${v.y}`;
}
aoc.parse = (l: string): Input => {
  return l.split('\n').map((c, i) => {
    const [x, y, z] = c.split(',').map(Number);
    return { x, y, z, id: i };
  }) as Input;
};

aoc.partA = (input: Input): number => {
  const cubes = new Set(input.map((cube) => vId(cube)));
  let count = 0;

  for (const cube of input.values()) {
    if (!cubes.has(vId({ x: cube.x + 1, y: cube.y, z: cube.z }))) count++;
    if (!cubes.has(vId({ x: cube.x - 1, y: cube.y, z: cube.z }))) count++;
    if (!cubes.has(vId({ x: cube.x, y: cube.y + 1, z: cube.z }))) count++;
    if (!cubes.has(vId({ x: cube.x, y: cube.y - 1, z: cube.z }))) count++;
    if (!cubes.has(vId({ x: cube.x, y: cube.y, z: cube.z + 1 }))) count++;
    if (!cubes.has(vId({ x: cube.x, y: cube.y, z: cube.z - 1 }))) count++;
  }

  return count;
};

aoc.partB = (input: Input): number => {
  const cubes = new Set(input.map((cube) => vId(cube)));

  const minMax = { x: { min: 1000, max: -1000 }, y: { min: 1000, max: -1000 }, z: { min: 1000, max: -1000 } };

  for (const cube of input) {
    if (cube.x > minMax.x.max) minMax.x.max = cube.x;
    if (cube.x < minMax.x.min) minMax.x.min = cube.x;

    if (cube.y > minMax.y.max) minMax.y.max = cube.y;
    if (cube.y < minMax.y.min) minMax.y.min = cube.y;

    if (cube.z > minMax.z.max) minMax.z.max = cube.z;
    if (cube.z < minMax.z.min) minMax.z.min = cube.z;
  }

  minMax.x.max++;
  minMax.y.max++;
  minMax.z.max++;

  minMax.x.min--;
  minMax.y.min--;
  minMax.z.min--;

  const external = new Set<string>();

  function fill(pt: Vec3): void {
    const ptId = vId(pt);
    if (external.has(ptId)) return;
    if (cubes.has(ptId)) return;

    if (pt.x > minMax.x.max) return;
    if (pt.x < minMax.x.min) return;

    if (pt.y > minMax.y.max) return;
    if (pt.y < minMax.y.min) return;

    if (pt.z > minMax.z.max) return;
    if (pt.z < minMax.z.min) return;

    external.add(ptId);

    fill({ x: pt.x + 1, y: pt.y, z: pt.z });
    fill({ x: pt.x - 1, y: pt.y, z: pt.z });
    fill({ x: pt.x, y: pt.y + 1, z: pt.z });
    fill({ x: pt.x, y: pt.y - 1, z: pt.z });
    fill({ x: pt.x, y: pt.y, z: pt.z + 1 });
    fill({ x: pt.x, y: pt.y, z: pt.z - 1 });
  }
  fill({ x: minMax.x.min, y: minMax.y.min, z: minMax.z.min });

  function check(pt: Vec3): void {
    const nextId = vId(pt);
    if (!cubes.has(nextId) && external.has(nextId)) count++;
  }

  let count = 0;

  for (const cube of input) {
    check({ x: cube.x + 1, y: cube.y, z: cube.z });
    check({ x: cube.x - 1, y: cube.y, z: cube.z });
    check({ x: cube.x, y: cube.y + 1, z: cube.z });
    check({ x: cube.x, y: cube.y - 1, z: cube.z });
    check({ x: cube.x, y: cube.y, z: cube.z + 1 });
    check({ x: cube.x, y: cube.y, z: cube.z - 1 });
  }
  return count;
};

aoc.test();
