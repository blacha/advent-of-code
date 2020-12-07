import { AoC } from 'aocf';

export class AoC2015Day8 extends AoC<string[]> {
  constructor() {
    super(2015, 8);
  }

  parse(input: string): string[] {
    return input.split('\n');
  }

  parseLine(line: string): { size: number; length: number } {
    let size = 0;
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuote == false) {
        if (ch != '"') throw new Error('Failed to parse missing quote: ' + line);
        inQuote = true;
        continue;
      }
      if (ch == '"') {
        inQuote = false;
        continue;
      }

      if (ch == '\\') {
        if (line[i + 1] == '\\' || line[i + 1] == '"') {
          size += 1;
          i += 1;
          continue;
        }
        if (line[i + 1] == 'x') {
          size += 1;
          i += 3;
          continue;
        }
      }
      size++;
    }

    return { size, length: line.length };
  }

  partA(input: string[]): number {
    let total = 0;
    for (const line of input) {
      const res = this.parseLine(line);
      total += res.length - res.size;
    }
    return total;
  }

  partB(input: string[]): number {
    let total = 0;
    for (const line of input) {
      const newLine = JSON.stringify(line);
      total += newLine.length - line.length;
    }
    return total;
  }
}

export const aoc2015day8 = new AoC2015Day8();

aoc2015day8.test((o) => {
  o('simple tests', () => {
    o(aoc2015day8.parseLine('""')).deepEquals({ length: 2, size: 0 });
    o(aoc2015day8.parseLine('"abc"')).deepEquals({ length: 5, size: 3 });
    o(aoc2015day8.parseLine('"aaa\\"aaa"')).deepEquals({ length: 10, size: 7 });
    o(aoc2015day8.parseLine('"\\x04"')).deepEquals({ length: 6, size: 1 });
    o(aoc2015day8.parseLine('"v\\"\\xa8rrzep\\"\\"r"')).deepEquals({ length: 19, size: 11 });
  });
  o('simple testsb', () => {
    o(JSON.stringify('""')).deepEquals('"\\"\\""');
  });
});
