import { AoC } from '@blacha/aocf';

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

export const aoc2015day3 = new AoC2015Day3();

aoc2015day3.test((o) => {
  o('should deliver', () => {
    o(aoc2015day3.partA('>')).equals(2);
    o(aoc2015day3.partA('^>v<')).equals(4);
    o(aoc2015day3.partA('^v^v^v^v^v')).equals(2);
  });
  o('should robo deliver', () => {
    o(aoc2015day3.partB('^v')).equals(3);
    o(aoc2015day3.partB('^>v<')).equals(3);
    o(aoc2015day3.partB('^v^v^v^v^v')).equals(11);
  });
});
