import { AoC } from 'aocf';
import { toNumberArraySorted } from 'aocf';

export class AoC2020Day10 extends AoC<number[]> {
  constructor() {
    super(2020, 10);
  }

  parse = toNumberArraySorted;

  partA(input: number[]): number {
    let last = 0;
    let jolt1 = 0;
    let jolt3 = 0;
    for (const i of input) {
      if (i - last == 1) jolt1++;
      if (i - last == 3) jolt3++;
      last = i;
    }
    return jolt1 * (jolt3 + 1);
  }

  partB(input: number[]): number {
    const values = [];
    input.unshift(0);
    values[input.length - 1] = 1;
    for (let i = input.length - 2; i >= 0; i--) {
      let sum = 0;
      const iVal = input[i];
      for (let j = i + 1; j < input.length; j++) {
        if (input[j] - iVal <= 3) {
          sum += values[j];
          continue;
        }
        break;
      }
      values[i] = sum;
    }
    return values[0];
  }
}

const aoc2020Day10 = new AoC2020Day10();
aoc2020Day10.test((o) => {
  const exampleA = aoc2020Day10.parse(`16\n10\n15\n5\n1\n11\n7\n19\n6\n12\n4`);
  const exampleB = aoc2020Day10.parse(
    `28\n33\n18\n42\n31\n14\n46\n20\n48\n47\n24\n23\n49\n45\n19\n38\n39\n11\n1\n32\n25\n35\n8\n17\n7\n9\n4\n2\n34\n10\n3`,
  );

  o('testA', () => {
    o(aoc2020Day10.partA(exampleA)).equals(35);
    o(aoc2020Day10.partA(exampleB)).equals(220);
  });
  o('testB', () => {
    o(aoc2020Day10.partB(exampleA)).equals(8);
    o(aoc2020Day10.partB(exampleB)).equals(19208);
  });
}, true);
