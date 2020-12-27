import { AoC } from 'aocf';

const Surrounding = [
  [1, 0],
  [1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
];

const MaxSize = 230;

function toXy(x: number, y: number) {
  return y * MaxSize + x;
}

export class Aoc2020Day24 extends AoC<boolean[]> {
  constructor() {
    super(2020, 24);
  }

  parse(str: string): boolean[] {
    const grid: boolean[] = new Array(MaxSize * MaxSize);
    for (const a of str.split('\n')) {
      let x = Math.floor(MaxSize / 2);
      let y = Math.floor(MaxSize / 2);
      for (let i = 0; i < a.length; i++) {
        const ch = a[i];
        const chNext = a[i + 1];
        if (ch == 'n') {
          i++;
          y++;
          if (chNext == 'w') x--;
        } else if (ch == 's') {
          i++;
          y--;
          if (chNext == 'e') x++;
        } else if (ch == 'e') x++;
        else if (ch == 'w') x--;
      }

      if (x < 0 || y < 0) throw new Error(`Increase Size x:${x} y:${y}`);

      const pt = toXy(x, y);
      const existing = grid[pt] ?? false;
      grid[pt] = !existing;
    }

    return grid;
  }

  partA(data: boolean[]): number {
    let total = 0;
    for (const v of data) if (v) total++;
    return total;
  }

  partB(data: boolean[]): number {
    let grid = data;
    const min = { x: Number.MAX_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER };
    const max = { x: 0, y: 0 };

    for (let i = 0; i < data.length; i++) {
      if (data[i] == null) continue;
      const x = i % MaxSize;
      const y = Math.floor(i / MaxSize);
      min.x = Math.min(x, min.x);
      max.x = Math.max(x, max.x);

      min.y = Math.min(y, min.y);
      max.y = Math.max(y, max.y);
    }

    for (let i = 0; i < 100; i++) {
      const output = new Array(MaxSize * MaxSize);
      for (let pY = min.y - 2; pY < max.y + 2; pY++) {
        for (let pX = min.x - 2; pX < max.x + 2; pX++) {
          const ptKey = toXy(pX, pY);
          const isBlack = grid[ptKey] ?? false;

          let blackCount = 0;
          for (const [x, y] of Surrounding) {
            const ptKeyNew = toXy(pX + x, pY + y);
            if (grid[ptKeyNew] == true) blackCount++;
          }

          if (blackCount == 2 || (isBlack && blackCount == 1)) {
            output[ptKey] = true;
          }
        }
      }

      grid = output;
      min.y -= 1;
      min.x -= 1;
      max.x += 1;
      max.y += 1;

      if (max.x >= MaxSize || max.y >= MaxSize || min.x < 0 || min.y <= 0) {
        throw new Error(`Outside Bounds: ${JSON.stringify({ min, max })}`);
      }
    }
    return this.partA(grid);
  }
}

export const aoc2020day24 = new Aoc2020Day24();
aoc2020day24.test();
