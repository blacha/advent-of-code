import { AoC } from 'aocf';

export type Input = Robot[][];

const aoc = AoC.create<Input>(2022, 19);

enum Resources {
  Ore,
  Clay,
  Obsidian,
  Geode,
}

function toResource(r: string): Resources {
  switch (r) {
    case 'ore':
      return Resources.Ore;
    case 'clay':
      return Resources.Clay;
    case 'obsidian':
      return Resources.Obsidian;
    case 'geode':
      return Resources.Geode;
  }
  throw new Error('Unknown Resource: ' + r);
}

interface Robot {
  name: string;
  costs: number[];
  produces: Resources;
}

aoc.parse = (l: string): Input => {
  const lines = l.split('\n');

  const blueprints: Robot[][] = [];
  for (const line of lines) {
    const chunks = line.split(' Each ');
    chunks.shift();
    const robots = chunks.map((f) => {
      const parts = f.split(' robot costs ');
      const type = toResource(parts[0]);

      const costParts = parts[1].slice(0, parts[1].length - 1).split(' and ');

      const costs: number[] = [0, 0, 0, 0];
      for (const part of costParts) {
        const [amount, r] = part.split(' ');
        costs[toResource(r)] = Number(amount);
      }

      return {
        name: parts[0],
        costs,
        produces: type,
      } as Robot;
    });

    blueprints.push(robots);
  }
  return blueprints;
};

class SimulationState {
  robots: number[];
  resources: number[];
  turnsLeft: number;
  blueprint: Robot[];
  constructor(blueprint: Robot[]) {
    this.blueprint = blueprint;
    this.turnsLeft = 24;
    this.robots = [1, 0, 0, 0];
    this.resources = [0, 0, 0, 0];
  }

  canBuild(r: Robot): boolean {
    for (let i = r.costs.length - 1; i >= 0; i--) {
      const cost = r.costs[i];
      if (cost > this.resources[i]) return false;
    }
    return true;
  }

  build(r: Robot): void {
    for (let i = 0; i < r.costs.length; i++) {
      const cost = r.costs[i];
      if (cost == null || cost === 0) continue;
      this.resources[i] -= cost;
    }
    this.robots[r.produces] += 1;
  }

  collect(): void {
    this.turnsLeft--;
    for (let r = 0; r < this.robots.length; r++) this.resources[r] += this.robots[r];
  }

  clone(): SimulationState {
    const state = new SimulationState(this.blueprint);
    for (let i = 0; i < this.robots.length; i++) state.robots[i] = this.robots[i];
    for (let i = 0; i < this.resources.length; i++) state.resources[i] = this.resources[i];
    state.turnsLeft = this.turnsLeft;
    return state;
  }

  score(): number {
    return (
      this.resources[Resources.Geode] +
      this.turnsLeft * this.robots[Resources.Geode] * 1_000_000 +
      this.robots[Resources.Obsidian] * 100_000 +
      this.robots[Resources.Clay] * 10_00
    );
  }

  toId(): string {
    return `${this.turnsLeft}__${this.robots.join('-')}__${this.resources.join('-')}`;
  }
}

class BluePrintStats {
  best: number;
  geodes: number[];
  stopBuild: number[];
  robots: number[];
  maxRobots: number[];
  scores: number[][];
  constructor(turns: number) {
    this.best = 0;
    this.geodes = Array.from({ length: turns }, () => 0);
    this.stopBuild = [16, 7, 4, 0];
    this.robots = [0, 0, 0, 0];
    this.scores = Array.from({ length: turns }, () => []);
  }
}
const MaxCheck = 50;

function simulate(state: SimulationState, stats: BluePrintStats): void {
  if (state.turnsLeft == 0) {
    const geodes = state.resources[Resources.Geode];
    if (geodes == 0) return;
    if (geodes > stats.best) stats.best = geodes;
    return;
  }

  const score = state.score();
  const scores = stats.scores[state.turnsLeft - 1];
  if (scores.length > MaxCheck) {
    if (scores[0] > score) return;
    scores[0] = score;
    scores.sort((a, b) => a - b);
  } else {
    scores.push(score);
  }

  for (let r = state.blueprint.length - 1; r >= 0; r--) {
    const robot = state.blueprint[r];
    if (state.turnsLeft < stats.stopBuild[r]) continue;
    if (state.canBuild(robot)) {
      if (robot.produces === Resources.Geode) {
        state.collect();
        state.build(robot);
        return simulate(state, stats);
      }
      const newState = state.clone();
      newState.collect();
      newState.build(robot);
      simulate(newState, stats);
    }
  }

  state.collect();
  simulate(state, stats);
}

aoc.partA = (input: Input): number => {
  let total = 0;
  let totalMax = 1;
  const values = [];
  for (let i = 0; i < Math.min(input.length); i++) {
    const state = new SimulationState(input[i]);
    const stats = new BluePrintStats(state.turnsLeft);
    simulate(state, stats);
    total += (i + 1) * stats.best;
    totalMax = totalMax * stats.best;
    values.push(stats.best);
  }

  return total;
};
aoc.partB = (input: Input): number => {
  let totalMax = 1;
  const values = [];
  for (let i = 0; i < Math.min(input.length, 3); i++) {
    const state = new SimulationState(input[i]);
    state.turnsLeft = 32;
    const stats = new BluePrintStats(state.turnsLeft);
    simulate(state, stats);
    totalMax = totalMax * stats.best;
    values.push(stats.best);
  }

  return totalMax;
};

const testValues =
  `Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
  Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`.trim();

aoc.test((o) => {
  o('partA', () => {
    o(aoc.answers(testValues).a).equals(32);
  });
});
