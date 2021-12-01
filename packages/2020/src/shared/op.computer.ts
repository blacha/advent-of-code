export enum OpType {
  Noop = 'nop',
  Jump = 'jmp',
  Accumulator = 'acc',
}

export enum OpExitCode {
  TooManyLoops = 'TooManyLoops',
  OperationOutOfBounds = 'OperationOutOfBounds',
  TooManyOperations = 'TooManyOperations',
}

export interface Operation {
  op: OpType;
  val: number;
}

export class OpComputer {
  /** Max number of operations to execute */
  MaxOperations = 1e6;

  operations: Operation[];
  index: number;
  exitCode?: OpExitCode;
  accumulator: number;
  opHits: number[];
  opCount: number;

  constructor(operations: Operation[]) {
    this.operations = operations;
    this.reset();
  }

  reset(): void {
    this.index = 0;
    this.accumulator = 0;
    this.exitCode = undefined;
    this.opCount = 0;
    this.opHits = [];
  }

  /** Count the operations and which operations are being called */
  private hit(): number {
    this.opCount++;
    const prevHits = this.opHits[this.index] ?? 0;
    this.opHits[this.index] = prevHits + 1;
    return prevHits;
  }

  /** Force exit the application */
  private exit(code: OpExitCode): OpComputer {
    this.exitCode = code;
    return this;
  }

  execute(maxIterations = 1): OpComputer {
    while (true) {
      /** Something caused this to exit */
      if (this.exitCode) return this;
      /** Limit number of operations */
      if (this.opCount > this.MaxOperations) return this.exit(OpExitCode.TooManyOperations);

      const hits = this.hit();
      const op = this.operations[this.index];
      /** No operator to actually execute */
      if (op == null) return this.exit(OpExitCode.OperationOutOfBounds);

      /** Limit the number of operator re-runs that we can use */
      if (hits >= maxIterations) return this.exit(OpExitCode.TooManyLoops);

      if (op.op == OpType.Noop) this.index++;
      else if (op.op == OpType.Jump) this.index += op.val;
      else if (op.op == OpType.Accumulator) {
        this.accumulator += op.val;
        this.index++;
      }
    }
  }

  static assertOp(op: string): asserts op is OpType {
    switch (op) {
      case OpType.Noop:
      case OpType.Accumulator:
      case OpType.Jump:
        return;
    }
    throw new Error('Invalid operator : ' + op);
  }

  static create(input: string): OpComputer {
    const operations: Operation[] = [];
    for (const line of input.trim().split('\n')) {
      const chunks = line.trim().split(' ');

      const op = chunks[0];
      OpComputer.assertOp(op);
      const val = parseInt(chunks[1]);
      if (isNaN(val)) throw new Error('Failed to parse index: ' + val);
      operations.push({ op, val });
    }
    return new OpComputer(operations);
  }
}
