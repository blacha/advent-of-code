import { AoC } from '@blacha/aocf';

export interface Action {
  action: 'on' | 'off' | 'toggle';
  range: { x: { min: number; max: number }; y: { min: number; max: number } };
}

function getAction(line: string): 'on' | 'off' | 'toggle' {
  if (line.startsWith('turn on')) return 'on';
  if (line.startsWith('turn off')) return 'off';
  if (line.startsWith('toggle')) return 'toggle';
  throw new Error('Unknown action: ' + line);
}

export class AoC2015Day6 extends AoC<Action[]> {
  constructor() {
    super(2015, 6);
  }

  parse(input: string): Action[] {
    const grid: Action[] = [];
    const lines = input.trim().split('\n');
    for (const line of lines) {
      const action = getAction(line);
      const obj: Action = { action, range: { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } } };

      let hasMin = false;
      for (const chunk of line.split(' ')) {
        if (!chunk.includes(',')) continue;
        const [x, y] = chunk.split(',').map((c) => parseFloat(c));
        if (hasMin == false) {
          obj.range.x.min = x;
          obj.range.y.min = y;
          hasMin = true;
        } else {
          obj.range.x.max = x;
          obj.range.y.max = y;
        }
      }
      grid.push(obj);
    }

    return grid;
  }

  countLights(actions: Action[]): number {
    const grid: boolean[][] = [];
    for (const act of actions) {
      for (let x = act.range.x.min; x < act.range.x.max + 1; x++) {
        if (grid[x] == null) grid[x] = [];
        const line = grid[x];
        for (let y = act.range.y.min; y < act.range.y.max + 1; y++) {
          if (act.action == 'toggle') line[y] = line[y] == null ? true : !line[y];
          else if (act.action == 'on') line[y] = true;
          else line[y] = false;
        }
      }
    }
    let total = 0;
    for (const x of grid) {
      if (x == null) continue;
      for (const y of x) {
        if (y) total++;
      }
    }
    return total;
  }

  partA(input: Action[]): number {
    return this.countLights(input);
  }

  partB(input: Action[]): number {
    const grid: number[][] = [];
    for (const act of input) {
      for (let x = act.range.x.min; x < act.range.x.max + 1; x++) {
        if (grid[x] == null) grid[x] = [];
        const line = grid[x];
        for (let y = act.range.y.min; y < act.range.y.max + 1; y++) {
          const current = line[y] ?? 0;
          if (act.action == 'toggle') line[y] = current + 2;
          else if (act.action == 'on') line[y] = current + 1;
          else line[y] = current > 1 ? current - 1 : 0;
        }
      }
    }
    let total = 0;
    for (const x of grid) {
      if (x == null) continue;
      for (const y of x) {
        if (y == null) continue;
        total += y;
      }
    }
    return total;
  }
}

export const aoc2015day6 = new AoC2015Day6();

aoc2015day6.test((o) => {
  o('partA', () => {
    o(aoc2015day6.countLights(aoc2015day6.parse(`toggle 0,0 through 999,0`))).equals(1000);
    o(aoc2015day6.countLights(aoc2015day6.parse(`turn on 499,499 through 500,500`))).equals(4);
    o(aoc2015day6.countLights(aoc2015day6.parse(`turn on 0,0 through 999,999`))).equals(1000 * 1000);
  });

  o('partB', () => {
    o(aoc2015day6.partB(aoc2015day6.parse(`turn on 0,0 through 0,0`))).equals(1);
    o(aoc2015day6.partB(aoc2015day6.parse(`toggle 0,0 through 999,999`))).equals(2000000);
  });
});
