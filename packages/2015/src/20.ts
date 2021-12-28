import { AoC } from 'aocf';

export type Input = { a: number; b: number };

const aoc = AoC.create<Input>(2015, 20);

aoc.parse = (l: string): Input => {
  const input = Number(l);
  const presentsA: number[] = [];
  const presentsB: number[] = [];
  let minA = input;
  let minB = input;

  let maxSearch = input / 30;
  for (let i = 1; i < maxSearch; i++) {
    let visits = 0;
    for (let j = i; j < maxSearch; j = j + i) {
      if (presentsA[j] == null) presentsA[j] = 10;
      presentsA[j] = presentsA[j] + i * 10;
      if (presentsA[j] >= input) minA = Math.min(minA, j);

      if (visits < 50) {
        if (presentsB[j] == null) presentsB[j] = 11;
        presentsB[j] = presentsB[j] + i * 11;

        if (presentsB[j] >= input) {
          minB = Math.min(minB, j);
          maxSearch = j;
          break;
        }
        visits = visits + 1;
      }
    }
  }

  return { a: minA, b: minB };
};

aoc.partA = (input: Input): number => input.a;
aoc.partB = (input: Input): number => input.b;
