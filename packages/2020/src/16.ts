import { AoC } from 'aocf';

export type Req = Record<string, number[][]>;

interface Tickets {
  me: number[];
  others: number[][];
  reqs: Req;
}

let it = 0;
export class AoC2020Day16 extends AoC<Tickets> {
  constructor() {
    super(2020, 16);
  }

  parse(i: string): Tickets {
    const mainChunks = i.split('\n\n');
    const [def, myTicket, nearbyTickets] = mainChunks;

    const reqs: Req = {};

    def.split('\n').map((c) => {
      const [key, hunk] = c.split(':');
      const ors = hunk.split(' or ').map((ci) => ci.split('-').map(Number));
      reqs[key] = ors;
    });

    const me = myTicket.replace('your ticket:\n', '').split(',').map(Number);
    const others = nearbyTickets
      .replace('nearby tickets:\n', '')
      .split('\n')
      .map((c) => c.split(',').map(Number));

    return { me, others, reqs };
  }

  isPossiblyValid(input: number[], reqs: Req): number[] {
    const failed = [];
    for (const i of input) {
      let found = false;
      for (const [orA, orB] of Object.values(reqs)) {
        if (i >= orA[0] && i <= orA[1]) {
          found = true;
          break;
        } else if (i >= orB[0] && i <= orB[1]) {
          found = true;
          break;
        }
      }

      if (found == false) failed.push(i);
    }
    return failed;
  }

  partA(input: Tickets): number {
    let num = 0;
    for (const i of input.others) {
      const val = this.isPossiblyValid(i, input.reqs);
      for (const v of val) num += v;
    }
    return num;
  }

  fitlerTickets(sets: Set<string>[], filterOut: string, filterIndex: number, indent = ''): void {
    it++;
    if (it > 1000) throw new Error('Failed');

    for (let i = 0; i < sets.length; i++) {
      const opt = sets[i];
      const before = opt.size;

      if (opt.has(filterOut) && i != filterIndex) {
        opt.delete(filterOut);
      }

      if (before > 1 && opt.size == 1 && i != filterIndex) {
        const current = [...opt.values()][0];
        this.fitlerTickets(sets, current, i, indent + ' ');
      }
    }
  }

  partB(input: Tickets): number {
    const validTickets = input.others.filter((f) => this.isPossiblyValid(f, input.reqs).length == 0);
    const ticketOptions = input.me.map(() => new Set(Object.keys(input.reqs)));

    for (const [key, [orA, orB]] of Object.entries(input.reqs)) {
      for (const ticket of validTickets) {
        for (let j = 0; j < ticket.length; j++) {
          const currentOptions = ticketOptions[j];
          const ticketValue = ticket[j];
          if ((ticketValue < orA[0] || ticketValue > orA[1]) && (ticketValue < orB[0] || ticketValue > orB[1])) {
            currentOptions.delete(key);
          }
        }
      }
    }
    for (let optI = 0; optI < ticketOptions.length; optI++) {
      const opt = ticketOptions[optI];
      if (opt.size == 1) {
        const value = [...opt.values()][0];
        this.fitlerTickets(ticketOptions, value, optI);
      }
    }

    let total = 1;
    for (let optI = 0; optI < ticketOptions.length; optI++) {
      const opt = [...ticketOptions[optI].values()][0];
      if (opt.startsWith('departure')) total *= input.me[optI];
    }
    return total;
  }
}

export const aoc2020day16 = new AoC2020Day16();
aoc2020day16.test();
