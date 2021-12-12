import { AoC, Grid, Point } from 'aocf';

export type Input = number[][];

const aoc = AoC.create<string>(2021, 11);

function flash(input: Input, x: number, y: number, flashed: Map<string, Point>): void {
  const flashKey = `${x}:${y}`;
  if (flashed.has(flashKey)) {
    input[y][x] = 0;
    return;
  }
  flashed.set(flashKey, { x, y });
  for (const pt of Grid.Around) {
    const nX = pt.x + x;
    const nY = pt.y + y;

    if (nY < 0 || nY >= input.length) continue;
    if (nX < 0 || nX > input[nY].length) continue;
    const currentVal = input[nY][nX] + 1;
    input[nY][nX] = currentVal;
    if (currentVal > 9) flash(input, nX, nY, flashed);
  }
}

function runStep(input: Input): number {
  const flashed = new Map<string, Point>();

  const toFlash = [];
  for (let y = 0; y < input.length; y++) {
    const line = input[y];
    for (let x = 0; x < line.length; x++) {
      const inputVal = line[x] + 1;
      if (inputVal > 9) {
        line[x] = 0;
        toFlash.push({ x, y });
      } else {
        line[x] = inputVal;
      }
    }
  }
  for (const f of toFlash) flash(input, f.x, f.y, flashed);
  for (const f of flashed.values()) input[f.y][f.x] = 0;

  return flashed.size;
}

aoc.partA = (input: string): number => {
  const grid = input.split('\n').map((c) => c.split('').map(Number));

  let flashCount = 0;
  for (let step = 0; step < 100; step++) flashCount += runStep(grid);
  return flashCount;
};

aoc.partB = (input: string): number => {
  const grid = input.split('\n').map((c) => c.split('').map(Number));
  for (let step = 0; step < 1_000; step++) {
    if (runStep(grid) == 100) return step + 1;
  }

  return -1;
};

const testValues = `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`.trim();

const testB = `11111
19991
19191
19991
11111`;

aoc.test((o) => {
  o('step', () => {
    const data = testB.split('\n').map((c) => c.split('').map(Number));
    o(runStep(data)).equals(9);
  });
  o('partA', () => {
    o(aoc.answers(testValues).a).equals(1656);
  });
  o('partB', () => {
    o(aoc.answers(testValues).b).equals(195);
  });
});
