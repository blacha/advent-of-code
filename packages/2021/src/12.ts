import { AoC } from 'aocf';

export interface Node {
  children: Set<string>;
  node: string;
  isSmall: boolean;
}

export type Input = Map<string, Node>;

const aoc = AoC.create<Input>(2021, 12);

const CharA = 'A'.charCodeAt(0);
const CharZ = 'Z'.charCodeAt(0);

function isUpperCase(s: string): boolean {
  for (let i = 0; i < s.length; i++) {
    const ch = s.charCodeAt(i);
    if (ch >= CharA && ch <= CharZ) continue;
    return false;
  }
  return true;
}

aoc.parse = (l: string): Input => {
  const nodes: Input = new Map();
  l.split('\n').map((c) => {
    const [start, end] = c.split('-');
    let existingStart = nodes.get(start);
    if (existingStart == null) {
      existingStart = { children: new Set<string>(), node: start, isSmall: !isUpperCase(start) };
      nodes.set(start, existingStart);
    }
    existingStart.children.add(end);

    let existingEnd = nodes.get(end);
    if (existingEnd == null) {
      existingEnd = { children: new Set<string>(), node: end, isSmall: !isUpperCase(end) };
      nodes.set(end, existingEnd);
    }
    existingEnd.children.add(start);
  });

  return nodes;
};

function traverse(n: Node, map: Input, path: string[], seenSmall?: string): string[] {
  let paths: string[] = [];
  for (const child of n.children) {
    if (child == 'end') {
      paths.push(path.join(':') + ':end');
      continue;
    }
    if (child == 'start') continue;
    const nextNode = map.get(child);
    if (nextNode == null) continue;
    if (nextNode.isSmall) {
      if (path.includes(child)) {
        if (seenSmall == null) {
          const res = traverse(nextNode, map, path.concat([n.node]), child);
          paths = paths.concat(res);
        }
        continue;
      }
    }

    const res = traverse(nextNode, map, path.concat([n.node]), seenSmall);
    paths = paths.concat(res);
  }
  return paths;
}

aoc.partA = (input: Input): number => {
  const start = input.get('start');
  if (start == null) throw new Error('No start node found');
  const paths = traverse(start, input, [], '');
  return paths.length ?? -1;
};

aoc.partB = (input: Input): number => {
  const start = input.get('start');
  if (start == null) throw new Error('No start node found');
  const paths = traverse(start, input, []);
  return paths.length ?? -1;
};

const testValues = `start-A\nstart-b\nA-c\nA-b\nb-d\nA-end\nb-end`.trim();
const testValuesB = `dc-end\nHN-start\nstart-kj\ndc-start\ndc-HN\nLN-dc\nHN-end\nkj-sa\nkj-HN\nkj-dc`.trim();
const testValuesC = `fs-end\nhe-DX\nfs-he\nstart-DX\npj-DX\nend-zg\nzg-sl\nzg-pj\npj-he\nRW-he\nfs-DX\npj-RW\nzg-RW\nstart-pj\nhe-WI\nzg-he\npj-fs\nstart-RW`;
aoc.test((o) => {
  o('partA', () => {
    o(aoc.answers(testValues).a).equals(10);
    o(aoc.answers(testValuesB).a).equals(19);
    o(aoc.answers(testValuesC).a).equals(226);
  });

  o('partB', () => {
    o(aoc.answers(testValues).b).equals(36);
    o(aoc.answers(testValuesB).b).equals(103);
    o(aoc.answers(testValuesC).b).equals(3509);
  });
});
