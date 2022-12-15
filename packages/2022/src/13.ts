import { AoC } from 'aocf';

export type Packet = (number | Packet)[];
export type Input = [Packet, Packet][];

const aoc = AoC.create<Input>(2022, 13);

function compare(a: Packet, b: Packet): number {
  for (let i = 0; i < a.length; i++) {
    if (b.length <= i) return 1;
    const l = a[i];
    const r = b[i];

    if (typeof l === 'number' && typeof r === 'number') {
      if (l > r) return 1;
      if (l < r) return -1;
    } else {
      const ret = compare(Array.isArray(l) ? l : [l], Array.isArray(r) ? r : [r]);
      if (ret !== 0) return ret;
    }
  }

  if (b.length === a.length) return 0;
  return -1;
}

aoc.parse = (l: string): Input => {
  return l.split('\n\n').map((c) => {
    return c.split('\n').map((l) => JSON.parse(l)) as [Packet, Packet];
  });
};

aoc.partA = (input: Input): number => {
  let total = 0;
  for (let j = 0; j < input.length; j++) {
    const [left, right] = input[j];
    if (compare(left, right) === -1) total += j + 1;
  }
  return total;
};
aoc.partB = (input: Input): number => {
  const flat = input.flat();
  flat.push([[2]], [[6]]);

  flat.sort(compare);

  let aIndex = 0;
  let bIndex = 0;
  for (let i = 0; i < flat.length; i++) {
    const item = flat[i];
    const itemZero = item[0];
    if (item.length == 1 && Array.isArray(itemZero) && itemZero.length == 1) {
      if (itemZero[0] === 2) aIndex = i + 1;
      if (itemZero[0] === 6) bIndex = i + 1;
    }
  }

  return aIndex * bIndex;
};

// const testValues = `[1,1,3,1,1]
// [1,1,5,1,1]

// [[1],[2,3,4]]
// [[1],4]

// [9]
// [[8,7,6]]

// [[4,4],4,4]
// [[4,4],4,4,4]

// [7,7,7,7]
// [7,7,7]

// []
// [3]

// [[[]]]
// [[]]

// [1,[2,[3,[4,[5,6,7]]]],8,9]
// [1,[2,[3,[4,[5,6,0]]]],8,9]
// `.trim();

aoc.test();
