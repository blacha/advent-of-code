import { AoC } from 'aocf';

export type Input = number[][];

const aoc = AoC.create<Input>(2021, 9);

aoc.parse = (l: string): Input => {
  return l.split('\n').map((c) => c.split('').map(Number));
};

aoc.partA = (input: Input): number => {
  let output = 0;
  for (let y = 0; y < input.length; y++) {
    const line = input[y];
    for (let x = 0; x < line.length; x++) {
      const val = line[x];
      if (x > 0 && val >= line[x - 1]) continue;
      if (x < line.length - 1 && val >= line[x + 1]) continue;

      if (y > 0 && val >= input[y - 1][x]) continue;
      if (y < input.length - 1 && val >= input[y + 1][x]) continue;

      output = output + 1 + val;
    }
  }

  return output;
};

const Around = [
  { x: 0, y: 1 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: -1, y: 0 },
];

aoc.partB = (input: Input): number => {
  function findBasin(startX: number, startY: number): number {
    let count = 0;
    for (const a of Around) {
      const x = a.x + startX;
      const y = a.y + startY;
      if (x < 0) continue;
      if (y < 0) continue;
      if (y >= input.length) continue;
      if (x >= input[y].length) continue;
      const newVal = input[y][x];
      if (newVal >= 9) continue;
      input[y][x] = 1000;
      count += findBasin(x, y) + 1;
    }
    return count;
  }

  const basins: number[] = [];
  for (let y = 0; y < input.length; y++) {
    const line = input[y];
    for (let x = 0; x < line.length; x++) {
      const val = line[x];
      if (val >= 9) continue;

      basins.push(findBasin(x, y));
    }
  }
  basins.sort((a, b) => b - a);
  return basins[0] * basins[1] * basins[2];
};

const testValues = `2199943210
3987894921
9856789892
8767896789
9899965678`.trim();

aoc.test((o) => {
  o('partA', () => {
    o(aoc.answers(testValues).a).equals(15);
  });

  o('partB', () => {
    o(aoc.answers(testValues).b).equals(1134);
  });
});
