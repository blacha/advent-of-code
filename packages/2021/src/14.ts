import { AoC } from 'aocf';

export type Input = { input: Map<string, number>; pairs: Map<string, string>; last: string };

const aoc = AoC.create<Input>(2021, 14);

aoc.parse = (l: string): Input => {
  const [input, pairsI] = l.split('\n\n');

  const pairs = new Map();
  for (const line of pairsI.split('\n')) {
    const [key, value] = line.split(' -> ');
    pairs.set(key, value);
  }

  const startingPairs = new Map<string, number>();
  for (let i = 0; i < input.length - 1; i++) {
    const key = input.slice(i, i + 2);
    startingPairs.set(key, (startingPairs.get(key) ?? 0) + 1);
  }
  return { input: startingPairs, pairs, last: input.charAt(input.length - 1) };
};

function step(x: Input, count: number): number {
  let input = new Map(x.input);

  for (let i = 0; i < count; i++) {
    const output = new Map<string, number>();
    for (const [key, value] of input) {
      const rule = x.pairs.get(key);
      if (rule == null) throw new Error('Missing rule ' + key);
      const first = key[0] + rule;
      const second = rule + key[1];

      output.set(first, (output.get(first) ?? 0) + value);
      output.set(second, (output.get(second) ?? 0) + value);
    }
    input = output;
  }

  const counts = new Map<string, number>();
  for (const [key, value] of input.entries()) {
    counts.set(key[0], (counts.get(key[0]) ?? 0) + value);
  }
  // Last key was not counted in this loop
  counts.set(x.last, (counts.get(x.last) ?? 0) + 1);

  const sorted = [...counts.values()].sort((a, b) => a - b);
  return sorted[sorted.length - 1] - sorted[0];
}
aoc.partA = (x: Input): number => step(x, 10);
aoc.partB = (x: Input): number => step(x, 40);

const testValues = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`.trim();

aoc.test((o) => {
  o('partA', () => {
    o(aoc.answers(testValues).a).equals(1588);
  });

  o('partB', () => {
    o(aoc.answers(testValues).b).equals(2188189693529);
  });
});
