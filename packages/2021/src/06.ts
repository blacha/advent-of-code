import { AoC } from 'aocf';

export type Input = number[];

const aoc = AoC.create<Input>(2021, 6);

aoc.parse = (l: string): Input => l.split(',').map(Number);

function calcFish(input: Input, days: number): number {
  const fishCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (const f of input) fishCounts[f] = fishCounts[f] + 1;

  for (let i = 0; i < days; i++) {
    const first = fishCounts.shift() as number;
    fishCounts[6] = fishCounts[6] + first;
    fishCounts[8] = first;
  }
  let sum = 0;
  for (const j of fishCounts) sum += j;
  return sum;
}

aoc.partA = (i: Input): number => calcFish(i, 80);
aoc.partB = (i: Input): number => calcFish(i, 256);

const testValues = `3,4,3,1,2`.trim();

aoc.test((o) => {
  o('partA', () => {
    o(aoc.answers(testValues).a).equals(5934);
  });

  o('partB', () => {
    o(aoc.answers(testValues).b).equals(26984457539);
  });
});
