import { AoC, Grid, Point } from 'aocf';

export type Input = { grid: Grid<string>; start: Point; end: Point };

const aoc = AoC.create<Input>(2022, 12);

aoc.parse = (l: string): Input => {
  const grid = Grid.create<string>(l);
  let start: Point | null = null;
  let end: Point | null = null;
  for (const i of grid) {
    if (i.i == 'S') start = i;
    if (i.i == 'E') {
      end = i;
      grid.set(i.x, i.y, 'z');
    }
    if (start != null && end != null) return { grid, start, end };
  }
  throw new Error('NoStart/End');
};

aoc.partA = (input: Input): number => {
  const seen = new Map<string, number>();

  const toSearch = [{ x: input.start.x, y: input.start.y, count: 0, val: 'a'.charCodeAt(0) }];

  while (toSearch.length > 0) {
    const first = toSearch.shift();
    if (first == null) throw new Error('Failed');
    seen.set(`${first.x}:${first.y}`, first.count);

    if (first.x == input.end.x && first.y == input.end.y) return first.count;

    for (const pt of Grid.AroundTopRightDownLeft) {
      const nextX = pt.x + first.x;
      const nextY = pt.y + first.y;
      const nextCount = first.count + 1;
      if (nextX < 0 || nextX >= input.grid.maxX) continue;
      if (nextY < 0 || nextY >= input.grid.maxY) continue;

      const txt = `${nextX}:${nextY}`;
      const val = seen.get(txt);
      if (val != null && val < nextCount) continue;

      const nextVal = input.grid.data[nextY][nextX].charCodeAt(0);
      if (nextVal - first.val > 1) continue;

      const found = toSearch.find((f) => f.x == nextX && f.y == nextY);
      if (found) {
        if (found.count < nextCount) continue;
        found.count = nextCount;
      } else {
        toSearch.push({ x: nextX, y: nextY, count: nextCount, val: nextVal });
      }
    }

    toSearch.sort((a, b) => a.count - b.count);
  }

  throw new Error('No Answer');
};
const charA = 'a'.charCodeAt(0);
aoc.partB = (input: Input): number => {
  const seen = new Map<string, number>();
  const toSearch = [{ x: input.end.x, y: input.end.y, count: 0, val: 'z'.charCodeAt(0) }];

  while (toSearch.length > 0) {
    const first = toSearch.shift();
    if (first == null) throw new Error('Failed');
    seen.set(`${first.x}:${first.y}`, first.count);

    if (first.val == charA) return first.count;

    for (const pt of Grid.AroundTopRightDownLeft) {
      const nextX = pt.x + first.x;
      const nextY = pt.y + first.y;
      const nextCount = first.count + 1;
      if (nextX < 0 || nextX >= input.grid.maxX) continue;
      if (nextY < 0 || nextY >= input.grid.maxY) continue;

      const txt = `${nextX}:${nextY}`;
      const val = seen.get(txt);
      if (val != null && val < nextCount) continue;

      const nextVal = input.grid.data[nextY][nextX].charCodeAt(0);
      if (first.val - nextVal > 1) continue;

      const found = toSearch.find((f) => f.x == nextX && f.y == nextY);
      if (found) {
        if (found.count < nextCount) continue;
        found.count = nextCount;
      } else {
        toSearch.push({ x: nextX, y: nextY, count: nextCount, val: nextVal });
      }
    }

    toSearch.sort((a, b) => a.count - b.count);
  }

  throw new Error('No Answer');
};

aoc.test();
