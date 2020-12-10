import { AoC } from 'aocf';
export class AoC2015Day12 extends AoC {
  constructor() {
    super(2015, 12);
  }

  countNumbers(obj: any, removeRed = false): number {
    const isArray = Array.isArray(obj);
    const values = Object.values(obj);
    let total = 0;
    for (const value of values) {
      if (typeof value == 'number') total += value;
      else if (typeof value == 'object') total += this.countNumbers(value, removeRed);
      else if (!isArray && removeRed && value === 'red') return 0;
    }

    return total;
  }

  partA(input: string): number {
    return this.countNumbers(JSON.parse(input));
  }

  partB(input: string): number {
    return this.countNumbers(JSON.parse(input), true);
  }
}

export const aoc2015day12 = new AoC2015Day12();

aoc2015day12.test((o) => {
  o('partA', () => {
    o(aoc2015day12.partB(`[1,2,3]`)).equals(6);
    o(aoc2015day12.partB(`{"a":2,"b":4}`)).equals(6);
    o(aoc2015day12.partB(`[[[3]]]`)).equals(3);
    o(aoc2015day12.partB(`{"a":{"b":4},"c":-1}`)).equals(3);
  });
  o('partB', () => {
    o(aoc2015day12.partB(`[1,2,3]`)).equals(6);
    o(aoc2015day12.partB(`{"d":"red","e":[1,2,3,4],"f":5}`)).equals(0);
    o(aoc2015day12.partB(`[1,{"c":"red","b":2},3]`)).equals(4);
    o(aoc2015day12.partB(`[1,"red",5]`)).equals(6);
  });
});
