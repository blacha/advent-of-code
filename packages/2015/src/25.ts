import { AoC } from 'aocf';

export type Input = { row: number; col: number };

const aoc = AoC.create<Input>(2015, 25);

aoc.parse = (l: string): Input => {
  const chunks = l.split(' ');
  const rId = chunks.indexOf('row');
  const cId = chunks.indexOf('column');
  return { row: parseInt(chunks[rId + 1]), col: parseInt(chunks[cId + 1]) };
};

aoc.partA = (input: Input): number => {
  const { row, col } = input;

  let x = 1;
  let y = 1;
  let res = 20151125;

  while (x != col || y != row) {
    y--;
    x++;
    if (y == 0) {
      y = x;
      x = 1;
    }
    res = (res * 252533) % 33554393;
  }
  return res;
};

aoc.partB = (): number => 0;
aoc.test();
