const Dirs = [
  { x: -1, y: -1 },
  { x: -1, y: 0 },
  { x: -1, y: 1 },
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: 1, y: -1 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
];

export class Grid<T = string> {
  static Dirs = Dirs;
  data: T[][];
  constructor(data: T[][]) {
    this.data = data;
  }
  static create<T>(str: string, parse: (s: string) => T = (s) => s as any): Grid<T> {
    const data = str.split('\n').map((c) => c.split('').map((char) => parse(char)));
    return new Grid(data);
  }

  get(x: number, y: number): T | null {
    if (x < 0 || y < 0) return null;
    const line = this.data[y];
    if (line == null) return null;
    return line[x] ?? null;
  }

  set(x: number, y: number, i: T): void {
    if (this.data[y] == null) this.data[y] = [];
    this.data[y][x] = i;
  }

  *[Symbol.iterator](): Generator<{ i: T; x: number; y: number }> {
    for (let y = 0; y < this.data.length; y++) {
      const line = this.data[y];
      for (let x = 0; x < line.length; x++) {
        yield { i: line[x], x, y };
      }
    }
  }

  isInBounds(x: number, y: number): boolean {
    if (x < 0 || y < 0) return false;
    const line = this.data[y];
    if (line == null) return false;
    return x < line.length;
  }

  /** Iterate around this node, generates 8 iterations unless the nodes are empty */
  *around(x: number, y: number): Generator<{ i: T; x: number; y: number }> {
    for (const d of Dirs) {
      const i = this.get(x + d.x, y + d.y);
      if (i == null) continue;
      yield { i, x, y };
    }
  }

  /** Iterate in a direction from a starting point with a given dX, dY */
  *iterate(x: number, y: number, dX: number, dY: number): Generator<{ i: T; x: number; y: number }> {
    if (dX == 0 && dY == 0) throw new Error('Cannot iterate in direction 0,0');
    while (true) {
      if (!this.isInBounds(x, y)) break;
      x = x + dX;
      y = y + dY;
      const node = this.get(x, y);
      if (node == null) continue;
      yield { i: node, x, y };
    }
  }

  toString(): string {
    return this.data.map((c) => c.join('')).join('\n');
  }

  clone(): Grid<T> {
    const output: T[][] = [];
    for (const { x, y, i } of this) {
      if (output[y] == null) output[y] = [];
      output[y][x] = i;
    }
    return new Grid<T>(output);
  }

  isEqual(g: Grid<T>): boolean {
    for (const { i, x, y } of this) {
      const other = g.get(x, y);
      if (i != other) return false;
    }
    return true;
  }
}
