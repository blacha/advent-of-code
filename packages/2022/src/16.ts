import { AoC } from 'aocf';

export type Input = NodeGraph;

const aoc = AoC.create<Input>(2022, 16);

class Node {
  id: string;
  flow: number;
  tunnels: string[];
  ng: NodeGraph;

  constructor(ng: NodeGraph, id: string, flow: number, tunnels: string[]) {
    this.id = id;
    this.flow = flow;
    this.tunnels = tunnels;
    this.ng = ng;
  }
  // *
}

export class NodeGraph {
  nodes: Map<string, Node> = new Map();
  flowNodes: string[] = [];

  flowCount = 0;
  flowTotal = 0;

  add(id: string, flow: number, tunnels: string[]): Node {
    const n = new Node(this, id, flow, tunnels);
    if (flow > 0) {
      this.flowCount++;
      this.flowNodes.push(id);
    }
    this.nodes.set(n.id, n);
    return n;
  }

  get(id: string): Node {
    const node = this.nodes.get(id);
    if (node == null) throw new Error('Failed to find node: ' + id);
    return node;
  }

  _timeMap: null | Record<string, Record<string, number>> = null;
  get timeMap(): Record<string, Record<string, number>> {
    if (this._timeMap) return this._timeMap;
    const output: Record<string, Record<string, number>> = {};
    const flowNodes = this.flowNodes.map((f) => this.get(f));
    flowNodes.push(this.get('AA'));

    for (const node of flowNodes) {
      const queue: Node[] = [node];
      const distMap: Record<string, number> = { [node.id]: 0 };
      const visited = new Set<string>([node.id]);

      while (queue.length > 0) {
        const cv = queue.shift() as Node;
        for (const nextId of cv.tunnels) {
          if (!visited.has(nextId)) {
            visited.add(nextId);
            distMap[nextId] = distMap[cv.id] + 1;
            queue.push(this.get(nextId));
          }
        }
      }
      output[node.id] = distMap;
    }
    this._timeMap = output;
    return this._timeMap;
  }
}

aoc.parse = (l: string): NodeGraph => {
  const g = new NodeGraph();
  for (const line of l.split('\n')) {
    const valveIndex = line.lastIndexOf('valve');
    const tunnels = line
      .slice(valveIndex + 6)
      .trim()
      .split(', ');

    const id = line.slice(6, 8);
    const flow = Number(line.slice(line.indexOf('=') + 1, line.indexOf(';')));
    g.add(id, flow, tunnels);
  }

  g.flowNodes.sort();
  return g;
};

export type TimeDistanceMap = Record<string, number>;

function openValve(input: Input, cv: string, time: number, next: string[]): number {
  next = next.filter((n) => n !== cv);
  let bestFlow = 0;
  for (const nodeId of next) {
    const timeLeft = time - input.timeMap[cv][nodeId] - 1;
    if (timeLeft > 0) {
      const flow = input.get(nodeId).flow * timeLeft + openValve(input, nodeId, timeLeft, next);
      bestFlow = Math.max(flow, bestFlow);
    }
  }
  return bestFlow;
}
// Stolen from bhosale-ajay
aoc.partA = (input: Input): number => {
  return openValve(input, 'AA', 30, input.flowNodes);
};

// Stolen from i_have_no_biscuits
aoc.partB = (input: Input): number => {
  const bestFlowMap: Record<string, number> = {};
  function recordPath(cv: string, time: number, path: string[], pathFlow: number): void {
    const next = input.flowNodes.filter((kv) => !path.includes(kv));
    for (const nv of next) {
      const timeLeft = time - input.timeMap[cv][nv] - 1;
      if (timeLeft > 0) {
        const flow = input.get(nv).flow * timeLeft;
        recordPath(nv, timeLeft, [...path, nv], flow + pathFlow);
      }
    }
    const pathKey = [...path].sort().join('');
    bestFlowMap[pathKey] = Math.max(bestFlowMap[pathKey] || 0, pathFlow);
  }
  recordPath('AA', 26, [], 0);
  function extendBestFlowMap(options: string[]): number {
    const pathKey = options.join('');
    if (bestFlowMap[pathKey] === undefined) {
      let bestFlow = 0;
      for (const option of options) {
        const remaining = options.filter((o) => o !== option);
        bestFlow = Math.max(extendBestFlowMap(remaining), bestFlow);
      }
      bestFlowMap[pathKey] = bestFlow;
    }
    return bestFlowMap[pathKey];
  }

  extendBestFlowMap(input.flowNodes);
  let p2 = 0;
  for (const humanWork of Object.keys(bestFlowMap)) {
    const elephantWork = input.flowNodes.reduce((k, v) => (humanWork.includes(v) ? k : k + v), '');
    p2 = Math.max(p2, bestFlowMap[humanWork] + bestFlowMap[elephantWork]);
  }
  return p2;
};

const testValues = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`.trim();

aoc.test((o) => {
  o('partA', () => {
    o(aoc.answers(testValues).a).equals(1651);
  });

  o('partB', () => {
    o(aoc.answers(testValues).b).equals(1707);
  });
});
