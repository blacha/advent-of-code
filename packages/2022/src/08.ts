import { AoC, Grid } from 'aocf';

export type Input = Grid<number>;

const aoc = AoC.create<Input>(2022, 8);

aoc.parse = (l: string): Input => Grid.create(l, Number);

aoc.partA = (input: Input): number => {
  function isVisible(sX: number, sY: number, val: number): boolean {
    if (sX == 0 || sX == input.maxX - 1) return true;
    if (sY == 0 || sY == input.maxY - 1) return true;
    for (let x = sX - 1; x >= 0; x--) {
      if (input.data[sY][x] >= val) break;
      if (x == 0) return true;
    }
    for (let x = sX + 1; x < input.maxX; x++) {
      if (input.data[sY][x] >= val) break;
      if (x == input.maxX - 1) return true;
    }

    for (let y = sY - 1; y >= 0; y--) {
      if (input.data[y][sX] >= val) break;
      if (y == 0) return true;
    }
    for (let y = sY + 1; y < input.maxY; y++) {
      if (input.data[y][sX] >= val) return false;
      if (y == input.maxX - 1) return true;
    }

    throw new Error('Got Here?: ' + sX + ':' + sY);
  }

  let count = 0;
  for (const pt of input) {
    if (isVisible(pt.x, pt.y, pt.i)) count++;
  }
  return count;
};

aoc.partB = (input: Input): number => {
  function viewScore(
    sX: number,
    sY: number,
    startVal: number,
  ): { north: number; east: number; south: number; west: number } {
    const scores = { north: 0, south: 0, east: 0, west: 0 };
    for (let x = sX - 1; x >= 0; x--) {
      const val = input.data[sY][x];
      scores.west++;

      if (val >= startVal) break;
    }

    for (let x = sX + 1; x < input.maxX; x++) {
      const val = input.data[sY][x];
      scores.east++;
      if (val >= startVal) break;
    }

    for (let y = sY - 1; y >= 0; y--) {
      const val = input.data[y][sX];
      scores.north++;
      if (val >= startVal) break;
    }

    for (let y = sY + 1; y < input.maxY; y++) {
      const val = input.data[y][sX];
      scores.south++;
      if (val >= startVal) break;
    }

    return scores;
  }

  let max = 0;
  for (const pt of input) {
    if (pt.x == 0 || pt.x == input.maxX - 1) continue;
    if (pt.y == 0 || pt.y == input.maxY - 1) continue;

    const score = viewScore(pt.x, pt.y, pt.i);
    const current = score.east * score.north * score.west * score.south;
    if (max < current) max = current;
  }
  return max;
};
