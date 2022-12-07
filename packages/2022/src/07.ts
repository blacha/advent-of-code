import { AoC } from 'aocf';

export type Input = string;

const aoc = AoC.create<Input>(2022, 6);

aoc.parse = (s: string): Input => {
  return s;
};

aoc.partA = (data: Input): number => {
  return data.length;
};
aoc.partB = (data: Input): number => {
  return data.length;
};

aoc.test((o) => {
  o('PartA', () => {
    o(aoc.partA('bvwbjplbgvbhsrlpgdmjqwftvncz')).equals(5);
  });

  o('PartB', () => {
    o(aoc.partB('mjqjpqmgbljsphdztnvjfqwrcgsmlb')).equals(19);
  });
});
