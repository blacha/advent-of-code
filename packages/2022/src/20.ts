import { AoC } from 'aocf';

export type Input = { v: number; i: number }[];
const aoc = AoC.create<Input>(2022, 20);

aoc.parse = (l: string): Input => {
  return l.split('\n').map((c, i) => {
    return {
      v: Number(c),
      i,
    };
  });
};

function mixer(mixed: Input, input: Input): void {
  const mixedMax = mixed.length - 1;
  for (const op of input) {
    if (op.v == 0) continue;
    let steps = op.v % mixedMax;
    const index = mixed.indexOf(op);

    let newIndex = index;
    if (steps > 0) newIndex = (newIndex + steps) % mixedMax;
    else if (steps < 0) {
      for (let i = steps; i < 0; i++) {
        if (newIndex == 0) newIndex = mixed.length - 1;
        newIndex--;
        steps++;
      }
    }

    const indexRemove = mixed.findIndex((item) => item.i === op.i);
    mixed.splice(indexRemove, 1);
    mixed.splice(newIndex, 0, op);
  }
}

function getSum(mixed: Input): number {
  let total = 0;
  const indexZero = mixed.findIndex((f) => f.v == 0);
  for (let i = 1000; i <= 3000; i += 1000) {
    const offset = (i + indexZero) % mixed.length;
    total += mixed[offset].v;
  }

  return total;
}

aoc.partA = (input: Input): number => {
  const mixed = input.slice();

  mixer(mixed, input);

  return getSum(mixed);
};
aoc.partB = (input: Input): number => {
  const decrypted = input.map((r) => {
    return { ...r, v: r.v * 811589153 };
  });
  const mixed = decrypted.slice();

  for (let i = 0; i < 10; i++) mixer(mixed, decrypted);
  return getSum(mixed);
};

const testValues = `1
2
-3
3
-2
0
4`.trim();

aoc.test((o) => {
  o('partA', () => {
    o(aoc.answers(testValues).a).equals(3);
  });

  o('partB', () => {
    o(aoc.answers(testValues).b).equals(1623178306);
  });
});
