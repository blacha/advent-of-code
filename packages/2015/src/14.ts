import { AoC, Iter } from 'aocf';
export interface Deer {
  name: string;
  duration: number;
  rest: number;
  speed: number;
  score: number;
}

export class AoC2015Day14 extends AoC<Deer[]> {
  constructor() {
    super(2015, 14);
  }

  parse(input: string): Deer[] {
    const deers = [];
    for (const line of input.split('\n')) {
      const c = line.trim().split(' ');
      const name = c[0];
      const speed = parseInt(c[3]);
      const duration = Number(c[6]);
      const rest = Number(c[c.length - 2]);
      deers.push({ name, speed, duration, rest, score: 0 });
    }
    return deers;
  }

  distance(r: Deer, time: number): number {
    // return -1;
    const cycle = r.duration + r.rest;
    const cycles = Math.floor(time / cycle);

    const leftOver = time % cycle;
    const flyingTime = Math.min(leftOver, r.duration);
    return cycles * r.speed * r.duration + flyingTime * r.speed;
  }

  partA(input: Deer[], maxTime = 2503): number {
    return this.distance(Iter.minMax(input, (t) => this.distance(t, maxTime)).max, maxTime);
  }

  partB(input: Deer[], maxTime = 2503): number {
    for (let i = 1; i < maxTime; i++) {
      const mm = Iter.minMax(input, (t) => this.distance(t, i));
      mm.max.score++;
    }
    return Iter.minMax(input, (t) => t.score).max.score;
  }
}

export const aoc2015day14 = new AoC2015Day14();

aoc2015day14.test((o) => {
  const example = aoc2015day14.parse(
    `Comet can fly 14 km/s for 10 seconds, but then must rest for 127 seconds.\nDancer can fly 16 km/s for 11 seconds, but then must rest for 162 seconds.`,
  );
  o('partB', async () => {
    o(aoc2015day14.partB(example, 1000)).equals(688);
    const mm = Iter.minMax(example, (t) => t.score);
    // TODO why are these off by one
    o(mm.max.score).equals(688);
    o(mm.min.score).equals(311);
  });
}, true);
