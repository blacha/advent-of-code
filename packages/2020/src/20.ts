import { AoC } from 'aocf';

export type AocRules = string | number[][];

export interface AoC2020Day20Input {
  tiles: Tile[];
}

export const EdgeType: Record<string, Edge> = { Top: 'top', Left: 'left', Right: 'right', Bottom: 'bottom' };
export type Edge = keyof Edges;
export type Edges = {
  top: string;
  left: string;
  right: string;
  bottom: string;
};

export class Tile {
  id: number;
  data: string[];
  edges: Map<string, Edge>;
  edgesFlipped: Map<string, Edge>;

  top: string;
  left: string;
  right: string;
  bottom: string;
  flippedTop: string;

  flippedLeft: string;
  flippedRight: string;
  flippedBottom: string;

  options: Map<string, number[]> = new Map();

  constructor(id: number, data: string[]) {
    this.id = id;
    this.data = data;

    this.top = this.data[0];
    this.left = this.data.map((c) => c[0]).join('');
    this.right = this.data.map((c) => c[c.length - 1]).join('');
    this.bottom = this.data[this.data.length - 1];

    this.flippedTop = this.top.split('').reverse().join('');
    this.flippedLeft = this.left.split('').reverse().join('');
    this.flippedRight = this.right.split('').reverse().join('');
    this.flippedBottom = this.bottom.split('').reverse().join('');

    this.edges = new Map();
    this.edges.set(this.top, 'top');
    this.edges.set(this.left, 'left');
    this.edges.set(this.right, 'right');
    this.edges.set(this.bottom, 'bottom');

    this.edgesFlipped = new Map();
    this.edges.set(this.flippedTop, 'top');
    this.edges.set(this.flippedLeft, 'left');
    this.edges.set(this.flippedRight, 'right');
    this.edges.set(this.flippedBottom, 'bottom');
  }

  compare(tile: Tile): void {
    if (tile.id == this.id) return;
    for (const [edge, edgeName] of this.edges.entries()) {
      if (tile.edges.has(edge) || tile.edgesFlipped.has(edge)) {
        const existing = this.options.get(edgeName) ?? [];
        if (!existing.includes(tile.id)) {
          existing.push(tile.id);
          this.options.set(edgeName, existing);
        }
      }
    }
  }
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
      data.tiles.push(new Tile(id, lines));
    }

    return data;
  }

  partA(input: AoC2020Day20Input): number {
    const { tiles } = input;
    tiles.forEach((f) => tiles.forEach((y) => f.compare(y)));

    let total = 1;
    for (const t of tiles) {
      if (t.options.size === 2) total *= t.id;
    }
    return total;
  }

  partB(input: AoC2020Day20Input): number {
    return -1;
  }
}

export const aoc2020day20 = new AoC2020Day20();
aoc2020day20.run();
