import { AoC } from 'aocf';

export type Input = Operator[];

export interface Operator {
  on: boolean;
  x: number[];
  y: number[];
  z: number[];
}

const aoc = AoC.create<Input>(2021, 22);

function intersection(a: number[], b: number[]): number[] | null {
  if (a[0] > b[1]) return null;
  if (b[0] > a[1]) return null;

  return [Math.max(a[0], b[0]), Math.min(a[1], b[1])];
}
function explode(a: Operator, b: Operator): Operator[] | null {
  const result: Operator[] = [];

  const rangeX = intersection(a.x, b.x);
  if (rangeX == null) return [a];
  const rangeY = intersection(a.y, b.y);
  if (rangeY == null) return [a];
  const rangeZ = intersection(a.z, b.z);
  if (rangeZ == null) return [a];

  result.push({ on: true, x: [a.x[0], rangeX[0] - 1], y: a.y, z: rangeZ });
  result.push({ on: true, x: [rangeX[1] + 1, a.x[1]], y: a.y, z: rangeZ });
  result.push({ on: true, x: rangeX, y: [a.y[0], rangeY[0] - 1], z: rangeZ });
  result.push({ on: true, x: rangeX, y: [rangeY[1] + 1, a.y[1]], z: rangeZ });
  result.push({ on: true, x: a.x, y: a.y, z: [a.z[0], rangeZ[0] - 1] });
  result.push({ on: true, x: a.x, y: a.y, z: [rangeZ[1] + 1, a.z[1]] });

  return result.filter((f) => f.x[0] <= f.x[1] && f.y[0] <= f.y[1] && f.z[0] <= f.z[1]);
}
aoc.parse = (l: string): Input => {
  let cubes: Operator[] = [];

  const lines = l.trim().split('\n');
  for (const line of lines) {
    const [x, y, z] = line
      .slice(line.indexOf(' ') + 1)
      .split(',')
      .map((c) => c.slice(2).split('..').map(Number));
    const isOn = line.startsWith('on');

    const op = { on: isOn, x, y, z };

    let newCubes: Operator[] = [];
    for (const c of cubes) {
      const res = explode(c, op);
      if (res != null) newCubes = newCubes.concat(res);
    }

    if (op.on) newCubes.push(op);
    cubes = newCubes;
  }

  return cubes;
};

aoc.partA = (input: Input): number => {
  let total = 0;
  for (const c of input) {
    const x = Math.max(0, Math.min(50, c.x[1]) - Math.max(-50, c.x[0]) + 1);
    const y = Math.max(0, Math.min(50, c.y[1]) - Math.max(-50, c.y[0]) + 1);
    const z = Math.max(0, Math.min(50, c.z[1]) - Math.max(-50, c.z[0]) + 1);
    total = total + x * y * z;
  }
  return total;
};

aoc.partB = (input: Input): number => {
  let total = 0;
  for (const c of input) {
    const x = Math.abs(c.x[1] - c.x[0] + 1);
    const y = Math.abs(c.y[1] - c.y[0] + 1);
    const z = Math.abs(c.z[1] - c.z[0] + 1);
    total = total + x * y * z;
  }
  return total;
};

aoc.test();
