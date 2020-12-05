import { AoC } from '../framework/aoc';

export class AoC2015Day2 extends AoC<number[][]> {
  constructor() {
    super(2015, 2);
  }

  parse(input: string): number[][] {
    return input
      .trim()
      .split('\n')
      .map((c) => {
        return c.split('x').map((f) => parseInt(f, 10));
      });
  }

  partA(input: number[][]): number {
    let total = 0;
    for (const [l, w, h] of input) {
      if (isNaN(l)) continue;

      const sA = l * w;
      const sB = w * h;
      const sC = h * l;
      total += 2 * sA + 2 * sB + 2 * sC;
      total += Math.min(sA, Math.min(sB, sC));
    }
    return total;
  }

  partB(input: number[][]): number {
    let total = 0;
    for (const a of input) {
      const [sA, sB] = a.slice().sort((a, b) => a - b);
      total += 2 * (sA + sB);
      total += a[0] * a[1] * a[2];
    }
    return total;
  }
}

export const day2 = new AoC2015Day2();
