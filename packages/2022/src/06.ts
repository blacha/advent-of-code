import { AoC } from 'aocf';

export type Input = string;

const aoc = AoC.create<Input>(2022, 6);

function findUniques(input: string, count: number): number {
  const counts = new Map<string, number>();
  for (let i = 0; i < count; i++) {
    const char = input[i];
    counts.set(char, (counts.get(char) || 0) + 1);
  }

  for (let i = count; i < input.length; i++) {
    const lastChar = input[i - count];
    const cur = counts.get(lastChar) || 0;

    if (cur == 1) counts.delete(lastChar);
    else counts.set(lastChar, cur - 1);

    const curChar = input[i];
    counts.set(curChar, (counts.get(curChar) || 0) + 1);

    if (counts.size === count) return i + 1;
  }

  throw new Error('Failed to find counts');
}

aoc.partA = (data: Input): number => findUniques(data, 4);
aoc.partB = (data: Input): number => findUniques(data, 14);

aoc.test((o) => {
  o('PartA', () => {
    o(aoc.partA('bvwbjplbgvbhsrlpgdmjqwftvncz')).equals(5);
    o(aoc.partA('nppdvjthqldpwncqszvftbrmjlhg')).equals(6);
    o(aoc.partA('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg')).equals(10);
    o(aoc.partA('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw')).equals(11);
  });

  o('PartB', () => {
    o(aoc.partB('mjqjpqmgbljsphdztnvjfqwrcgsmlb')).equals(19);
    o(aoc.partB('bvwbjplbgvbhsrlpgdmjqwftvncz')).equals(23);
    o(aoc.partB('nppdvjthqldpwncqszvftbrmjlhg')).equals(23);
    o(aoc.partB('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg')).equals(29);
    o(aoc.partB('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw')).equals(26);
  });
});
