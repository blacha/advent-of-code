import { AoC } from 'aocf';

export type AoC2020Day18Input = Chunk;

export type Chunk = {
  left: number | Chunk;
  op: '+' | '*';
  right: number | Chunk;
};

function findMatchingBracket(input: string | string[], offset: number) {
  let count = 1;
  for (let j = offset; j < input.length; j++) {
    const o = input[j];
    if (o == '(') count++;
    else if (o == ')') {
      count--;
      if (count == 0) return j;
    }
  }
  return -1;
}

function parseChunk(input: string, offset = 0, maxOffset = input.length): number {
  let op: '+' | '*' | undefined;
  let value: number | undefined;

  for (let i = offset; i < maxOffset; i++) {
    const ch = input[i];
    if (ch == ' ') continue;
    else if (ch === '+') op = '+';
    else if (ch === '*') op = '*';
    else if (ch == '(') {
      const endOffset = findMatchingBracket(input, i + 1);
      const subChunk = parseChunk(input, i + 1, endOffset);

      if (value == null) value = subChunk;
      else {
        if (op == '+') value = value + subChunk;
        else if (op == '*') value = value * subChunk;
      }
      i = endOffset;
    } else {
      if (value == null) {
        value = Number(ch);
      } else {
        if (op == '+') value = value + Number(ch);
        else if (op == '*') value = value * Number(ch);
      }
    }
  }
  return value ?? 0;
}

function solveBrackets(input: string[]): string[] {
  const phaseA: string[] = [];
  //   console.log('SubBracket', input);

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (ch == '(') {
      const endOffset = findMatchingBracket(input, i + 1);
      phaseA.push(solve(input.slice(i + 1, endOffset)).toString());
      i = endOffset;
    } else {
      phaseA.push(ch);
    }
  }
  return phaseA;
}

function solve(input: string[]): number {
  if (input.length == 3) {
    const op = input[1];
    if (op == '+') return Number(input[0]) + Number(input[2]);
    if (op == '*') return Number(input[0]) * Number(input[2]);
  }
  //   console.log('Solve', input.join(' '));

  input = solveBrackets(input);

  let it = 0;
  let currentOp = '*';
  while (input.length > 1) {
    if (it > 10) break;

    if (input.includes('+')) currentOp = '+';
    else currentOp = '*';

    for (let i = 0; i < input.length; i++) {
      const ch = input[i];
      if (ch == currentOp) {
        const nA = Number(input[i - 1]);
        const nB = Number(input[i + 1]);
        const val = currentOp == '+' ? nA + nB : nA * nB;
        // console.log('Math', nA, currentOp, nB, input);
        input[i - 1] = val.toString();
        input.splice(i, 2);
        break;
      }
    }
    it++;
  }
  return Number(input[0]);
}

export class AoC2020Day18 extends AoC<string> {
  constructor() {
    super(2020, 18);
  }

  partA(input: string): number {
    let total = 0;
    for (const line of input.split('\n')) total += parseChunk(line);
    return total;
  }

  partB(input: string): number {
    let total = 0;
    for (const line of input.split('\n')) total += solve(line.split(' ').join('').split(''));
    return total;
  }
}

export const aoc2020day18 = new AoC2020Day18();

aoc2020day18.test((o) => {
  o('partA', () => {
    o(aoc2020day18.partA(`2 * 3 + (4 * 5)`)).equals(26);
    o(aoc2020day18.partA(`5 + (8 * 3 + 9 + 3 * 4 * 3)`)).equals(437);
    o(aoc2020day18.partA(`5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))`)).equals(12240);
    o(aoc2020day18.partA(`((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2`)).equals(13632);
  });

  o('partB', () => {
    o(aoc2020day18.partB(`1 + (2 * 3) + (4 * (5 + 6))`)).equals(51);
    o(aoc2020day18.partB(`2 * 3 + (4 * 5)`)).equals(46);
    o(aoc2020day18.partB(`5 + (8 * 3 + 9 + 3 * 4 * 3)`)).equals(1445);
    o(aoc2020day18.partB(`5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))`)).equals(669060);
    o(aoc2020day18.partB(`((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2`)).equals(23340);
  });
});
