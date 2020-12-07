import { AoC, toNumberArray } from '@blacha/aocf';

export class Aoc2020Day1 extends AoC<number[]> {
  constructor() {
    super(2020, 1);
  }

  findSum(values: number[], numbersToUse: number, numberToFind: number): number;
  findSum(values: number[], numbersToUse: number, numberToFind: number, startOffset: number): number;
  findSum(values: number[], numbersToUse: number, numberToFind: number, startOffset = 0): number | null {
    const numberSize = values.length;
    for (let i = startOffset; i < numberSize; i++) {
      const value = values[i];
      if (numbersToUse == 1) {
        if (value == numberToFind) return numberToFind;
        continue;
      }
      const nextNumber = numberToFind - value;
      if (nextNumber < 0) continue;
      const res = this.findSum(values, numbersToUse - 1, nextNumber, i + 1);
      if (res != null) return res * value;
    }
    return null;
  }

  async parse(input: string): Promise<number[]> {
    return toNumberArray(input);
  }

  async partA(data: number[]): Promise<number> {
    return this.findSum(data, 2, 2020);
  }

  async partB(data: number[]): Promise<number> {
    return this.findSum(data, 3, 2020);
  }
}

export const aoc2020day1 = new Aoc2020Day1();

aoc2020day1.test((o) => {
  const testValues = [1721, 979, 366, 299, 675, 1456];

  o('twoFor2020', async () => {
    o(await aoc2020day1.partA(testValues)).equals(514579);
  });

  o('threeFor2020', async () => {
    o(await aoc2020day1.partB(testValues)).equals(241861950);
  });
});
