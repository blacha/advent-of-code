import { AoC } from 'aocf';

export type Input = number[];

const aoc = AoC.create<Input>(2015, 24);

aoc.parse = (l: string): Input => l.split('\n').map((c) => Number(c));

export interface Packing {
  qe: number;
  v: number[];
  total: number;
}

function* sumTo(l: number, sum: number, target: number, local: number[], input: number[]): Generator<Packing> {
  if (sum == target) {
    let total = 0;
    let qe = 1;
    for (const v of local) {
      total = total + v;
      qe = qe * v;
    }
    yield { qe, total, v: local.slice() };
  }
  for (let i = l; i < input.length; i++) {
    const v = input[i];
    if (sum + v > target) continue;
    local.push(v);
    yield* sumTo(i + 1, sum + v, target, local, input);
    local.pop();
  }
}

function findCombos(toFind: Set<number>, offset: number, combos: Packing[], toFindCount: number): Packing[] | null {
  for (let j = offset; j < combos.length; j++) {
    const cmb = combos[j];
    if (toFind.size < cmb.v.length) return null;
    if (toFindCount == 1 && cmb.v.length !== toFind.size) continue;

    let isValid = true;
    for (const v of cmb.v) {
      if (toFind.has(v)) continue;
      isValid = false;
    }
    if (!isValid) continue;

    if (toFindCount == 1) return [cmb];
    const newSet = new Set(toFind);
    for (const v of cmb.v) newSet.delete(v);
    const ret = findCombos(newSet, j + 1, combos, toFindCount - 1);
    if (ret) return [cmb].concat(ret);
  }
  return null;
}

function createGroups(input: number[], splitInto: number): number {
  const target = input.reduce((a, b) => a + b, 0) / splitInto;
  const allSums = [...sumTo(0, 0, target, [], input)];
  allSums.sort((a, b) => {
    const ret = a.v.length - b.v.length;
    if (ret == 0) return a.qe - b.qe;
    return ret;
  });

  for (let i = 0; i < allSums.length; i++) {
    const cmb = allSums[i];

    const toFind = new Set(input);
    for (const v of cmb.v) toFind.delete(v);
    const found = findCombos(toFind, i + 1, allSums, splitInto - 1);
    if (found) return cmb.qe;
  }

  return -1;
}

aoc.partA = (input: Input): number => createGroups(input.reverse(), 3);
aoc.partB = (input: Input): number => createGroups(input.reverse(), 4);

const testValues = `1\n2\n3\n4\n5\n7\n8\n9\n10\n11`.trim();

aoc.test((o) => {
  o('partA', () => {
    o(aoc.answers(testValues).a).equals(99);
  });

  o('partB', () => {
    o(aoc.answers(testValues).b).equals(44);
  });
});
