import { AoC } from 'aocf';
import o from 'ospec';

export type Input = string[][];

const aoc = AoC.create<Input>(2021, 25);

aoc.parse = (l: string): Input => l.split('\n').map((c) => c.split(''));

aoc.partA = (input: Input): number => {
  const height = input.length;
  const width = input[0].length;
  let moved = false;
  let steps = 0;
  let grid = input;
  do {
    steps++;
    moved = false;

    // move East
    const newGrid = grid.map((c) => c.slice());
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let nextX = x + 1;
        if (nextX >= width) nextX -= width;
        if (grid[y][x] === '>' && grid[y][nextX] === '.') {
          newGrid[y][x] = '.';
          newGrid[y][nextX] = '>';
          moved = true;
        }
      }
    }
    // Move south
    grid = newGrid.map((c) => c.slice());
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let nextY = y + 1;
        if (nextY >= height) nextY -= height;
        if (newGrid[y][x] === 'v' && newGrid[nextY][x] === '.') {
          grid[y][x] = '.';
          grid[nextY][x] = 'v';
          moved = true;
        }
      }
    }
  } while (moved);
  return steps;
};
aoc.partB = (): number => 0;

aoc.test();
