import { AoC } from 'aocf';
import { assert } from 'console';

export type Input = { pixels: number[]; grid: number[][] };
const aoc = AoC.create<Input>(2021, 20);

aoc.parse = (l: string): Input => {
  const [pixels, grid] = l.split('\n\n');

  const lines = grid.split('\n').map((c) => c.split('').map((c) => Number(c === '#')));

  return {
    pixels: pixels.split('').map((c) => Number(c === '#')),
    grid: lines,
  };
};
const Around = [
  { x: -1, y: -1 },
  { x: 0, y: -1 },
  { x: 1, y: -1 },

  { x: -1, y: 0 },
  { x: 0, y: 0 },
  { x: 1, y: 0 },

  { x: -1, y: 1 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
];

function getDefault(input: Input, index: number): string {
  const defaultPixel = input.pixels[0];
  if (defaultPixel == 0) return '0';

  const indexOff = index % 2 == 0;
  if (indexOff) return '0';
  return '1';
}
function enhance(input: Input, index: number): Input {
  const defaultOn = getDefault(input, index);
  const output: number[][] = [];

  for (let y = -1; y <= input.grid.length; y++) {
    const row: number[] = [];
    for (let x = -1; x <= input.grid.length; x++) {
      const num = [];
      for (const pt of Around) {
        const tX = pt.x + x;
        const tY = pt.y + y;
        const ch = input.grid[tY]?.[tX];
        if (ch == null) {
          num.push(defaultOn);
        } else if (ch) {
          num.push('1');
        } else {
          num.push('0');
        }
      }
      const lookup = parseInt(num.join(''), 2);
      assert(lookup < 512);
      row.push(input.pixels[lookup]);
    }
    output.push(row);
  }

  return { grid: output, pixels: input.pixels };
}

aoc.partA = (input: Input): number => {
  for (let i = 0; i < 2; i++) input = enhance(input, i);
  return input.grid.flat().filter(Boolean).length;
};
aoc.partB = (input: Input): number => {
  for (let i = 0; i < 50; i++) input = enhance(input, i);
  return input.grid.flat().filter(Boolean).length;
};

const testValues =
  `..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

#..#.
#....
##..#
..#..
..###`.trim();

aoc.test((o) => {
  o('partA', () => {
    o(aoc.answers(testValues).a).equals(35);
  });

  o('partB', () => {
    o(aoc.answers(testValues).b).equals(3351);
  });
});
