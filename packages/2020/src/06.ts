import { AoC } from 'aocf';

export class AoC2020Day6 extends AoC<string[]> {
  constructor() {
    super(2020, 6);
  }

  parse(input: string): string[] {
    return input.trim().split('\n\n');
  }

  partA(input: string[]): number {
    let total = 0;
    for (const line of input) {
      const checks = new Set();
      for (const q of line.split('\n')) {
        for (const ch of q) {
          checks.add(ch);
        }
      }
      total += checks.size;
    }
    return total;
  }

  partB(input: string[]): number {
    let total = 0;
    for (const group of input) {
      const checks = new Map();
      const lines = group.split('\n');
      for (const answers of lines) {
        for (const ch of answers) checks.set(ch, (checks.get(ch) ?? 0) + 1);
      }
      for (const vals of checks.values()) {
        if (vals == lines.length) total++;
      }
    }
    return total;
  }
}

export const aoc2020day6 = new AoC2020Day6();
aoc2020day6.test();
