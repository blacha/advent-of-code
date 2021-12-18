import { AoC } from 'aocf';

export type NumberTreeNode = number | [NumberTreeNode, NumberTreeNode];
export type NumberTree = [NumberTreeNode, NumberTreeNode];

export type Pair = Leaf | Node;

export class Leaf {
  v: number;
  parent: Node;
  constructor(val: number, parent: Node) {
    this.v = val;
    this.parent = parent;
  }

  isLeaf(): this is Leaf {
    return true;
  }

  get magnitude(): number {
    return this.v;
  }

  get depth(): number {
    return this.parent.depth + 1;
  }

  get parentChar(): string {
    return this.isLeft ? 'L' : 'R';
  }

  explode(): null {
    return null;
  }

  get isLeft(): boolean {
    return this.parent.left == this;
  }

  get isRight(): boolean {
    return this.parent.right == this;
  }

  toArray(): NumberTreeNode {
    return this.v;
  }

  split(): { leaf: Leaf; node: Node } | null {
    if (this.v < 10) return null;
    const node = new Node();
    node.parent = this.parent;
    node.left = new Leaf(Math.floor(this.v / 2), node);
    node.right = new Leaf(Math.ceil(this.v / 2), node);

    if (this.isLeft) this.parent.left = node;
    else this.parent.right = node;
    return { leaf: this, node };
  }

  *[Symbol.iterator](): Generator<Node | Leaf> {
    yield this;
  }
}

export class Node {
  left: Pair;
  right: Pair;
  parent: Node | null;

  isLeaf(): this is Leaf {
    return false;
  }
  get isLeft(): boolean {
    return this.parent != null && this.parent.left == this;
  }

  get isRight(): boolean {
    return this.parent != null && this.parent.right == this;
  }

  get depth(): number {
    if (this.parent == null) return 0;
    return this.parent.depth + 1;
  }

  static add(left: Node, right: Node): Node {
    const parent = new Node();
    parent.left = left;
    parent.right = right;
    left.parent = parent;
    right.parent = parent;
    return parent;
  }

  static fromNumber(data: NumberTreeNode, parent: Node): Leaf | Node {
    if (typeof data == 'number') return new Leaf(data, parent);
    const node = new Node();
    node.left = Node.fromNumber(data[0], node);
    node.right = Node.fromNumber(data[1], node);
    node.parent = parent;
    return node;
  }

  static parse(data: [NumberTreeNode, NumberTreeNode]): Node {
    const node = new Node();
    node.left = Node.fromNumber(data[0], node);
    node.right = Node.fromNumber(data[1], node);
    return node;
  }

  explode(): { leaf: Leaf; left: Leaf; right: Leaf } | null {
    if (this.parent != null && this.left.isLeaf() && this.right.isLeaf() && this.depth >= 4) {
      const leaf = new Leaf(0, this.parent);
      if (this.isLeft) this.parent.left = leaf;
      else this.parent.right = leaf;

      return { leaf, left: this.left, right: this.right };
    } else {
      const left = this.left.explode();
      if (left) return left;
      const right = this.right.explode();
      if (right) return right;
    }
    return null;
  }

  split(): { leaf: Leaf; node: Node } | null {
    const left = this.left.split();
    if (left) return left;
    return this.right.split();
  }

  stepAll(): Node {
    while (this.step()) {
      //noop
    }
    return this;
  }

  step(): boolean {
    const explode = this.explode();

    if (explode) {
      const nodes: Leaf[] = [...this].filter((f) => f.isLeaf()) as Leaf[];
      const nodeIndex = nodes.indexOf(explode.leaf);

      if (nodeIndex > 0) nodes[nodeIndex - 1].v += explode.left.v;
      if (nodeIndex < nodes.length - 1) nodes[nodeIndex + 1].v += explode.right.v;
      return true;
    }

    const split = this.split();
    if (split) return true;

    return false;
  }

  get magnitude(): number {
    return 3 * this.left.magnitude + 2 * this.right.magnitude;
  }

  *[Symbol.iterator](): Generator<Node | Leaf> {
    yield* this.left;
    yield* this.right;
    yield this;
  }

