import { AoC } from 'aocf';
import { Heap } from 'heap-js';

export type Input = number[][];

const aoc = AoC.create<Input>(2021, 15);

aoc.parse = (l: string): Input => {
  return l.split('\n').map((c) => c.split('').map(Number));
};

const TopRightDownLeft = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
];

function partA(input: Input): number {
  const start = { x: 0, y: 0 };
  const size = input.length;

  const distances: number[][] = [];
  for (let y = 0; y < input.length; y++) distances.push([] as number[]);

  const end = { x: input[0].length - 1, y: input.length - 1 };

  distances[end.y][end.x] = Number.MAX_VALUE;
  distances[start.y][start.x] = 0;

  const todo = new Heap<[number, number, number]>((a, b) => a[2] - b[2]);
  todo.push([start.x, start.y, 0]);
  while (todo.size() > 0) {
    const [x, y, dist] = todo.pop()!;

    for (const next of TopRightDownLeft) {
      const nX = next.x + x;
      const nY = next.y + y;
      if (nX < 0 || nY >= size) continue;
      if (nY < 0 || nY >= size) continue;

      const nextDist = distances[nY][nX] ?? Number.MAX_VALUE;

      const nextVal = dist + input[nY][nX];
      if (nextVal < nextDist) {
        distances[nY][nX] = nextVal;
        todo.push([nX, nY, nextVal]);
      }
    }
  }
  return distances[end.y][end.x] ?? -1;
}

aoc.partA = partA;
aoc.partB = (input: Input): number => {
  const biggerInput = [];
  const Size = input.length;
  for (let y = 0; y < Size * 5; y++) {
    const yOffset = Math.floor(y / Size);
    const line = [];
    for (let x = 0; x < Size * 5; x++) {
      const xOffset = Math.floor(x / Size);
      let nextVal = input[y - yOffset * Size][x - xOffset * Size] + xOffset + yOffset;
      if (nextVal > 9) nextVal -= 9;
      line[x] = nextVal;
    }
    biggerInput.push(line);
  }
  return partA(biggerInput);
};

const testValues = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`.trim();

aoc.test((o) => {
  o('partA', () => {
    o(aoc.answers(testValues).a).equals(40);
  });

  o('partB', () => {
    o(aoc.answers(testValues).b).equals(315);
  });
});
