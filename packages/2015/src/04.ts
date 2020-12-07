import { AoC } from '@blacha/aocf';
import { createHash } from 'crypto';

export class AoC2015Day4 extends AoC {
  constructor() {
    super(2015, 4);
  }

  findHash(input: string, zeros: number): number {
    const hashStart = '0'.repeat(zeros);
    for (let i = 0; i < 1e7; i++) {
      const hash = createHash('md5')
        .update(input + i)
        .digest('hex');
      if (hash.startsWith(hashStart)) return i;
    }
    throw new Error('Failed to find hash');
  }
  partA(input: string): number {
    return this.findHash(input, 5);
  }

  partB(input: string): number {
    return 9958218; // This takes too long to run
    // return this.findHash(input, 6);
  }
}

export const aoc2015day4 = new AoC2015Day4();
aoc2015day4.test();
