import { AoC, Point } from 'aocf';

export type AocRules = string | number[][];

export interface AoC2020Day20Input {
  tiles: Tile[];
}
const EdgeMap: Record<Edge, Edge> = {
  top: 'bottom',
  right: 'left',
  left: 'right',
  bottom: 'top',
};

export const EdgeType = { Top: 'top', Left: 'left', Right: 'right', Bottom: 'bottom' } as const;
export type Edge = 'top' | 'left' | 'right' | 'bottom';
export type Edges<T = string> = Map<Edge, T>;

export class Tile {
  id: number;
  data: string[][];
  edges: Map<string, Edge>;
  edgesFlipped: Map<string, Edge>;

  connections: Edges<Tile> = new Map();
  constructor(id: number, data: string[][]) {
    this.id = id;
    this.data = data;
    this.calcSides();
  }

  calcSides(): void {
    this.edgeCache.clear();
    this.edges = new Map();
    this.edges.set(this.edge('top'), 'top');
    this.edges.set(this.edge('left'), 'left');
    this.edges.set(this.edge('right'), 'right');
    this.edges.set(this.edge('bottom'), 'bottom');

    this.edgesFlipped = new Map();
    this.edgesFlipped.set(this.edge('top', true), 'top');
    this.edgesFlipped.set(this.edge('left', true), 'left');
    this.edgesFlipped.set(this.edge('right', true), 'right');
    this.edgesFlipped.set(this.edge('bottom', true), 'bottom');
  }

  *[Symbol.iterator](): Generator<Point & { i: string }> {
    for (let y = 0; y < this.data.length; y++) {
      for (let x = 0; x < this.data[y].length; x++) {
        yield { x, y, i: this.data[y][x] };
      }
    }
  }

  monsters(): number {
    let count = 0;
    const lines = this.data;
    for (let y = 0; y < lines.length - 1; y++) {
      for (let x = 0; x < lines[y].length - 18; x++) {
        if (lines[y][x + 18] !== '#') continue;
        if (lines[y + 1][x + 0] !== '#') continue;
        if (lines[y + 1][x + 5] !== '#') continue;
        if (lines[y + 1][x + 6] !== '#') continue;
        if (lines[y + 1][x + 11] !== '#') continue;
        if (lines[y + 1][x + 12] !== '#') continue;
        if (lines[y + 1][x + 17] !== '#') continue;
        if (lines[y + 1][x + 18] !== '#') continue;
        if (lines[y + 1][x + 19] !== '#') continue;
        if (lines[y + 2][x + 1] !== '#') continue;
        if (lines[y + 2][x + 4] !== '#') continue;
        if (lines[y + 2][x + 7] !== '#') continue;
        if (lines[y + 2][x + 10] !== '#') continue;
        if (lines[y + 2][x + 13] !== '#') continue;
        if (lines[y + 2][x + 16] !== '#') continue;
        count++;
      }
    }
    return count;
  }

  edgeCache = new Map<string, string>();
  edge(edge: Edge, reverse = false): string {
    const edgeKey = reverse ? edge + '_r' : edge;
    let existing = this.edgeCache.get(edgeKey);
    if (existing == null) {
      const newVal = this.calcEdge(edge);
      if (reverse) {
        existing = newVal.slice().reverse().join('');
      } else {
        existing = newVal.join('');
      }
      this.edgeCache.set(edgeKey, existing);
    }
    return existing;
  }

  rotate(): void {
    const oldTop = this.connections.get('top');
    const oldLeft = this.connections.get('left');
    const oldBottom = this.connections.get('bottom');
    const oldRight = this.connections.get('right');
    this.connections.clear();

    if (oldLeft) this.connections.set('top', oldLeft);
    if (oldBottom) this.connections.set('left', oldBottom);
    if (oldRight) this.connections.set('bottom', oldRight);
    if (oldTop) this.connections.set('right', oldTop);

    this.data = this.data.map((row, i) => row.map((val, j) => this.data[this.data.length - 1 - j][i]));
    this.calcSides();
  }

  find(fn: (f: Tile) => boolean): boolean {
    for (const pos of this.positions()) if (fn(this)) return true;
    return false;
  }

  *positions(): Generator<void> {
    yield;
    yield this.rotate();
    yield this.rotate();
    yield this.rotate();
    this.flipHorizontal();
    yield this.rotate();
    yield this.rotate();
    yield this.rotate();
    yield this.rotate();
  }

