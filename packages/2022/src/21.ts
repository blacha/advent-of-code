import { AoC } from 'aocf';

export type Input = Map<string, Solver>;

const aoc = AoC.create<Input>(2022, 21);

type Operation = '+' | '-' | '*' | '/';

export interface Solver {
  value: number | null;
  id: string;
  solve(n: Map<string, Solver>): number;

  reset(): void;
}

class ConstantNode implements Solver {
  value: number;
  id: string;
  constructor(id: string, value: number) {
    this.id = id;
    this.value = value;
  }

  solve(): number {
    return this.value;
  }
  reset() {}
}

class Node implements Solver {
  operation: Operation | null;
  value: null | number;
  id: string;
  left: string;
  right: string;

  constructor(id: string, operation: Operation, left: string, right: string) {
    this.operation = operation;
    this.id = id;
    this.left = left;
    this.right = right;
  }

  calculate(x: Map<string, Solver>): number {
    const l = x.get(this.left)?.solve(x);
    const r = x.get(this.right)?.solve(x);
    if (l == null || r == null) throw new Error('Failed to solve ' + this.toString());
    switch (this.operation) {
      case '+':
        return l + r;
      case '*':
        return l * r;
      case '/':
        return l / r;
      case '-':
        return l - r;
    }
    throw new Error('Failed to solve :' + this.toString());
  }

  toString(): string {
    return `Node: ${this.id}: ${this.left} ${this.operation} ${this.right}`;
  }

  solve(x: Map<string, Solver>): number {
    if (this.value == null) this.value = this.calculate(x);
    return this.value;
  }

  reset(): void {
    this.value = null;
  }
}

aoc.parse = (l: string): Input => {
  const lines = l.split('\n');
  lines.sort((a, b) => a.length - b.length);
  // console.log(lines);

  const nodes = new Map<string, Solver>();
  for (const line of lines) {
    const chunks = line.split(': ');
    const val = Number(chunks[1]);
    if (!isNaN(val)) {
      const node = new ConstantNode(chunks[0], val);
      nodes.set(node.id, node);
    } else {
      const parts = chunks[1].split(' ');
      const node = new Node(chunks[0], parts[1] as Operation, parts[0], parts[2]);
      nodes.set(node.id, node);
    }
  }
  return nodes;
};

aoc.partA = (input: Input): number => {
  return input.get('root')?.solve(input) ?? -1;
};
aoc.partB = (input: Input): number => {
  const root = input.get('root') as Node;

  const rootLeft = input.get(root.left) as Node;
  const rootRight = input.get(root.right) as Node;

  const humn = input.get('humn') as ConstantNode;
  // target decreases by a contstant amount basic math gives us the starting I and how far to look
  let i = 3555057453064;
  const inc = 165 * 1;
  while (true) {
    i = i + inc;
    for (const n of input.values()) n.reset();

    humn.value = i;
    const lVal = rootLeft.solve(input);
    if (!Number.isInteger(lVal)) continue;
    const rVal = rootRight.solve(input);

    if (lVal == rVal) return i;
  }
};
const testValues = `root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32`.trim();

aoc.test((o) => {
  o('partA', () => {
    o(aoc.answers(testValues).a).equals(150);
  });

  o('partB', () => {
    o(aoc.answers(testValues).b).equals(301);
  });
});

aoc.fetch(true);

// console.log(aoc.answers(testValues));
