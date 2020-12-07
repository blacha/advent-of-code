import { AoC, toNumberArray } from '@blacha/aocf';

export class AoC2019Day1 extends AoC<number[]> {
  constructor() {
    super(2019, 1);
  }
  parse(input: string): number[] {
    return toNumberArray(input);
  }

  getFuel(val: number): number {
    return Math.floor(val / 3) - 2;
  }
  getFuelOfFuel(input: number, count = 0): number {
    const newFuel = this.getFuel(input);
    if (newFuel < 0) return input;
    if (count > 10) return newFuel;
    return input + this.getFuelOfFuel(newFuel, count + 1);
  }

  partA(input: number[]): number | Promise<number> {
    let total = 0;
    for (const val of input) total += this.getFuel(val);
    return total;
  }
  partB(input: number[]): number | Promise<number> {
    let total = 0;
    for (const val of input) {
      const fuel = this.getFuel(val);
      total += this.getFuelOfFuel(fuel);
    }
    return total;
  }
}

const aoc2019day1 = new AoC2019Day1();
aoc2019day1.test((o) => {
  o('getFuel', () => {
    o(aoc2019day1.partA([12])).equals(2);
    o(aoc2019day1.partA([14])).equals(2);
    o(aoc2019day1.partA([1969])).equals(654);
    o(aoc2019day1.partA([100756])).equals(33583);
  });
  o('getFuelOfFuel', () => {
    o(aoc2019day1.getFuelOfFuel(12)).equals(14);
    o(aoc2019day1.getFuelOfFuel(aoc2019day1.getFuel(1969))).equals(966);
    o(aoc2019day1.getFuelOfFuel(aoc2019day1.getFuel(100756))).equals(50346);
  });
});
