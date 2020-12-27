import { AoC, toNumberArray } from 'aocf';

export class Aoc2020Day25 extends AoC<number[]> {
  constructor() {
    super(2020, 25);
  }

  parse(str: string): number[] {
    return toNumberArray(str);
  }

  partA(data: number[]): number {
    const [cardKey, doorKey] = data;
    function findLoop(input: number): number {
      let current = 1;
      for (let i = 0; i < 100000000; i++) {
        current = (current * 7) % 20201227;
        if (current == input) return i;
      }
      throw new Error('Failed to find key');
    }

    function encrypt(key: number, loop: number): number {
      let current = 1;
      for (let i = 0; i <= loop; i++) {
        current = (current * key) % 20201227;
      }
      return current;
    }

    // Can use either, for me the second option is faster
    // const encryptKey = encrypt(cardKey, findLoop(doorKey));
    const encryptKey = encrypt(doorKey, findLoop(cardKey));

    return encryptKey;
  }

  partB(data: number[]): number {
    return -1;
  }
}

export const aoc2020day25 = new Aoc2020Day25();
aoc2020day25.test();
