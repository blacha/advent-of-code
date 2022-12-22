import { AoC } from 'aocf';

export type Grid = Floor[][];
export type Input = { grid: Grid; movement: (number | 'L' | 'R')[] };

const aoc = AoC.create<Input>(2022, 22);

export type Direction = 'N' | 'S' | 'E' | 'W';

export enum Floor {
  Wall = '#',
  Nothing = ' ',
  Floor = '.',
}

aoc.parse = (l: string): Input => {
  const [g, movement] = l.split('\n\n');

  const grid = g.split('\n').map((c) => c.split('')) as Grid;

  const steps = movement.split(/(L|R)/).map((c) => {
    if (c == 'L' || c == 'R') return c;
    return Number(c);
  });

  return { grid, movement: steps };
  // return l.split('\n').map((c) => c.split('').map(Number));
};

function rotate(direction: Direction, action: 'L' | 'R'): Direction {
  if (direction == 'E') return action === 'L' ? 'N' : 'S';
  if (direction == 'W') return action === 'L' ? 'S' : 'N';
  if (direction == 'N') return action === 'L' ? 'W' : 'E';
  if (direction == 'S') return action === 'L' ? 'E' : 'W';
  throw new Error('Failed to find direction:' + direction);
}

const Moves = {
  N: { x: 0, y: -1 },
  S: { x: 0, y: 1 },
  E: { x: 1, y: 0 },
  W: { x: -1, y: 0 },
};

const Score: Record<Direction, number> = {
  E: 0,
  S: 1,
  W: 2,
  N: 3,
};
aoc.partA = (i: Input): number => {
  const current = { x: 0, y: 0, direction: 'E' as Direction };
  current.x = i.grid[0].findIndex((f) => f == '.');

  const maxY = i.grid.length - 1;
  const maxX = i.grid.reduce((p, c) => Math.max(p, c.length - 1), 0);

  for (const action of i.movement) {
    if (action == 'L' || action == 'R') {
      current.direction = rotate(current.direction, action);
      continue;
    }
    const movement = Moves[current.direction];

    let nX = current.x;
    let nY = current.y;
    for (let step = 0; step < action; step++) {
      nX += movement.x;
      nY += movement.y;

      // Loop Y
      if (nY > maxY) nY = 0;
      else if (nY < 0) nY = maxY;

      // Loop X
      if (nX > maxX) nX = 0;
      else if (nX < 0) nX = maxX;

      const target = i.grid[nY][nX];
      if (target == Floor.Wall) {
        break;
      } else if (target == Floor.Floor) {
        current.x = nX;
        current.y = nY;
      } else {
        step--;
      }
    }
  }

  return (current.y + 1) * 1000 + (current.x + 1) * 4 + Score[current.direction];
};
aoc.partB = (input: Input): number => {
  // hard pass!
  return -1;
};

const testValues = `        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`;

aoc.test((o) => {
  o('partA', () => {
    o(aoc.answers(testValues).a).equals(6032);
  });

  o('partB', () => {
    o(aoc.answers(testValues).b).equals(-1);
  });
});
