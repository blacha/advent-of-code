import { AoC, toNumberArray } from 'aocf';

export class Aoc2021Day1 extends AoC<number[]> {
  constructor() {
    super(2021, 1);
  }


  parse(input: string): number[] {
    return toNumberArray(input);
  }

  partA(data: number[]): number {
    return -1
  }

  partB(data: number[]): number {
    return -1;
  }
}

export const aoc2021day1 = new Aoc2021Day1();

// aoc2021day1.test((o) => {
//   const testValues = [1721, 979, 366, 299, 675, 1456];

//   o('2021partA', () => {
//     o(aoc2021day1.partA(testValues)).equals(-1);
//   });

//   o('2021partB', () => {
//     o(aoc2021day1.partB(testValues)).equals(-1);
//   });
// });
