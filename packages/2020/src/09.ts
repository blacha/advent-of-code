import { AoC, toNumberArray } from 'aocf';

export class AoC2020Day9 extends AoC<number[]> {
  constructor() {
    super(2020, 9);
  }

  parse(input: string): number[] {
    return toNumberArray(input);
  }

  findSumInWindow(input: number[], offset: number, windowSize: number): boolean {
    const value = input[offset];
    for (let i = offset - windowSize; i < offset; i++) {
      const iVal = input[i];
      if (iVal > value) continue;

      for (let k = offset - windowSize + 1; k < offset; k++) {
        const kVal = input[k];
        if (iVal + kVal == value) return true;
      }
    }
    return false;
  }

  partA(input: number[], windowSize = 25): number {
    for (let i = windowSize; i < input.length; i++) {
      if (this.findSumInWindow(input, i, windowSize) == false) return input[i];
    }
    return -1;
  }

  partB(input: number[], windowSize = 25): number {
    const searchNumber = this.partA(input, windowSize);
    for (let i = 0; i < input.length; i++) {
      let start = input[i];
      if (start > searchNumber) continue;

      for (let k = i + 1; k < input.length; k++) {
        start += input[k];
        if (start > searchNumber) break;
        if (start == searchNumber) {
          let min = Number.MAX_SAFE_INTEGER;
          let max = Number.MIN_SAFE_INTEGER;
          for (let j = i; j <= k; j++) {
            min = Math.min(min, input[j]);
            max = Math.max(max, input[j]);
          }
          return min + max;
        }
      }
    }
    return -1;
  }
}

export const aoc2020day9 = new AoC2020Day9();

aoc2020day9.test((o) => {
  const small = [35, 20, 15, 25, 47, 40, 62, 55, 65, 95, 102, 117, 150, 182, 127, 219, 299, 277, 309, 576];
  o('should find in small windows', () => {
    o(aoc2020day9.partA(small, 5)).equals(127);
    o(aoc2020day9.partB(small, 5)).equals(62);
  });
});
