import { Day3Input, Day3TestInput } from './input';

export function parseTreeMap(map: string): string[] {
  return map.split('\n');
}

export function isATree(map: string[], x: number, y: number): boolean | null {
  const line = map[y];
  if (line == null) return null;
  return line[x % line.length] == '#';
}

export const day3Map = parseTreeMap(Day3Input);
export const day3TestMap = parseTreeMap(Day3TestInput);

function countTrees(map: string[], slopeX: number, slopeY: number) {
  const cursor = { x: 0, y: 0, trees: 0 };
  while (cursor.y < map.length) {
    const isTree = isATree(map, cursor.x, cursor.y);
    if (isTree == null) break;
    if (isTree) cursor.trees += 1;
    cursor.x += slopeX;
    cursor.y += slopeY;
  }

  return cursor.trees;
}

export function day3Question1(map: string[]): number {
  return countTrees(map, 3, 1);
}

export function day3Question2(map: string[]): number {
  return (
    countTrees(map, 3, 1) *
    countTrees(map, 1, 1) *
    countTrees(map, 5, 1) *
    countTrees(map, 7, 1) *
    countTrees(map, 1, 2)
  );
}
