import { AoC } from '../framework/aoc';

export class AoC2020Day7 extends AoC<string[]> {
  constructor() {
    super(2020, 7);
  }

  parse(input: string): string[] {
    return input.trim().split('\n');
  }

  partA(input: string[]): number {
    return -1;
  }
  partB(input: string[]): number {
    return -1;
  }
}

export const aoc2020day7 = new AoC2020Day7();
