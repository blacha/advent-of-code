import { AoC } from 'aocf';

export type Input = { stacks: string[][]; moves: { count: number; from: number; to: number }[] };

const aoc = AoC.create<Input>(2022, 5);
aoc.parse = (s: string): Input => {
  const chunks = s.split('\n\n');
  const stacks: string[][] = [];
  const lines = chunks[0].split('\n');
  lines.pop();
  for (const line of lines) {
    for (let i = 0; i < line.length / 4; i++) {
      const char = line[i * 4 + 1];
      if (char == ' ') continue;
      stacks[i] = stacks[i] ?? [];
      stacks[i].unshift(char);
    }
  }
  const moves: { count: number; from: number; to: number }[] = [];

  for (const line of chunks[1].split('\n')) {
    if (line.trim() == '') continue;
    const lineChunks = line.split(' ');

    const count = Number(lineChunks[1]);
    const from = Number(lineChunks[3]) - 1;
    const to = Number(lineChunks[5]) - 1;

    moves.push({ count, from, to });
  }

  return { stacks, moves };
};
aoc.partA = (data: Input): string => {
  const stacks = data.stacks.map((c) => [...c]);

  for (const move of data.moves) {
    let count = move.count;
    while (count > 0) {
      const el = stacks[move.from].pop();
      if (el == null) throw new Error('Stack overflow');
      stacks[move.to].push(el);
      count--;
    }
  }

  const output: string[] = [];
  for (const stack of stacks) output.push(stack[stack.length - 1]);
  return output.join('');
};

aoc.partB = (data: Input): string => {
  const stacks = data.stacks.map((c) => [...c]);
  for (const move of data.moves) {
    const count = move.count;
    const from = stacks[move.from];
    const moving = from.splice(from.length - count, count);
    stacks[move.to].push(...moving);
  }

  const output: string[] = [];
  for (const stack of stacks) output.push(stack[stack.length - 1]);
  return output.join('');
};

const input = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
`;
aoc.test((o) => {
  o('parse', () => {
    o(aoc.parse(input)).deepEquals({
      stacks: [['Z', 'N'], ['M', 'C', 'D'], ['P']],
      moves: [
        { count: 1, from: 1, to: 0 },
        { count: 3, from: 0, to: 2 },
        { count: 2, from: 1, to: 0 },
        { count: 1, from: 0, to: 1 },
      ],
    });
  });
  o('PartA', () => {
    o(aoc.partA(aoc.parse(input))).equals('CMZ');
  });
  o('PartB', () => {
    o(aoc.partB(aoc.parse(input))).equals('MCD');
  });
});
