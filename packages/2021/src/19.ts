import { AoC, Vec3 } from 'aocf';

export type Input = Scanner[];

export class Signal {
  x: number;
  y: number;
  z: number;
  possibles: Map<string, Signal> = new Map();

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  get id(): string {
    return `${this.x},${this.y},${this.z}`;
  }

  init(other: Signal): void {
    const dx = Math.abs(this.x - other.x);
    const dy = Math.abs(this.y - other.y);
    const dz = Math.abs(this.z - other.z);
    const deltaId = [Math.min(dx, dy, dz), Math.max(dx, dy, dz), dx + dy + dz].join('__');
    this.possibles.set(deltaId, other);
    other.possibles.set(deltaId, this);
  }

  matches(s: Signal): { id: string; a: Signal; b: Signal }[] {
    const result: { id: string; a: Signal; b: Signal }[] = [];
    for (const r of this.possibles.entries()) {
      const index = s.possibles.get(r[0]);
      if (index != null) result.push({ b: index, a: r[1], id: r[0] });
    }
    return result;
  }

  toVector(): Vec3 {
    return { x: this.x, y: this.y, z: this.z };
  }
}

export interface SignalMatch {
  id: string;
  a: Signal;
  b: Signal;
}
export interface ScannerMatch {
  a: Signal;
  b: Signal;
  matches: SignalMatch[];
}

function matchNeg(a: number, b: number): number {
  if (a == b) return 1;
  if (a == -b) return -1;
  return 0;
}

export class Scanner {
  signals: Signal[] = [];
  position: Vec3 = { x: 0, y: 0, z: 0 };

  add(x: number, y: number, z: number): void {
    const signal = new Signal(x, y, z);
    for (const s of this.signals) s.init(signal);
    this.signals.push(signal);
  }

  matches(other: Scanner): ScannerMatch | null {
    for (const a of this.signals) {
      for (const b of other.signals) {
        const matches = a.matches(b);
        if (matches.length > 10) return { a, b, matches };
      }
    }
    return null;
  }

  fixPosition(scanner: Scanner, match: ScannerMatch): void {
    const { a: here, b: there } = match;

    const m = match.matches[0];
    const rhX = here.x - m.a.x;
    const rhY = here.y - m.a.y;
    const rhZ = here.z - m.a.z;

    const rtX = there.x - m.b.x;
    const rtY = there.y - m.b.y;
    const rtZ = there.z - m.b.z;

    const rotations = [
      matchNeg(rhX, rtX),
      matchNeg(rhY, rtX),
      matchNeg(rhZ, rtX),
      matchNeg(rhX, rtY),
      matchNeg(rhY, rtY),
      matchNeg(rhZ, rtY),
      matchNeg(rhX, rtZ),
      matchNeg(rhY, rtZ),
      matchNeg(rhZ, rtZ),
    ];

    for (const signal of scanner.signals) {
      const oldX = signal.x;
      const oldY = signal.y;
      const oldZ = signal.z;
      signal.x = oldX * rotations[0] + oldY * rotations[3] + oldZ * rotations[6];
      signal.y = oldX * rotations[1] + oldY * rotations[4] + oldZ * rotations[7];
      signal.z = oldX * rotations[2] + oldY * rotations[5] + oldZ * rotations[8];
    }
    scanner.position = { x: here.x - there.x, y: here.y - there.y, z: here.z - there.z };
    for (const signal of scanner.signals) {
      signal.x += scanner.position.x;
      signal.y += scanner.position.y;
      signal.z += scanner.position.z;
    }
  }

  toPosition(): string {
    return `<Scanner: {x: ${this.position.x}, y: ${this.position.y}, z:${this.position.z}} />`;
  }
}

const aoc = AoC.create<Input>(2021, 19);

aoc.parse = (l: string): Input => {
  const scanners = [];
  for (const chunk of l.split('\n\n')) {
    const s = new Scanner();
    const chunks = chunk.split('\n').slice(1);
    for (const l of chunks) {
      const [x, y, z] = l.split(',').map(Number);
      s.add(x, y, z);
    }
    scanners.push(s);
  }
  const locked: Set<number> = new Set([0]);
  while (locked.size < scanners.length) {
    for (let i = 0; i < scanners.length; i++) {
      for (let j = 0; j < scanners.length; j++) {
        if (i === j) continue;
        if (!locked.has(i)) continue;
        if (locked.has(j)) continue;

        const a = scanners[i];
        const b = scanners[j];

        const matched = a.matches(b);
        if (matched == null) continue;

        a.fixPosition(b, matched);
        locked.add(j);
      }
    }
  }
  return scanners;
};

aoc.partA = (input: Input): number => {
  const beacons = new Set();
  for (const scanner of input) {
    for (const signal of scanner.signals) beacons.add(signal.id);
  }

  return beacons.size;
};

aoc.partB = (input: Input): number => {
  let max = 0;
  for (const here of input) {
    for (const there of input) {
      const distance =
        Math.abs(there.position.x - here.position.x) +
        Math.abs(there.position.y - here.position.y) +
        Math.abs(there.position.z - here.position.z);
      max = Math.max(max, distance);
    }
  }

  return max;
};

aoc.test();
