import { AoC } from 'aocf';

interface Sue {
  id: number;
  children?: number;
  cats?: number;
  samoyeds?: number;
  pomeranians?: number;
  akitas?: number;
  vizslas?: number;
  goldfish?: number;
  trees?: number;
  cars?: number;
  perfumes?: number;
}

export class AoC2015Day16 extends AoC<Sue[]> {
  constructor() {
    super(2015, 16);
  }

  parse(i: string): Sue[] {
    const chunks = i.split('\n');
    const sues = chunks.map((c) => {
      const sue: Sue = {
        id: Number(c.slice(0, c.indexOf(':')).slice(3)),
      };

      const opts = c.slice(c.indexOf(':') + 1).trim();
      for (const o of opts.split(',')) {
        const [key, value] = o.trim().split(':');
        sue[key.trim() as any as 'cars'] = Number(value.trim());
      }
      return sue;
    });

    return sues;
  }

  partA(input: Sue[]): number {
    const i = input.find((f) => {
      return (
        (f.children == null || f.children == 3) &&
        (f.cats == null || f.cats == 7) &&
        (f.samoyeds == null || f.samoyeds == 2) &&
        (f.pomeranians == null || f.pomeranians == 3) &&
        (f.akitas == null || f.akitas == 0) &&
        (f.vizslas == null || f.vizslas == 0) &&
        (f.goldfish == null || f.goldfish == 5) &&
        (f.trees == null || f.trees == 3) &&
        (f.cars == null || f.cars == 2) &&
        (f.perfumes == null || f.perfumes == 1)
      );
    });
    return Number(i?.id);
  }

  partB(input: Sue[]): number {
    const i = input.find((f) => {
      return (
        (f.children == 3 || f.children == null) &&
        (f.cats == null || f.cats > 7) &&
        (f.samoyeds == 2 || f.samoyeds == null) &&
        (f.pomeranians == null || f.pomeranians < 3) &&
        (f.akitas == 0 || f.akitas == null) &&
        (f.vizslas == 0 || f.vizslas == null) &&
        (f.goldfish == null || f.goldfish < 5) &&
        (f.trees == null || f.trees > 3) &&
        (f.cars == 2 || f.cars == null) &&
        (f.perfumes == 1 || f.perfumes == null)
      );
    });
    return Number(i?.id);
  }
}

export const aoc2015day16 = new AoC2015Day16();

aoc2015day16.test();
