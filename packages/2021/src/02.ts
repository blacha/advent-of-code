import { AoC, Point } from 'aocf';

export type Direction = 'forward' | 'up' | 'down';
interface Input {
  direction: Direction;
  count: number;
}
const aoc = AoC.create<Input[]>(2021, 2);

aoc.parse = (input: string): Input[] => {
  return input.split('\n').map((c) => {
    const chunks = c.trim().split(' ');
    return { direction: chunks[0] as Direction, count: Number(chunks[1]) };
  });
};

aoc.partA = (input: Input[]): number => {
  const pt: Point = { x: 0, y: 0 };
  for (const i of input) {
    switch (i.direction) {
      case 'forward':
        pt.x += i.count;
        break;
      case 'up':
        pt.y -= i.count;
        break;
      case 'down':
        pt.y += i.count;
        break;
      default:
        throw new Error('Unknown direction ' + i.direction);
    }
  }
  return pt.x * pt.y;
};

aoc.partB = (input: Input[]): number => {
  const pt: Point = { x: 0, y: 0 };
  let aim = 0;
  for (const i of input) {
    switch (i.direction) {
      case 'forward':
        pt.x += i.count;
        pt.y += i.count * aim;
        break;
      case 'up':
        aim -= i.count;
        break;
      case 'down':
        aim += i.count;
        break;
      default:
        throw new Error('Unknown direction ' + i.direction);
    }
  }
  return pt.x * pt.y;
};

aoc.test((o) => {
  const testValues = `forward 5\ndown 5\nforward 8\nup 3\ndown 8\nforward 2`;

  o('PartA', () => {
    o(aoc.answers(testValues).a).equals(150);
  });

  o('PartB', () => {
    o(aoc.answers(testValues).b).equals(900);
  });
});
