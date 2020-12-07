import { AoC } from 'aocf';

function toNumber(row: string) {
  return parseInt(row.replace(/R/g, '1').replace(/L/g, '0').replace(/B/g, '1').replace(/F/g, '0'), 2);
}
export class AoC2020Day5 extends AoC<string[]> {
  constructor() {
    super(2020, 5);
  }

  parse(input: string): string[] {
    return input.split('\n');
  }

  partA(input: string[]): number {
    let biggest = 0;
    for (const row of input) {
      const res = toNumber(row);
      if (res > biggest) biggest = res;
    }
    return biggest;
  }
  partB(input: string[]): number {
    const sets = new Set<number>();
    for (const row of input) sets.add(toNumber(row));
    for (let i = 0; i < 1024; i++) {
      if (sets.has(i)) continue;
      if (sets.has(i - 1) && sets.has(i + 1)) return i;
    }
    throw new Error('Unable to find seat');
  }
}

export const aoc2020day5 = new AoC2020Day5();
aoc2020day5.test();
