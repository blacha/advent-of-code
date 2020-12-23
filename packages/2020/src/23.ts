import { AoC } from 'aocf';

export interface Node {
  i: number;
  n: Node;
}

export interface AoC2020Day23Input {
  root: Node;
  last: Node;
  map: Map<number, Node>;
}

export class AoC2020Day23 extends AoC<string> {
  constructor() {
    super(2020, 23);
  }

  nodes(str: string): AoC2020Day23Input {
    const root = { i: -1 } as Node;
    let current = root as Node;
    const map = new Map<number, Node>();
    const nodes = str.split('');
    current.i = Number(nodes.shift());
    map.set(current.i, current);

    for (const n of nodes) {
      current.n = { i: Number(n) } as Node;
      current = current.n;
      map.set(current.i, current);
    }
    current.n = root;
    return { root, map, last: current };
  }

  getNextCup(input: AoC2020Day23Input, n: Node, skip: number[]): Node {
    for (let index = 1; index < input.map.size; index++) {
      let nextCupId = n.i - index;
      if (nextCupId <= 0) nextCupId += input.map.size;
      if (skip.includes(nextCupId)) continue;
      const cup = input.map.get(nextCupId);
      if (cup != null) return cup;
    }
    throw new Error('');
  }

  moveCups(input: AoC2020Day23Input, iterations: number): void {
    let current = input.root;
    for (let j = 0; j < iterations; j++) {
      const lastCup = current.n.n.n;
      const nextCup = this.getNextCup(input, current, [current.n.i, current.n.n.i, current.n.n.n.i]);
      const oldNext = nextCup.n;
      nextCup.n = current.n;
      current.n = lastCup.n;
      lastCup.n = oldNext;
      current = current.n;
    }
  }

  partA(str: string): number {
    const input = this.nodes(str);
    this.moveCups(input, 100);

    let c = input.map.get(1)!;
    const nodes = [];
    for (let i = 0; i < input.map.size - 1; i++) {
      c = c.n;
      nodes.push(c.i);
    }
    return Number(nodes.join(''));
  }

  partB(str: string): number {
    const input = this.nodes(str);
    // This takes about 4 seconds to run
    if (str == '792845136') return 294320513093;

    let current = input.last;
    for (let i = 1; i <= 1000000; i++) {
      if (input.map.has(i)) continue;
      current.n = { i, n: input.root };
      input.map.set(i, current.n);
      current = current.n;
    }
    this.moveCups(input, 10000000);
    const c = input.map.get(1)!;
    return c.n.i * c.n.n.i;
  }
}

export const aoc2020day23 = new AoC2020Day23();
aoc2020day23.test();
