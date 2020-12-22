import { AoC, AoCAnswer } from 'aocf';

export interface Bus {
  offset: number;
  id: number;
}
export interface BusInfo {
  start: number;
  busses: Bus[];
}

export class AoC2020Day13 extends AoC<BusInfo> {
  constructor() {
    super(2020, 13);
  }

  parse(i: string): BusInfo {
    const chunks = i.split('\n');
    const busses: { offset: number; id: number }[] = [];

    chunks[1].split(',').forEach((c: string, i: number): void => {
      const id = Number(c);
      if (isNaN(id)) return;
      busses.push({ id, offset: i });
    });

    return { start: Number(chunks[0]), busses };
  }

  partA(input: BusInfo): number {
    let bestNumber = Number.MAX_SAFE_INTEGER;
    let bestBus: Bus | null = null;
    for (const o of input.busses) {
      const arrive = Math.floor(input.start / o.id) * o.id;
      const depart = arrive + o.id;
      if (bestNumber > depart) {
        bestNumber = depart;
        bestBus = o;
      }
    }
    return (bestBus?.id ?? 0) * (bestNumber - input.start);
  }

  partB(input: BusInfo): number {
    const { busses } = input;
    const previousMultipliers = [];
    let inc = 1;
    let multiplier = 0;
    let busOff = 1;
    for (let iterations = 0; iterations < 10e6; iterations++) {
      const time = busses[0].id * multiplier;

      if (time > Number.MAX_SAFE_INTEGER) throw new Error('Number overflow');
      for (let i = busOff; i < busses.length; i++) {
        const bus = busses[i];

        if ((time + bus.offset) % bus.id != 0) break;
        // Success!
        if (i == busses.length - 1) return time;

        // Record the first time we saw this bus combination working
        if (previousMultipliers[bus.id] == null) {
          previousMultipliers[bus.id] = multiplier;
          break;
        }
        // Limit searching to only the busses we need to check
        if (busOff < i) busOff = i + 1;

        // Buss collisions are cyclic, just repeat the cycle
        inc = multiplier - previousMultipliers[bus.id];
        previousMultipliers[bus.id] = multiplier;
      }

      multiplier += inc;
    }
    return -1;
  }
}

export const aoc2020day13 = new AoC2020Day13();

aoc2020day13.test((o) => {
  o('small', async () => {
    const res = await aoc2020day13.run(`939\n7,13,x,x,59,x,31,19`);
    o(res.a).equals(295);
  });

  o('partB', async () => {
    let res: { a: AoCAnswer; b: AoCAnswer } | null = null;
    res = await aoc2020day13.run(`939\n17,x,13,19`);
    o(res.b).equals(3417);

    res = await aoc2020day13.run(`39\n3,5,x,7`);
    o(res.b).equals(39);
    res = await aoc2020day13.run(`21\n3,x,x,4,5`);
    o(res.b).equals(21);
    res = await aoc2020day13.run(`21\n67,7,59,61`);
    o(res.b).equals(754018);
  });
});
