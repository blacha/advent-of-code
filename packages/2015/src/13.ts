import { AoC, permutations } from 'aocf';
import { stringify } from 'querystring';

export interface SeatingChart {
  a: string;
  b: string;
  change: number;
}
export class AoC2015Day13 extends AoC<SeatingChart[]> {
  constructor() {
    super(2015, 13);
  }

  parse(s: string): SeatingChart[] {
    const names = new Set<string>();
    const moods: SeatingChart[] = [];
    for (const line of s.trim().split('\n')) {
      const chunks = line.split(' ');
      const a = chunks[0];
      const isLoss = chunks[2] == 'lose'; // line.includes('would lose');
      const change = isLoss ? -1 * Number(chunks[3]) : Number(chunks[3]);
      const b = chunks[chunks.length - 1].replace('.', '');
      moods.push({ a, b, change });
      names.add(a);
    }

    return moods;
  }

  bestSeats(input: SeatingChart[]) {
    const index: Record<string, Record<string, number>> = {};
    for (const i of input) {
      index[i.a] = index[i.a] ?? {};
      index[i.a][i.b] = i.change;
    }
    const names = new Set(input.map((c) => c.a));
    let bestScore = 0;
    const maxPairs = names.size - 1;

    for (const perms of permutations(names)) {
      let score = 0;
      for (let i = 0; i < perms.length; i++) {
        const first = perms[i];
        const second = perms[i + 1 > maxPairs ? 0 : i + 1];
        score += (index[first][second] ?? 0) + (index[second][first] ?? 0);
      }

      if (score >= bestScore) bestScore = score;
    }
    return bestScore;
  }

  partA(input: SeatingChart[]): number {
    return this.bestSeats(input);
  }

  partB(input: SeatingChart[]): number {
    input.push({ a: 'me', b: '*', change: 0 });
    return this.bestSeats(input);
  }
}

export const aoc2015day13 = new AoC2015Day13();
aoc2015day13.test();
