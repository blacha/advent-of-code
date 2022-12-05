import { AoC } from 'aocf';

export type Compartment = { a: string; b: string };
export type Input = Compartment[];

const CharALower = 'a'.charCodeAt(0);
const CharAUpper = 'A'.charCodeAt(0);

const scores = new Map();
for (let x = 0; x < 26; x++) {
  scores.set(String.fromCharCode(CharALower + x), x + 1);
  scores.set(String.fromCharCode(CharAUpper + x), x + 27);
}

const aoc = AoC.create<Input>(2022, 3);
aoc.parse = (s: string): Compartment[] => {
  const items = [];
  for (const line of s.trim().split('\n')) {
    const halfLine = line.length / 2;
    if (line.length % 2 != 0) throw new Error(`Invalid length: ${line} ${halfLine}`);

    const a = line.slice(0, halfLine);
    const b = line.slice(halfLine);
    items.push({ a, b });
  }
  return items;
};

function findDupe(x: Compartment): string {
  const seenA = new Set();
  const seenB = new Set();

  for (let i = 0; i < x.a.length; i++) {
    const charA = x.a.charAt(i);
    if (seenB.has(charA)) return charA;
    seenA.add(charA);

    const charB = x.b.charAt(i);
    if (seenA.has(charB)) return charB;
    seenB.add(charB);
  }

  throw new Error('Found Dupe');
}
aoc.partA = (data: Input): number => {
  let score = 0;

  for (const line of data) {
    const dupe = findDupe(line);
    score += scores.get(dupe);
  }

  return score;
};

aoc.partB = (data: Input): number => {
  let score = 0;

  function calcStats(lines: Input, start: number, end: number): number {
    const sets = new Map();

    for (let i = start; i < end; i++) {
      const line = lines[i];
      for (const char of line.a) {
        const s = sets.get(char) ?? new Set();
        s.add(line.a);
        sets.set(char, s);
        if (s.size == 3) return scores.get(char);
      }

      for (const char of line.b) {
        const s = sets.get(char) ?? new Set();
        s.add(line.b);
        sets.set(char, s);
        if (s.size == 3) return scores.get(char);
      }
    }

    throw new Error('Failed to find trip');
  }

  for (let i = 0; i < data.length; i += 3) {
    score += calcStats(data, i, i + 3);
  }

  return score;
};

const input = `vJrwpWtwJgWrhcsFMMfFFhFp\njqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL\nPmmdzqPrVvPwwTWBwg\nwMqvLMZHhHMvwLHjbvcjnnSBnvTQFn\nttgJtRGJQctTZtZT\nCrZsJsPPZsGzwwsLwLmpwMDw`;

aoc.test((o) => {
  const testValues = [
    { a: 'vJrwpWtwJgWr', b: 'hcsFMMfFFhFp' },
    { a: 'jqHRNqRjqzjGDLGL', b: 'rsFMfFZSrLrFZsSL' },
    { a: 'PmmdzqPrV', b: 'vPwwTWBwg' },
    { a: 'wMqvLMZHhHMvwLH', b: 'jbvcjnnSBnvTQFn' },
    { a: 'ttgJtRGJ', b: 'QctTZtZT' },
    { a: 'CrZsJsPPZsGz', b: 'wwsLwLmpwMDw' },
  ];
  o('parse', () => {
    o(aoc.parse(input)).deepEquals(testValues);
  });
  o('PartA', () => {
    o(aoc.partA(aoc.parse(input))).equals(157);
  });
  o('PartB', () => {
    o(aoc.partB(aoc.parse(input))).equals(70);
  });
}, true);
