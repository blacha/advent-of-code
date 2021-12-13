import { AoC, GridCharacter, Point } from 'aocf';

export type Input = { points: Map<string, Point>; todo: string[][] };

const aoc = AoC.create<Input>(2021, 13);

aoc.parse = (l: string): Input => {
  const [data, todo] = l.split('\n\n');
  const points = new Map<string, Point>();
  for (const line of data.split('\n')) {
    const [x, y] = line.split(',').map(Number);
    points.set(`${x}:${y}`, { x, y });
  }
  const output = todo.split('\n').map((c) => c.replace('fold along ', '').split('='));
  return { points, todo: output };
};

function fold(points: Map<string, Point>, fold: 'x' | 'y', foldAt: number): void {
  for (const point of points.values()) {
    if (point[fold] > foldAt) {
      const foldTarget = point[fold] - foldAt;
      const pt = { ...point, [fold]: foldAt - foldTarget };
      points.delete(`${point.x}:${point.y}`);
      points.set(`${pt.x}:${pt.y}`, pt);
    }
  }
}

aoc.partA = (input: Input): number => {
  const points = new Map(input.points);
  fold(points, input.todo[0][0] as 'x', Number(input.todo[0][1]));
  return points.size;
};

aoc.partB = (input: Input): string => {
  const points = new Map(input.points);

  for (const f of input.todo) fold(points, f[0] as 'x', Number(f[1]));

  const grid = new GridCharacter(8);
  for (const pt of points.values()) grid.set(pt.x, pt.y);

  return grid.toChars();
};

const testValues = `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`;

aoc.test((o) => {
  o('partA', () => {
    o(aoc.answers(testValues).a).equals(17);
  });

  o('partB', () => {
    // o(aoc.answers(testValues).b).equals('O');
  });
});
