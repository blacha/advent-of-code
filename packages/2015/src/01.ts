import { AoC } from 'aocf';

export class AoC2015Day1 extends AoC {
  constructor() {
    super(2015, 1);
  }

  parse(input: string): string {
    return input;
  }

  partA(input: string): number {
    let floor = 0;
    for (const ch of input) {
      if (ch == '(') floor++;
      if (ch == ')') floor--;
    }
    return floor;
  }

  partB(input: string): number {
    let floor = 0;
    let index = 0;
    for (const ch of input) {
      if (ch == '(') floor++;
      if (ch == ')') floor--;
      index++;
      if (floor == -1) return index;
    }
    return floor;
  }
}

export const aoc2015day1 = new AoC2015Day1();

aoc2015day1.test((o) => {
  o('simple tests', () => {
    o(aoc2015day1.partA('(())')).equals(0);
  });
});
