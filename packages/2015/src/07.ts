import { AoC } from 'aocf';

export const Ops = {
  AND: (a: number, b: number): number => a & b,
  OR: (a: number, b: number): number => a | b,
  LSHIFT: (a: number, b: number): number => a << b,
  RSHIFT: (a: number, b: number): number => a >> b,
  NOT: (a: number): number => ~a,
};
export interface Action {
  command: keyof typeof Ops;
  args: string[];
  output: string;
  value?: number;
}

export class AoC2015Day7 extends AoC<Map<string, Action>> {
  constructor() {
    super(2015, 7);
  }

  parse(input: string): Map<string, Action> {
    const data: Map<string, Action> = new Map();
    for (const line of input.split('\n')) {
      const command = line.match(/[A-Z]+/)?.[0] as any;
      const args = line.match(/[a-z0-9]+/g);
      if (args == null) throw new Error('Failed to match: ' + line);
      const output = args.pop() as string;
      data.set(output, { command, args, output });
    }
    return data;
  }

  wire(name: string, wires: Map<string, Action>): number {
    if (name == null) return -1;
    if (!isNaN(Number(name))) return Number(name);

    const w = wires.get(name);

    if (w == null) throw new Error('Failed to lookup wire:' + name);
    if (w.value) return w.value;
    if (w.command == null) {
      if (!isNaN(Number(w.args[0]))) return Number(w.args[0]);
      return this.wire(w.args[0], wires);
    }
    const op = Ops[w.command];
    w.value = op(this.wire(w.args[0], wires), this.wire(w.args[1], wires));

    return w.value;
  }

  partA(input: Map<string, Action>): number {
    return this.wire('a', input);
  }

  partB(input: Map<string, Action>): number {
    const wireA = this.wire('a', input);
    for (const wire of input.values()) {
      wire.value = undefined;
    }
    const wireB = input.get('b');
    if (wireB == null) throw new Error('No wire B found');
    wireB.value = wireA;

    return this.wire('a', input);
  }
}

export const aoc2015day7 = new AoC2015Day7();

aoc2015day7.test((o) => {
  o('simple tests', () => {
    const parsed = aoc2015day7.parse(
      `123 -> x\n456 -> y\nx AND y -> d\nx OR y -> e\nx LSHIFT 2 -> f\ny RSHIFT 2 -> g\nNOT x -> h\nNOT y -> i`,
    );
    o(aoc2015day7.wire('x', parsed)).equals(123);
    o(aoc2015day7.wire('y', parsed)).equals(456);
    o(aoc2015day7.wire('d', parsed)).equals(72);
    o(aoc2015day7.wire('e', parsed)).equals(507);
    o(aoc2015day7.wire('f', parsed)).equals(492);
    o(aoc2015day7.wire('g', parsed)).equals(114);
  });
});
