import { AoC } from '@blacha/aocf';

export interface Day2TestData {
  min: number;
  max: number;
  char: string;
  pass: string;
}

export class AoC2020Day2 extends AoC<Day2TestData[]> {
  constructor() {
    super(2020, 2);
  }

  parse(str: string): Day2TestData[] {
    return str.split('\n').map((instr) => {
      const chunks = instr.split(' ');
      const [min, max] = chunks[0].split('-').map((ch) => parseInt(ch));
      const char = chunks[1].replace(':', '');
      return { min, max, char, pass: chunks[2] };
    });
  }

  partA(input: Day2TestData[]): number {
    let total = 0;
    for (const p of input) {
      let count = 0;
      for (const c of p.pass) if (c == p.char) count++;
      if (count >= p.min && count <= p.max) total++; //console.log(count, p);
    }
    return total;
  }

  partB(input: Day2TestData[]): number {
    let total = 0;
    for (const p of input) {
      const charMin = p.pass.charAt(p.min - 1) == p.char;
      const charMax = p.pass.charAt(p.max - 1) == p.char;
      if (charMin != charMax) total++;
    }
    return total;
  }
}

export const aoc2020day2 = new AoC2020Day2();

aoc2020day2.test((o) => {
  o('should parse input', async () => {
    const data = aoc2020day2.parse(`1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc`);
    o(data).deepEquals([
      { min: 1, max: 3, char: 'a', pass: 'abcde' },
      { min: 1, max: 3, char: 'b', pass: 'cdefg' },
      { min: 2, max: 9, char: 'c', pass: 'ccccccccc' },
    ]);
  });
  o('should validate test data', async () => {
    const data = aoc2020day2.parse(`1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc`);
    o(aoc2020day2.partA(data)).equals(2);
    o(aoc2020day2.partB(data)).equals(1);
  });
});
