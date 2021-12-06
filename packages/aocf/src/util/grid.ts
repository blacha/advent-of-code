const Around = [
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
  static Around = Around;
  data: T[][];
  maxX = -1;
  maxY = -1;

  hasChanges = false;
  constructor(data: T[][], maxX = -1, maxY = -1) {
    this.data = data;
    this.maxY = data.length;
    if (maxX > -1) {
      this.maxX = maxX;
    } else {
      for (const x of data) {
        this.maxX = Math.max(x.length, this.maxX);
      }
    }
    if (maxY > -1) this.maxY = maxY;
  }
  static create<T>(str: string, parse: (s: string) => T = (s): T => s as any): Grid<T> {
    const data = str.split('\n').map((c) => c.split('').map((char) => parse(char)));
    return new Grid(data);
  }

  get(x: number, y: number): T | null {
    if (x < 0 || y < 0) return null;
    if (x >= this.maxX || y >= this.maxY) return null;
    const line = this.data[y] ?? [];
    return line[x] ?? null;
  }

  set(x: number, y: number, i: T): void {
    if (this.data[y] == null) this.data[y] = [];
    const oldVal = this.data[y][x];
    if (oldVal === i) return;
    this.data[y][x] = i;
    this.hasChanges = true;
  }

  *values(): Generator<T> {
    for (let y = 0; y < this.data.length; y++) {
      const line = this.data[y];
      for (let x = 0; x < line.length; x++) yield line[x];
    }
  }

  *[Symbol.iterator](): Generator<{ i: T; x: number; y: number }> {
    for (let y = 0; y < this.data.length; y++) {
      const line = this.data[y];

      for (let x = 0; x < this.maxX; x++) {
        yield { i: line[x], x, y };
      }
    }
  }

  isInBounds(x: number, y: number): boolean {
    if (x < 0 || y < 0) return false;
    if (x >= this.maxX || y >= this.maxY) return false;
    return true;
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

  toString(fmt: (t: T) => string = (t: T): string => (t ? String(t) : '.')): string {
    const output = [];
    for (let y = 0; y < this.maxY; y++) {
      const lineOut: string[] = [];
      const line = this.data[y] ?? [];
      for (let x = 0; x < this.maxX; x++) lineOut.push(fmt(line[x]));
      output.push(lineOut.join(' '));
    }
    return output.join('\n');
  }

  clone(): Grid<T> {
    return new Grid<T>(this.data.map((c) => c.slice()));
  }

  isEqual(g: Grid<T>): boolean {
    for (const { i, x, y } of this) {
      const other = g.get(x, y);
      if (i != other) return false;
    }
    return true;
  }
}
