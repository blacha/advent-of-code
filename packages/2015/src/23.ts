import { AoC } from 'aocf';

export type Input = Operator[];

export interface Operator {
  type: string;
  run(state: State): number;
}

class OperatorHalf implements Operator {
  type = 'hlf';
  r: string;
  constructor(r: string) {
    this.r = r;
  }

  run(state: State): number {
    state[this.r] = state[this.r] / 2;
    return 1;
  }
}
class OperatorTriple implements Operator {
  type = 'tpl';
  r: string;
  constructor(r: string) {
    this.r = r;
  }
  run(state: State): number {
    state[this.r] = state[this.r] * 3;
    return 1;
  }
}
class OperatorInc implements Operator {
  type = 'inc';
  r: string;
  constructor(r: string) {
    this.r = r;
  }
  run(state: State): number {
    state[this.r] = state[this.r] + 1;
    return 1;
  }
}
class OperatorJump implements Operator {
  type = 'jmp';
  offset: number;
  constructor(offset: number) {
    if (isNaN(offset)) throw new Error('Not a number :' + offset);
    this.offset = offset;
  }

  run(): number {
    return this.offset;
  }
}
class OperatorJumpEven implements Operator {
  type = 'jie';
  offset: number;
  r: string;
  constructor(r: string, offset: number) {
    if (r !== 'a' && r !== 'b') throw new Error('Weird register: ' + r);
    if (isNaN(offset)) throw new Error('Not a number :' + offset);
    this.r = r;
    this.offset = offset;
  }
  run(state: State): number {
    if (state[this.r] % 2 === 0) return this.offset;
    return 1;
  }
}
class OperatorJumpOdd implements Operator {
  type = 'jio';
  offset: number;
  r: string;
  constructor(r: string, offset: number) {
    if (r !== 'a' && r !== 'b') throw new Error('Weird register: ' + r);
    if (isNaN(offset)) throw new Error('Not a number :' + offset);
    this.r = r;
    this.offset = offset;
  }
  run(state: State): number {
    if (state[this.r] === 1) return this.offset;
    return 1;
  }
}

export type State = Record<string, number>;

function OperatorFactory(line: string): Operator {
  const chunks = line.replace(',', '').split(' ');
  switch (chunks[0]) {
    case 'hlf':
      return new OperatorHalf(chunks[1]);
    case 'tpl':
      return new OperatorTriple(chunks[1]);
    case 'inc':
      return new OperatorInc(chunks[1]);
    case 'jmp':
      return new OperatorJump(Number(chunks[1]));
    case 'jio':
      return new OperatorJumpOdd(chunks[1], Number(chunks[2]));
    case 'jie':
      return new OperatorJumpEven(chunks[1], Number(chunks[2]));

    default:
      throw new Error('Weird line: ' + line);
  }
}

const aoc = AoC.create<Input>(2015, 23);

aoc.parse = (l: string): Input => l.split('\n').map(OperatorFactory);

function compute(ops: Operator[], state: State): State {
  let pointer = 0;
  while (pointer != ops.length) {
    const op = ops[pointer];
    if (op == null) throw new Error('Offset weird:' + pointer);
    pointer += op.run(state);
  }
  return state;
}

aoc.partA = (input: Input): number => compute(input, { a: 0, b: 0 }).b;
aoc.partB = (input: Input): number => compute(input, { a: 1, b: 0 }).b;

aoc.test();
