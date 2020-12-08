import { AoC } from 'aocf';

export enum OpType {
  Noop = 'nop',
  Jump = 'jmp',
  Accumulator = 'acc',
}

export function parseOp(op: string): OpType {
  switch (op) {
    case OpType.Noop:
      return OpType.Noop;
    case OpType.Jump:
      return OpType.Jump;
    case OpType.Accumulator:
      return OpType.Accumulator;
  }
  throw new Error('Invalid operator : ' + op);
}

export interface Operation {
  op: OpType;
  val: number;
}

export interface OpState {
  index: number;
  a: number;
  exitCode: number;
}

export class AoC2020Day8 extends AoC<Operation[]> {
  constructor() {
    super(2020, 8);
  }

  parse(input: string): Operation[] {
    const operations = [];
    for (const line of input.trim().split('\n')) {
      const chunks = line.trim().split(' ');

      const op = parseOp(chunks[0]);
      const val = parseInt(chunks[1]);
      if (isNaN(val)) throw new Error('Failed to parse index: ' + val);
      operations.push({ op, val });
    }

    return operations;
  }

  compute(operations: Operation[], maxDuplicate = 1): OpState {
    const state: OpState = { a: 0, index: 0, exitCode: 0 };

    const visited = new Map<number, number>();
    while (true) {
      const op = operations[state.index];
      if (op == null) return state;

      const current = visited.get(state.index) ?? 0;
      if (current >= maxDuplicate) {
        state.exitCode = 1;
        return state;
      }
      visited.set(state.index, current + 1);

      if (op.op == OpType.Noop) {
        state.index++;
      } else if (op.op == OpType.Accumulator) {
        state.a += op.val;
        state.index++;
      } else if (op.op == OpType.Jump) {
        state.index += op.val;
      }
    }
  }

  partA(operations: Operation[]): number {
    return this.compute(operations, 1).a;
  }

  partB(operations: Operation[]): number {
    const maxDupes = 5;
    for (const op of operations) {
      if (op.op == OpType.Noop) {
        op.op = OpType.Jump;
        const compute = this.compute(operations, maxDupes);
        if (compute.exitCode == 0) return compute.a;
        op.op = OpType.Noop;
      }
      if (op.op == OpType.Jump) {
        op.op = OpType.Noop;
        const compute = this.compute(operations, maxDupes);
        if (compute.exitCode == 0) return compute.a;
        op.op = OpType.Jump;
      }
    }
    return -1;
  }
}

export const aoc2020day8 = new AoC2020Day8();

aoc2020day8.test((o) => {
  o('should parse', () => {
    o(aoc2020day8.parse(`nop +0\nacc -1\njmp +30`)).deepEquals([
      { op: OpType.Noop, val: 0 },
      { op: OpType.Accumulator, val: -1 },
      { op: OpType.Jump, val: 30 },
    ]);
  });
});
