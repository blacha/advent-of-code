import { AoC } from 'aocf';

interface BagList {
  color: string;
  bags: { color: string; count: number }[];
  shiny: number;
  count: number;
}

export class AoC2020Day7 extends AoC<Map<string, BagList>> {
  constructor() {
    super(2020, 7);
  }

  parse(input: string): Map<string, BagList> {
    const bags = new Map<string, BagList>();
    input
      .trim()
      .split('\n')
      .forEach((c) => {
        const line = c.trim();
        if (line == '') return;
        const color = line.slice(0, line.indexOf('bags')).trim();
        const bagSet: BagList = { color, bags: [], shiny: 0, count: 0 };

        bags.set(color, bagSet);

        if (c.includes('no other bags')) return;
        const otherBags = c.slice(c.indexOf('contain') + 8, c.length - 1);
        const allBags = otherBags.split(', ');
        for (const bag of allBags) {
          const count = Number(bag.slice(0, bag.indexOf(' ')));
          const color = bag.slice(bag.indexOf(' '), bag.lastIndexOf(' ')).trim();
          bagSet.bags.push({ color, count });
        }
      });

    for (const bag of bags.values()) this.countBag(bag, bags);

    return bags;
  }

  countShiny(bag: BagList, bags: Map<string, BagList>): number {
    if (bag.shiny > 0) return bag.shiny;

    for (const { color, count } of bag.bags) {
      if (color == 'shiny gold') {
        bag.shiny += count;
      } else {
        const intBag = bags.get(color);
        if (intBag == null) throw new Error('Failed to find bag: ' + color);
        bag.shiny += this.countShiny(intBag, bags) * count;
      }
    }
    return bag.shiny;
  }

  countBag(bag: BagList, bags: Map<string, BagList>, indent = ' '): number {
    if (bag.count > 1) return bag.count;
    const subBags = bag.bags;

    for (const { color, count } of subBags) {
      const intBag = bags.get(color);
      if (intBag == null) throw new Error('Failed bag lookup:' + color);
      const bagCount = count + this.countBag(intBag, bags, indent + ' ') * count;
      bag.count += bagCount;
    }
    return bag.count;
  }

  partA(bags: Map<string, BagList>): number {
    let total = 0;
    for (const bag of bags.values()) {
      this.countShiny(bag, bags);
      if (bag.shiny > 0) total++;
    }

    return total;
  }
  partB(bags: Map<string, BagList>): number {
    const shiny = bags.get('shiny gold');
    if (shiny == null) throw new Error('Cannot find bag');
    return shiny.count;
  }
}

export const aoc2020day7 = new AoC2020Day7();

aoc2020day7.test((o) => {
  o('partB testB', () => {
    const bagList = aoc2020day7.parse(`shiny gold bags contain 2 dark red bags.
    dark red bags contain 2 dark orange bags.
    dark orange bags contain 2 dark yellow bags.
    dark yellow bags contain 2 dark green bags.
    dark green bags contain 2 dark blue bags.
    dark blue bags contain 2 dark violet bags.
    dark violet bags contain no other bags.`);
    o(bagList.get('shiny gold')?.count).equals(126);
  });
  o('partB testA', () => {
    const bagList = aoc2020day7.parse(`light red bags contain 1 bright white bag, 2 muted yellow bags.
    dark orange bags contain 3 bright white bags, 4 muted yellow bags.
    bright white bags contain 1 shiny gold bag.
    muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
    shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
    dark olive bags contain 3 faded blue bags, 4 dotted black bags.
    vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
    faded blue bags contain no other bags.
    dotted black bags contain no other bags.`);
    o(bagList.get('shiny gold')?.count).equals(32);
  });
});
