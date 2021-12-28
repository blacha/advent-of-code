import { AoC } from 'aocf';

export type Input = { map: string[][]; value: string };

const aoc = AoC.create<Input>(2015, 19);

aoc.parse = (l: string): Input => {
  const [replace, value] = l.split('\n\n');
  const ret = replace.split('\n').map((c) => c.split(' => '));
  return { map: ret, value };
};

aoc.partA = (inp: Input): number => {
  const vals = new Set();
  for (const [key, value] of inp.map) {
    let foundAt = -1;
    while (true) {
      foundAt = inp.value.indexOf(key, foundAt + 1);
      if (foundAt == -1) break;
      const val = inp.value.slice(0, foundAt) + value + inp.value.slice(foundAt + key.length);
      vals.add(val);
    }
  }
  return vals.size;
};

function reduce(i: string, replacements: string[][], depth: { replace: string[]; index: number }[]): number {
  for (const r of replacements) {
    if (r[0] == 'e') {
      if (i === r[1]) {
        depth.push({ replace: r, index: 0 });
        return depth.length;
      }
      continue;
    }
    const rIndex = i.indexOf(r[1]);
    if (rIndex == -1) continue;

    let newString: string;
    if (rIndex == 0) {
      newString = r[0] + i.slice(r[1].length);
    } else if (rIndex == i.length) {
      newString = i.slice(0, rIndex) + r[0];
    } else {
      newString = i.slice(0, rIndex) + r[0] + i.slice(rIndex + r[1].length);
    }

    const ret = reduce(newString, replacements, depth.concat([{ replace: r, index: rIndex }]));
    if (ret > 0) return ret;
  }
  return -1;
}

aoc.partB = (input: Input): number => {
  return reduce(input.value, input.map, []);
};

aoc.test();
