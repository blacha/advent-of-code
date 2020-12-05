import { AoC } from '../framework/aoc';

export class AoC2015Day3 extends AoC<string> {
  constructor() {
    super(2015, 3);
  }

  partA(input: string): number {
    const vists = new Set(['0:0']);
    const c = { x: 0, y: 0 };
    for (const ch of input) {
      if (ch == '>') c.x++;
      if (ch == '<') c.x--;
      if (ch == '^') c.y++;
      if (ch == 'v') c.y--;
      const pt = c.x + ':' + c.y;
      vists.add(pt);
    }
    return vists.size;
  }

  partB(input: string): number {
    const vists = new Set(['0:0']);
    const cursors = [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ];
    let index = 0;
    for (const ch of input) {
      const c = cursors[index++];
      if (index >= cursors.length) index = 0;
      if (ch == '>') c.x++;
      if (ch == '<') c.x--;
      if (ch == '^') c.y++;
      if (ch == 'v') c.y--;
      const pt = c.x + ':' + c.y;
      vists.add(pt);
    }
    return vists.size;
  }
}

export const day3 = new AoC2015Day3();

day3.run();
