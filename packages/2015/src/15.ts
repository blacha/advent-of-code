import { AoC } from 'aocf';
import { Memoize } from 'typescript-memoize';

export interface Ingredient {
  name: string;
  capacity: number;
  durability: number;
  flavor: number;
  texture: number;
  calories: number;
  total?: number;
}
export class AoC2015Day15 extends AoC<Ingredient[]> {
  constructor() {
    super(2015, 15);
  }

  parse(i: string): Ingredient[] {
    const opts: Ingredient[] = [];
    for (const line of i.split('\n')) {
      const name = line.slice(0, line.indexOf(':')).trim();
      const attrs = line
        .slice(line.indexOf(':') + 1)
        .trim()
        .split(', ');

      const ing: any = { name };
      for (const a of attrs) {
        const c = a.split(' ');
        ing[c[0]] = Number(c[1]);
      }
      opts.push(ing);
    }
    return opts;
  }

  *pickUpTo<T>(max: number, maxSize: number, currentIndex = 0, current: number[] = []): Generator<number[]> {
    if (currentIndex == maxSize - 1) {
      current[currentIndex] = max;
      yield current;
      return;
    }
    for (let i = 0; i <= max; i++) {
      current[currentIndex] = i;
      yield* this.pickUpTo(max - i, maxSize, currentIndex + 1, current);
    }
  }

  score(inputs: Ingredient[], qty: number[], cals = 0): Ingredient & { total: number } {
    const r = { name: '', capacity: 0, durability: 0, flavor: 0, texture: 0, calories: 0, total: 0 };

    const maxIng = Math.min(inputs.length, qty.length);
    for (let index = 0; index < maxIng; index++) {
      const i = inputs[index];
      const q = qty[index];
      r.capacity += i.capacity * q;
      r.durability += i.durability * q;
      r.flavor += i.flavor * q;
      r.texture += i.texture * q;
      r.calories += i.calories * q;
    }

    if (r.capacity <= 0 || r.durability <= 0 || r.flavor <= 0 || r.texture <= 0) {
      r.total = 0;
    } else {
      r.total = r.capacity * r.durability * r.flavor * r.texture;
    }
    return r;
  }

  @Memoize()
  bothAnswers(input: Ingredient[]): { score: number; calories: number } {
    let bestScore = 0;
    let bestScoreCalories = 0;
    for (const item of this.pickUpTo(100, input.length)) {
      const s = this.score(input, item, 500);
      if (s.total > bestScore) bestScore = s.total;
      if (s.calories == 500 && s.total > bestScoreCalories) bestScoreCalories = s.total;
    }
    return { score: bestScore, calories: bestScoreCalories };
  }

  partA(input: Ingredient[]): number {
    return this.bothAnswers(input).score;
  }

  partB(input: Ingredient[]): number {
    return this.bothAnswers(input).calories;
  }
}

export const aoc2015day15 = new AoC2015Day15();
aoc2015day15.test();
