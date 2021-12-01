import { AoC } from 'aocf';

export class AoC2015Day10 extends AoC {
  constructor() {
    super(2015, 10);
  }

  translate(s: string): string {
    const output = [];
    let current: string | null = null;
    let count = 0;

    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      if (current == ch) {
        count++;
        continue;
      }
      if (count > 0) {
        output.push(count);
        output.push(current);
      }
      current = ch;
      count = 1;
      //   console.log({ current, count });
    }
    if (count > 0) {
      output.push(count);
      output.push(current);
    }
    return output.join('');
  }
  partA(input: string): number {
    let current = input;
    for (let i = 0; i < 40; i++) current = this.translate(current);
    return current.length;
  }

  partB(input: string): number {
    let current = input;
    for (let i = 0; i < 50; i++) current = this.translate(current);
    return current.length;
  }
}

export const aoc2015day10 = new AoC2015Day10();

aoc2015day10.test((o) => {
  o('simple', () => {
    o(aoc2015day10.translate('1')).equals('11');
    o(aoc2015day10.translate('11')).equals('21');
    o(aoc2015day10.translate('21')).equals('1211');
    o(aoc2015day10.translate('1211')).equals('111221');
    o(aoc2015day10.translate('111221')).equals('312211');
  });
});
