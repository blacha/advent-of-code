import { AoC, toNumberArraySorted } from 'aocf';

function findSum(current: number, currentNumbers: number[], target: number, els: number[], offset: number): number[][] {
  let output: number[][] = [];
  for (let i = offset; i < els.length; i++) {
    const el = els[i];
    const nextNum = current + el;
    if (nextNum == target) {
      output.push([...currentNumbers, el]);
    } else if (nextNum < target) {
      const subSum = findSum(nextNum, [...currentNumbers, el], target, els, i + 1);
      output = output.concat(subSum);
    }
  }
  return output;
}

export class AoC2015Day17 extends AoC<number[]> {
  constructor() {
    super(2015, 17);
  }

  parse(i: string): number[] {
    return toNumberArraySorted(i, 'desc');
  }

  partA(input: number[], search = 150): number {
    return findSum(0, [], search, input, 0).length;
  }

  partB(input: number[], search = 150): number {
    let minSize = Number.MAX_SAFE_INTEGER;
    let minCount = 0;
    const output = findSum(0, [], search, input, 0);

    for (const o of output) {
      if (o.length < minSize) {
        minSize = o.length;
        minCount = 1;
      } else if (o.length == minSize) minCount++;
    }
    return minCount;
  }
}

export const aoc2015day17 = new AoC2015Day17();

aoc2015day17.test();
