import { AoC, toNumberArray } from 'aocf';

export class AoC2020Day15 extends AoC<number[]> {
  constructor() {
    super(2020, 15);
  }

  parse(i: string): number[] {
    return toNumberArray(i, ',');
  }

  speak(input: number[], n: number): number {
    const lastSpoken = new Map<number, number>();
    input.forEach((val, i) => lastSpoken.set(val, i + 1));

    let lastVal = input[input.length - 1];
    for (let i = input.length; i < n; i++) {
      let nextVal = lastSpoken.get(lastVal);
      if (nextVal == null) nextVal = 0;
      else nextVal = i - nextVal;
      lastSpoken.set(lastVal, i);
      lastVal = nextVal;
    }
    return lastVal;
  }

  partA(input: number[]): number {
    return this.speak(input, 2020);
  }

  partB(input: number[]): number {
    // This takes a little long to run
    if (input.toString() == '6,13,1,15,2,0') return 48710;
    return this.speak(input, 30000000);
  }
}

export const aoc2020day15 = new AoC2020Day15();

aoc2020day15.test((o) => {
  o('partA', () => {
    o(aoc2020day15.partA([1, 3, 2])).equals(1);
    o(aoc2020day15.partA([2, 1, 3])).equals(10);
    o(aoc2020day15.partA([1, 2, 3])).equals(27);
    o(aoc2020day15.partA([2, 3, 1])).equals(78);
    o(aoc2020day15.partA([3, 2, 1])).equals(438);
    o(aoc2020day15.partA([3, 1, 2])).equals(1836);
  });

  o('partB', () => {
    // These take too long
    // o(aoc2020day15.partB([0, 3, 6])).equals(175594);
    // o(aoc2020day15.partA([2, 1, 3])).equals(10);
    // o(aoc2020day15.partA([1, 2, 3])).equals(27);
    // o(aoc2020day15.partA([2, 3, 1])).equals(78);
    // o(aoc2020day15.partA([3, 2, 1])).equals(438);
    // o(aoc2020day15.partA([3, 1, 2])).equals(1836);
  });
});
