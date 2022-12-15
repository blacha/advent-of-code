import { AoC, Point } from 'aocf';

export enum Material {
  Rock,
  Sand,
  Debug,
}

export type Waterfall = (Material | undefined)[];
export type Input = { grid: Waterfall; min: Point; max: Point };

const aoc = AoC.create<Input>(2022, 14);

function print(grid: Waterfall, clamp: Partial<{ min: Point; max: Point }>): void {
  console.log('Print', clamp.min, clamp.max);
  const min = { ...{ x: 0, y: 0 }, ...clamp?.min };
  const max = { ...{ x: GridSize, y: GridSize }, ...clamp?.max };
  for (let y = min.y; y < max.y + 1; y++) {
    const line = [];
    for (let x = min.x; x < max.x + 1; x++) {
      switch (grid[y * GridSize + x]) {
        case undefined:
          line.push('⬛');
          break;
        case Material.Rock:
          line.push('⬜');
          break;
        case Material.Debug:
          line.push('🟪');
          break;
        case Material.Sand:
          line.push('🟧');
          break;
        default:
          throw new Error('Unknown Type');
      }
    }
    console.log(String(y).padStart(4, ' '), line.join(''));
  }
}
const GridSize = 1000;

aoc.parse = (l: string): Input => {
  const grid: Waterfall = Array.from({ length: GridSize });
  const minMax = { min: { x: GridSize, y: 0 }, max: { x: 0, y: 0 } };

  for (const line of l.split('\n')) {
    const movement = line.split(' -> ').map((c) => c.split(',').map(Number));
    const current = { x: movement[0][0], y: movement[0][1] };
    for (let i = 1; i < movement.length; i++) {
      const next = { x: movement[i][0], y: movement[i][1] };

      const dX = Math.sign(next.x - current.x);
      const dY = Math.sign(next.y - current.y);

      while (current.x !== next.x || current.y !== next.y) {
        grid[current.y * GridSize + current.x] = Material.Rock;

        current.x += dX;
        current.y += dY;
        minMax.min.x = Math.min(minMax.min.x, current.x);
        minMax.min.y = Math.min(minMax.min.y, current.y);

        minMax.max.x = Math.max(minMax.max.x, current.x);
        minMax.max.y = Math.max(minMax.max.y, current.y);
        if (current.x < 0 || current.y < 0) {
          print(grid, minMax);
          process.exit();
        }
      }
      grid[current.y * GridSize + current.x] = Material.Rock;
    }
  }
  return { grid, ...minMax };
};

function fillSand(sX: number, sY: number, grid: Waterfall, maxY: number, sand: Set<number>): boolean {
  if (sY > maxY) return false;
  if (grid[sY * GridSize + sX] != undefined) return true;

  if (
    fillSand(sX, sY + 1, grid, maxY, sand) &&
    fillSand(sX - 1, sY + 1, grid, maxY, sand) &&
    fillSand(sX + 1, sY + 1, grid, maxY, sand)
  ) {
    const index = sY * GridSize + sX;
    sand.add(index);
    grid[index] = Material.Sand;
    return true;
  }
  return false;
}

aoc.partA = (input: Input): number => {
  const grid = input.grid.slice();
  const sand = new Set<number>();
  fillSand(500, 0, grid, input.max.y, sand);
  return sand.size;
};

aoc.partB = (input: Input): number => {
  const grid = input.grid.slice();
  const sand = new Set<number>();

  const maxY = input.max.y + 2;
  for (let x = 0; x < GridSize; x++) grid[maxY * GridSize + x] = Material.Rock;

  fillSand(500, 0, grid, maxY, sand);
  // print(grid, input);
  return sand.size;
};

const testValues = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9
`.trim();

aoc.test((o) => {
  o('partA', () => {
    o(aoc.answers(testValues).a).equals(24);
  });

  o('partB', () => {
    o(aoc.answers(testValues).b).equals(93);
  });
});
