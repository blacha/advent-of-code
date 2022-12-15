import { AoC } from 'aocf';
import { AoCOcr } from 'aoc-ocr';

export type Actions = { action: 'noop' } | { action: 'addx'; count: number };
export type Input = Actions[];

const aoc = AoC.create<Input>(2022, 10);

aoc.parse = (l: string): Input => {
  return l
    .trim()
    .split('\n')
    .map((c) => {
      if (c.startsWith('noop')) return { action: 'noop' };
      if (c.startsWith('addx')) return { action: 'addx', count: Number(c.slice('addx'.length + 1)) };
      throw new Error('Unknown');
    });
};

function runProgram(input: Input): { total: number; screen: string[] } {
  let total = 0;

  const screen: string[] = [];

  function onCycle(): void {
    const cyclePer40 = cycle % 40;
    const offset = Math.abs(cyclePer40 - x);
    if (offset <= 1) screen[cycle] = '⬜';
    else screen[cycle] = '⬛';
    cycle++;

    if (cycle == 20 || (cycle - 20) % 40 == 0) total += cycle * x;
  }
  let x = 1;

  let cycle = 0;
  for (let i = 0; i < input.length; i++) {
    const inp = input[i];
    if (inp.action == 'noop') {
      onCycle();
    } else if (inp.action == 'addx') {
      onCycle();
      onCycle();
      x += inp.count;
      continue;
    }
  }
  return { screen, total };
}

aoc.partA = (input: Input): number => runProgram(input).total;
aoc.partB = (input: Input): string => {
  const ret = runProgram(input);
  const crt: string[][] = [];
  for (let i = 0; i < 6; i++) {
    crt.push(ret.screen.slice(i * 40, (i + 1) * 40 - 1));
  }
  return AoCOcr.parseAll(crt, '⬜');
};

aoc.test();