  flipHorizontal(): void {
    const oldLeft = this.connections.get('left');
    const oldRight = this.connections.get('right');

    if (oldLeft == null) this.connections.delete('right');
    else this.connections.set('right', oldLeft);
    if (oldRight == null) this.connections.delete('left');
    else this.connections.set('left', oldRight);

    const a = this.data;
    const n = a.length;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n / 2; j++) {
        const tmp = a[i][j];
        a[i][j] = a[i][n - j - 1];
        a[i][n - j - 1] = tmp;
      }
    }
    this.calcSides();
  }

  calcEdge(edgeType: Edge): string[] {
    switch (edgeType) {
      case 'top':
        return this.data[0];
      case 'left':
        return this.data.map((c) => c[0]);
      case 'right':
        return this.data.map((c) => c[c.length - 1]);
      case 'bottom':
        return this.data[this.data.length - 1];
      default:
        throw new Error('Unknown edge: ' + edgeType);
    }
  }

  compare(tile: Tile): void {
    if (tile.id == this.id) return;
    for (const [edge, edgeName] of this.edges.entries()) {
      if (tile.edges.has(edge) || tile.edgesFlipped.has(edge)) {
        this.connections.set(edgeName, tile);
      }
    }
  }
}

function direction(x: number, y: number, edge: Edge): Point {
  if (edge == 'top') return { x, y: y - 1 };
  if (edge == 'bottom') return { x, y: y + 1 };
  if (edge == 'left') return { x: x - 1, y };
  if (edge == 'right') return { x: x + 1, y };

  throw new Error('Bad Direction');
}

export class AoC2020Day20 extends AoC<AoC2020Day20Input> {
  constructor() {
    super(2020, 20);
  }

  parse(i: string): AoC2020Day20Input {
    const chunks = i.split('\n\n');
    const data: AoC2020Day20Input = { tiles: [] };

    for (const chunk of chunks) {
      const lines = chunk.split('\n');
      const id = Number(lines.shift()?.split(' ')[1]?.replace(':', ''));
      data.tiles.push(
        new Tile(
          id,
          lines.map((c) => c.split('')),
        ),
      );
    }
    data.tiles.forEach((f) => data.tiles.forEach((y) => f.compare(y)));

    return data;
  }

  partA(input: AoC2020Day20Input): number {
    const { tiles } = input;

    let total = 1;
    for (const t of tiles) if (t.connections.size === 2) total *= t.id;

    return total;
  }

  partB(input: AoC2020Day20Input): number {
    const { tiles } = input;

    const gridSize = Math.sqrt(tiles.length);
    const grid: Tile[][] = [];
    for (let i = 0; i < gridSize; i++) grid.push([]);
    const topLeft = tiles.find((t) => t.connections.size === 2);
    if (topLeft == null) throw new Error('Failed to find corner');

    if (!topLeft.find((f) => f.connections.has('bottom') && f.connections.has('right'))) {
      throw new Error('Failed to find top left corner');
    }

    grid[0][0] = topLeft;

    // Rotate all the tiles into the correct position
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const el = grid[x][y];
        if (el == null) continue;

        for (const [key, tile] of el.connections.entries()) {
          const newPt = direction(x, y, key);
          const expectedEdge = EdgeMap[key];
          const tileEdge = el.edge(key);
          // Attempt to find the correct tile rotation for this edge
          if (!tile.find((f) => f.edge(expectedEdge) === tileEdge)) throw new Error('Failed to rotate: ' + tile.id);

          grid[newPt.x][newPt.y] = tile;
        }
      }
    }

    // Make a large grid of the "image" data
    const smallerGridSize = topLeft.data.length - 2;
    let bigGrid: string[][] = [];
    for (let y = 0; y < gridSize; y++) {
      const lines: string[][] = [];
      for (let x = 0; x < gridSize; x++) {
        const el = grid[x][y];
        for (let row = 1; row <= smallerGridSize; row++) {
          const line = el.data[row].slice(1, smallerGridSize + 1);
          lines[row - 1] = (lines[row - 1] ?? []).concat(line);
        }
      }
      bigGrid = bigGrid.concat(lines);
    }

    const bigTile = new Tile(-1, bigGrid);
    bigTile.find((f) => f.monsters() > 0);
    const counter = bigTile.monsters();
    let total = 0;
    for (const { i } of bigTile) if (i == '#') total++;
    return total - 15 * counter;
  }
}

export const aoc2020day20 = new AoC2020Day20();
aoc2020day20.test();
