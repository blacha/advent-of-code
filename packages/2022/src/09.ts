import { AoC, Point } from 'aocf';

export type Direction = 'U' | 'L' | 'D' | 'R';
export type Input = { dir: Direction; count: number }[];

export const Udlr: Record<Direction, Point> = {
  U: { x: 0, y: 1 },
  D: { x: 0, y: -1 },
  L: { x: -1, y: 0 },
  R: { x: 1, y: 0 },
};

const aoc = AoC.create<Input>(2022, 9);

aoc.parse = (l: string): Input => {
  return l.split('\n').map((c) => {
    const split = c.split(' ');
    return { dir: c[0] as Direction, count: Number(split[1]) };
  });
};

function solveSnake(length: number, input: Input): number {
  const snake = Array.from({ length }, () => ({ x: 0, y: 0 }));

  const head = snake[0];
  const tail = snake[snake.length - 1];

  const seen = new Set<string>();

  for (const move of input) {
    const d = Udlr[move.dir];
    for (let i = 0; i < move.count; i++) {
      head.x += d.x;
      head.y += d.y;
      for (let p = 1; p < snake.length; p++) {
        const partA = snake[p - 1];
        const partB = snake[p];
        const dX = partA.x - partB.x;
        const dY = partA.y - partB.y;
        if (Math.abs(dX) <= 1 && Math.abs(dY) <= 1) continue;
        partB.x += Math.sign(dX);
        partB.y += Math.sign(dY);
      }
      seen.add(`${tail.x}:${tail.y}`);
    }
  }
  return seen.size;
}

aoc.partA = (input: Input): number => solveSnake(2, input);
aoc.partB = (input: Input): number => solveSnake(10, input);

const testValues = `R 4\nU 4\nL 3\nD 1\nR 4\nD 1\nL 5\nR 2`;
const testValuesB = `R 5\nU 8\nL 8\nD 3\nR 17\nD 10\nL 25\nU 20`;

aoc.test((o) => {
  o('partA', () => {
    o(aoc.partA(aoc.parse(testValues))).equals(13);
    o(aoc.partA(aoc.parse(testValuesB))).equals(88);
  });

  o('partB', () => {
    o(aoc.partB(aoc.parse(testValuesB))).equals(36);
  });
});
