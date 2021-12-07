import { AoC } from 'aocf';
import { Iter } from 'aocf';

export type Input = number[];

const aoc = AoC.create<Input>(2021, 7);

aoc.parse = (l: string): Input => {
  return l.split(',').map(Number);
};

aoc.partA = (input: Input): number => {
  const stats = Iter.stats(input);

  let minOut = Number.MAX_VALUE;
  for (let i = stats.min.v; i < stats.max.v; i++) {
    let sum = 0;
    for (const j of input) sum += Math.abs(j - i);
    if (sum < minOut) minOut = sum;
  }
  return minOut;
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