  toArray(): NumberTreeNode {
    return [this.left.toArray(), this.right.toArray()];
  }

  toArrayString(): string {
    return JSON.stringify(this.toArray());
  }
}

const aoc = AoC.create<NumberTree[]>(2021, 18);

aoc.parse = (l: string): NumberTree[] => {
  return l.split('\n').map((c) => JSON.parse(c));
};

aoc.partA = (input): number => {
  let current = Node.parse(input[0]);

  for (let i = 1; i < input.length; i++) {
    current = Node.add(current, Node.parse(input[i])).stepAll();
  }
  return current.magnitude;
};

aoc.partB = (input): number => {
  let max = Number.MIN_VALUE;
  for (let a = 0; a < input.length; a++) {
    for (let b = 0; b < input.length; b++) {
      if (b == a) continue;
      const nodeA = Node.parse(input[a]);
      const nodeB = Node.parse(input[b]);

      const res = Node.add(nodeA, nodeB).stepAll();

      const mag = res.magnitude;
      if (mag > max) max = mag;
    }
  }
  return max;
};

const testValues = `[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`.trim();

aoc.test((o) => {
  o.spec('explode', () => {
    o('should explode right', () => {
      const p = Node.parse([[[[[9, 8], 1], 2], 3], 4]);
      p.step();
      o(p.toArray()).deepEquals([[[[0, 9], 2], 3], 4]);
    });
    o('should explode left', () => {
      const p = Node.parse([7, [6, [5, [4, [3, 2]]]]]);
      p.step();
      o(p.toArray()).deepEquals([7, [6, [5, [7, 0]]]]);
    });

    o('should explode left and right', () => {
      const p = Node.parse([[6, [5, [4, [3, 2]]]], 1]);
      p.step();
      o(p.toArray()).deepEquals([[6, [5, [7, 0]]], 3]);
    });
    o('should explode left and right and up', () => {
      const p = Node.parse([
        [3, [2, [1, [7, 3]]]],
        [6, [5, [4, [3, 2]]]],
      ]);
      p.step();
      o(p.toArray()).deepEquals([
        [3, [2, [8, 0]]],
        [9, [5, [4, [3, 2]]]],
      ]);
    });
    o('should explode left and right and up #2', () => {
      const p = Node.parse([
        [3, [2, [8, 0]]],
        [9, [5, [4, [3, 2]]]],
      ]);
      p.step();
      o(p.toArray()).deepEquals([
        [3, [2, [8, 0]]],
        [9, [5, [7, 0]]],
      ]);
    });
  });

  o.spec('add', () => {
    o('should add', () => {
      const a = Node.parse([
        [[[4, 3], 4], 4],
        [7, [[8, 4], 9]],
      ]);
      const b = Node.parse([1, 1]);

      const p = Node.add(a, b);
      o(p.toArray()).deepEquals([
        [
          [[[4, 3], 4], 4],
          [7, [[8, 4], 9]],
        ],
        [1, 1],
      ]);
    });
  });

  o.spec('split', () => {
    o('should split', () => {
      const p = Node.parse(JSON.parse(`[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]`));
      o(p.step()).equals(true);
      o(p.toArrayString()).deepEquals(`[[[[0,7],4],[7,[[8,4],9]]],[1,1]]`);
      o(p.step()).equals(true);
      o(p.toArrayString()).deepEquals(`[[[[0,7],4],[15,[0,13]]],[1,1]]`);
      o(p.step()).equals(true);
      o(p.toArrayString()).deepEquals(`[[[[0,7],4],[[7,8],[0,13]]],[1,1]]`);
      o(p.step()).equals(true);
      o(p.toArrayString()).deepEquals(`[[[[0,7],4],[[7,8],[0,[6,7]]]],[1,1]]`);
      o(p.step()).equals(true);
      o(p.toArrayString()).deepEquals(`[[[[0,7],4],[[7,8],[6,0]]],[8,1]]`);
      o(p.step()).equals(false);
    });
  });

  o('partA', () => {
    o(aoc.answers(testValues).a).equals(4140);
  });
  o('partB', () => {
    o(aoc.answers(testValues).b).equals(3993);
  });
});
