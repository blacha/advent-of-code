import { AoC } from 'aocf';
import { OpComputer, OpExitCode, OpType } from './shared/op.computer';

export class AoC2020Day8 extends AoC<string> {
  constructor() {
    super(2020, 8);
  }

  partA(input: string): number {
    return OpComputer.create(input).execute(1).accumulator;
  }

  partB(input: string): number {
    const comp = OpComputer.create(input);
    const maxDupes = 1; // TODO is this number too low?
    for (const op of comp.operations) {
      comp.reset();
      if (op.op == OpType.Noop) {
        op.op = OpType.Jump;
        comp.execute(maxDupes);
        if (comp.exitCode == OpExitCode.OperationOutOfBounds) return comp.accumulator;
        op.op = OpType.Noop;
      }
      if (op.op == OpType.Jump) {
        op.op = OpType.Noop;
        comp.execute(maxDupes);
        if (comp.exitCode == OpExitCode.OperationOutOfBounds) return comp.accumulator;
        op.op = OpType.Jump;
      }
    }
    return -1;
  }
}

export const aoc2020day8 = new AoC2020Day8();

aoc2020day8.test((o) => {
  o('should parse', () => {
    o(OpComputer.create(`nop +0\nacc -1\njmp +30`).operations).deepEquals([
      { op: OpType.Noop, val: 0 },
      { op: OpType.Accumulator, val: -1 },
      { op: OpType.Jump, val: 30 },
    ]);
  });
});
