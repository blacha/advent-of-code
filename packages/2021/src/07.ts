import { AoC } from 'aocf';
import { Iter } from 'aocf';

export type Input = number[];

const aoc = AoC.create<Input>(2021, 7);

aoc.parse = (l: string): Input => {
  return l
    .split(',')
    .map(Number)
    .sort((a, b) => a - b);
};

aoc.partA = (input: Input): number => {
  // Since it takes a equal number of moves to move
  const bestIndex = input[Math.floor(input.length / 2)];
  let sum = 0;
  for (const i of input) sum += Math.abs(i - bestIndex);
  return sum;
};

aoc.partB = (input: Input): number => {
  const stats = Iter.stats(input);
  const fuelCost: number[] = [];
  for (let i = 0; i < stats.max.item; i++) fuelCost[i] = (fuelCost[i - 1] ?? 0) + i;

  let minOut = Number.MAX_VALUE;
  for (let i = stats.min.v; i < stats.max.v; i++) {
    let sum = 0;
    for (const j of input) sum += fuelCost[Math.abs(j - i)];
    if (sum < minOut) minOut = sum;
  }

  return minOut;
};

const testValues = `16,1,2,0,4,2,7,1,2,14`.trim();

aoc.test((o) => {
  o('partA', () => {
    o(aoc.answers(testValues).a).equals(37);
  });

  o('partB', () => {
    o(aoc.answers(testValues).b).equals(168);
  });
});
