import { AoC } from 'aocf';

export type Dag = Record<string, Record<string, number>>;
export class AoC2015Day9 extends AoC<Dag> {
  constructor() {
    super(2015, 9);
  }

  parse(input: string): Dag {
    const dag: Dag = {};
    for (let line of input.split('\n')) {
      line = line.trim();
      const dist = Number(line.slice(line.indexOf('=') + 2));
      const [from, to] = line
        .slice(0, line.indexOf('='))
        .split(' to ')
        .map((c) => c.trim());

      if (dag[from] == null) dag[from] = {};
      if (dag[to] == null) dag[to] = {};

      dag[from][to] = dist;
      dag[to][from] = dist;
    }
    return dag;
  }

  bestRoute(dag: Dag, needed: Set<string>, currentCity?: string): number {
    let bestDistance = Number.MAX_SAFE_INTEGER;
    for (const city of needed.values()) {
      let distance = currentCity != null ? dag[currentCity][city] : 0;

      if (needed.size > 1) {
        const clone = new Set(needed);
        clone.delete(city);
        distance += this.bestRoute(dag, clone, city);
      }
      if (distance < bestDistance) bestDistance = distance;
    }

    return bestDistance;
  }
  worstRoute(dag: Dag, needed: Set<string>, currentCity?: string): number {
    let bestDistance = Number.MIN_SAFE_INTEGER;
    for (const city of needed.values()) {
      let distance = currentCity != null ? dag[currentCity][city] : 0;

      if (needed.size > 1) {
        const clone = new Set(needed);
        clone.delete(city);
        distance += this.worstRoute(dag, clone, city);
      }
      if (distance > bestDistance) bestDistance = distance;
    }

    return bestDistance;
  }

  partA(input: Dag): number {
    return aoc2015day9.bestRoute(input, new Set(Object.keys(input)));
  }

  partB(input: Dag): number {
    return aoc2015day9.worstRoute(input, new Set(Object.keys(input)));
  }
}

export const aoc2015day9 = new AoC2015Day9();

aoc2015day9.test((o) => {
  o('simple tests', () => {
    const dag = aoc2015day9.parse(`London to Dublin = 464
      London to Belfast = 518
      Dublin to Belfast = 141`);

    o(aoc2015day9.bestRoute(dag, new Set(Object.keys(dag)))).equals(605);
  });
});
