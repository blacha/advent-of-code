import { AoC } from '@blacha/aocf';

export class AoC2020Day3 extends AoC<string[]> {
  constructor() {
    super(2020, 3);
  }

  parse(str: string): string[] {
    return str.split('\n');
  }

  isATree(map: string[], x: number, y: number): boolean | null {
    const line = map[y];
    if (line == null) return null;
    return line[x % line.length] == '#';
  }

  countTrees(map: string[], slopeX: number, slopeY: number): number {
    const cursor = { x: 0, y: 0, trees: 0 };
    while (cursor.y < map.length) {
      const isTree = this.isATree(map, cursor.x, cursor.y);
      if (isTree == null) break;
      if (isTree) cursor.trees += 1;
      cursor.x += slopeX;
      cursor.y += slopeY;
    }

    return cursor.trees;
  }

  partA(map: string[]): number {
    return this.countTrees(map, 3, 1);
  }

  partB(map: string[]): number {
    return (
      this.countTrees(map, 3, 1) *
      this.countTrees(map, 1, 1) *
      this.countTrees(map, 5, 1) *
      this.countTrees(map, 7, 1) *
      this.countTrees(map, 1, 2)
    );
  }
}

export const aoc2020day3 = new AoC2020Day3();

aoc2020day3.test();
