import { AoC, Grid, Point } from 'aocf';

export type Line = { start: Point; end: Point };
export type Input = Line[];

const aoc = AoC.create<Input>(2021, 5);

aoc.parse = (input: string): Input => {
  const res = input.split('\n').map((c) => {
    const [start, end] = c.split(' -> ').map((pt) => {
      const [x, y] = pt.split(',').map(Number);
      return { x, y };
    });
    if (end.x < start.x) return { end: start, start: end };
    return { start, end };
  });
  return res;
};

function getStep(x: number): number {
  if (x == 0) return 0;
  if (x > 0) return 1;
  return -1;
}

function findDupes(input: Input): number {
  const grid = new Grid<number>([], 1000, 1000);

  const dupes = new Set<string>();

  for (const line of input) {
    const stepX = line.end.x - line.start.x;
    const stepY = line.end.y - line.start.y;
    const dirX = getStep(stepX);
    const dirY = getStep(stepY);
    const steps = Math.max(Math.abs(stepX), Math.abs(stepY));
    for (let i = 0; i <= steps; i++) {
      const x = line.start.x + i * dirX;
      const y = line.start.y + i * dirY;
      const existing = grid.get(x, y) ?? 0;
      grid.set(x, y, existing + 1);
      if (existing > 0) dupes.add(`${x}-${y}`);
    }
  }
  return dupes.size;
}

aoc.partA = (input: Input): number => findDupes(input.filter((f) => f.start.x == f.end.x || f.start.y == f.end.y));
aoc.partB = (input: Input): number => findDupes(input);

const testValues = `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`.trim();

aoc.test((o) => {
  o('partA', () => {
    o(aoc.answers(testValues).a).equals(5);
  });

  o('partB', () => {
    o(aoc.answers(testValues).b).equals(12);
  });
});
