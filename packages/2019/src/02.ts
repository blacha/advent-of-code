import { AoC, toNumberArray } from 'aocf';

export class AoC2019Day2 extends AoC<number[]> {
  constructor() {
    super(2019, 2);
  }
  parse(input: string): number[] {
    return toNumberArray(input, ',');
  }

  execute(input: number[]): number[] {
    const ops = input.slice();
    for (let i = 0; i < ops.length; i++) {
      const code = ops[i];
      if (code == 99) break;
      if (code == 1) {
        const valA = ops[ops[i + 1]];
        const valB = ops[ops[i + 2]];
        ops[ops[i + 3]] = valA + valB;
        i += 3;
        continue;
      }
      if (code == 2) {
        const valA = ops[ops[i + 1]];
        const valB = ops[ops[i + 2]];
        ops[ops[i + 3]] = valA * valB;
        i += 3;
        continue;
      }
    }
    return ops;
  }

  partA(input: number[]): number {
    input[1] = 12;
    input[2] = 2;
    const [res] = this.execute(input.slice());
    return res;
  }
  partB(input: number[]): number {
    for (let i = 0; i < 100; i++) {
      input[1] = i;
      for (let j = 0; j < 100; j++) {
        input[2] = j;
        const [firstAnswer] = this.execute(input);
        if (firstAnswer == 19690720) return i * 100 + j;
      }
    }

    return -1;
  }
}

const aoc2019day2 = new AoC2019Day2();
aoc2019day2.test((o) => {
  o('RunCodes', () => {
    o(aoc2019day2.execute(toNumberArray('1,9,10,3,2,3,11,0,99,30,40,50', ','))).deepEquals([
      3500,
      9,
      10,
      70,
      2,
      3,
      11,
      0,
      99,
      30,
      40,
      50,
    ]);
    o(aoc2019day2.execute(toNumberArray('1,0,0,0,99', ','))).deepEquals([2, 0, 0, 0, 99]);
    o(aoc2019day2.execute(toNumberArray('2,4,4,5,99,0', ','))).deepEquals([2, 4, 4, 5, 99, 9801]);
    o(aoc2019day2.execute(toNumberArray('1,1,1,4,99,5,6,0,99', ','))).deepEquals([30, 1, 1, 4, 2, 5, 6, 0, 99]);
  });
});
