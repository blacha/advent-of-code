import { AoC } from 'aocf';

export type Input = number[];

const aoc = AoC.create<Input>(2022, 1);
aoc.parse = (s: string): number[] => {
  const ret: number[] = [];
  const elfList = s.split('\n\n');
  for (const elf of elfList) {
    let elfVal = 0;
    for (const line of elf.split('\n')) elfVal += Number(line);
    ret.push(elfVal);
  }
  ret.sort((a, b) => b - a);
  return ret;
};

aoc.partA = (data: Input): number => data[0];
aoc.partB = (data: Input): number => data[0] + data[1] + data[2];

aoc.test((o) => {
  const input = `1000\n2000\n3000\n\n4000\n\n5000\n6000\n\n7000\n8000\n9000\n\n10000`;
  const testValues = [24000, 11000, 10000, 6000, 4000];

  o('parse', () => {
    o(aoc.parse?.(input)).deepEquals(testValues);
  });

  o('PartA', () => {
    o(aoc.partA?.(testValues)).equals(24000);
  });

  o('PartB', () => {
    o(aoc.partB?.(testValues)).equals(45000);
  });
});
