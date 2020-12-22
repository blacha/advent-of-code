import { AoC, Iter } from 'aocf';

function first(set: Set<string>): string {
  return set.values().next().value;
}

export interface AoC2015Day21Input {
  all: Set<string>;
  safe: Set<string>;
  allergies: Map<string, Set<string>>;
  r: { a: Set<string>; i: Set<string> }[];
}
export class AoC2015Day21 extends AoC<AoC2015Day21Input> {
  constructor() {
    super(2020, 21);
  }

  parse(i: string): AoC2015Day21Input {
    const input: AoC2015Day21Input = { all: new Set(), safe: new Set(), allergies: new Map(), r: [] };
    for (const line of i.split('\n')) {
      const [ingredients, allergies] = line.split(' (');
      const allIngreds = ingredients.split(' ');
      const a = new Set(allergies.replace(')', '').replace('contains ', '').split(', '));

      for (const i of allIngreds) input.all.add(i);
      input.r.push({ i: new Set(allIngreds), a });
    }
    input.safe = new Set(input.all);
    input.allergies = new Map<string, Set<string>>();
    function cleanUp(val: string) {
      input.safe.delete(val);
      for (const set of input.allergies.values()) {
        if (!set.has(val)) continue;
        if (set.size === 1) continue;
        set.delete(val);
        if (set.size == 1) cleanUp(first(set));
      }
    }

    for (const i of input.r) {
      for (const al of i.a.values()) {
        let existing = input.allergies.get(al);
        if (existing == null) {
          existing = new Set(i.i.values());
          input.allergies.set(al, existing);
        }
        for (const al of existing.values()) {
          if (i.i.has(al)) continue;
          existing.delete(al);
        }
      }
    }
    for (const a of input.allergies.values()) {
      if (a.size == 1) cleanUp(Iter.first(a.values()));
    }

    return input;
  }
  partA(input: AoC2015Day21Input): number {
    let total = 0;
    for (const i of input.r) {
      for (const s of input.safe) if (i.i.has(s)) total++;
    }
    return total;
  }

  partB(input: AoC2015Day21Input): string {
    const keys = [...input.allergies.keys()].sort();
    return keys.map((c) => input.allergies.get(c)?.values().next().value).join(',');
  }
}

export const aoc2015day21 = new AoC2015Day21();
aoc2015day21.test();
