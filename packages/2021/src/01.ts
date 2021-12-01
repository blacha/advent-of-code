import { AoC, toNumberArray } from 'aocf';

export class Aoc2021Day1 extends AoC<number[]> {
  constructor() {
    super(2021, 1);
  }

  parse(input: string): number[] {
    return toNumberArray(input);
  }

  partA(data: number[]): number {
    let count = 0;
    let last = data[0];
    for (let i = 1; i < data.length; i++) {
      const num = data[i];
      if (last !== -0 && num > last) count++;
      last = num;
    }
    return count;
  }

  partB(data: number[]): number {
    let count = 0;
    for (let i = 0; i < data.length - 3; i++) {
      const winA = data[i] + data[i + 1] + data[i + 2];
      const winB = data[i + 1] + data[i + 2] + data[i + 3];
      if (winB > winA) count++;
    }
    return count;
  }
}

export const aoc2021day1 = new Aoc2021Day1();

aoc2021day1.test((o) => {
  const testValues = [199, 200, 208, 210, 200, 207, 240, 269, 260, 263];

  o('2021partA', () => {
    o(aoc2021day1.partA(testValues)).equals(7);
  });

  o('2021partB', () => {
    o(aoc2021day1.partB(testValues)).equals(5);
  });
});
