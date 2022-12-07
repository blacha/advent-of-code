import { AoC } from 'aocf';

export type Compartment = number[][];
export type Input = Compartment[];

const aoc = AoC.create<Input>(2022, 4);
aoc.parse = (s: string): Compartment[] => {
  return s.split('\n').map((c) => c.split(',').map((y) => y.split('-').map(Number))) as number[][][];
};
aoc.partA = (data: Input): number => {
  let score = 0;
  for (const node of data) {
    const [aStart, aEnd] = node[0];
    const [bStart, bEnd] = node[1];
    if (aStart >= bStart && aEnd <= bEnd) {
      score++;
    } else if (bStart >= aStart && bEnd <= aEnd) {
      score++;
    }
  }
  return score;
};

aoc.partB = (data: Input): number => {
  let score = 0;

  for (const node of data) {
    const [aStart, aEnd] = node[0];
    const [bStart, bEnd] = node[1];
    if (aStart <= bEnd && aEnd >= bStart) {
      score++;
    } else if (bStart >= aEnd && bEnd <= aStart) {
      score++;
    }
  }
  return score;
};

aoc.test((o) => {
  const input = `2-4,6-8\n2-3,4-5\n5-7,7-9\n2-8,3-7\n6-6,4-6\n2-6,4-8`;
  o('parse', () => {
    o(aoc.parse(input)).deepEquals([
      [
        [2, 4],
        [6, 8],
      ],
      [
        [2, 3],
        [4, 5],
      ],
      [
        [5, 7],
        [7, 9],
      ],
      [
        [2, 8],
        [3, 7],
      ],
      [
        [6, 6],
        [4, 6],
      ],
      [
        [2, 6],
        [4, 8],
      ],
    ]);
  });
  o('PartA', () => {
    o(aoc.partA(aoc.parse(input))).equals(2);
  });
  o('PartB', () => {
    o(aoc.partB(aoc.parse(input))).equals(4);
  });
});
