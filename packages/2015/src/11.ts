import { AoC } from 'aocf';

const alpha = 'abcdefghijklmnopqrstuvwxyz';
const base26 = '0123456789abcdefghijklmnop';
const toB26 = new Map<string, string>();
const fromB26 = new Map<string, string>();

for (let i = 0; i < alpha.length; i++) {
  toB26.set(alpha[i], base26[i]);
  fromB26.set(base26[i], alpha[i]);
}

function toNumber(str: string): number {
  const base = [];
  for (const ch of str) base.push(toB26.get(ch));
  return parseInt(base.join(''), 26);
}

function fromNumber(num: number): string {
  const alpha = [];
  const data = num.toString(26);
  for (const ch of data) alpha.push(fromB26.get(ch));
  return alpha.join('');
}

export class AoC2015Day11 extends AoC {
  constructor() {
    super(2015, 11);
  }

  isValidPassword(str: string): boolean {
    const pairs = new Set<string>();
    let inc = false;
    for (let i = 0; i < str.length; i++) {
      const chr = str[i];
      if (chr == 'i' || chr == 'o' || chr == 'l') return false;
      if (chr == str[i + 1]) pairs.add(chr);
      const charCode = str.charCodeAt(i);
      if (str[i + 1] == String.fromCharCode(charCode + 1) && str[i + 2] == String.fromCharCode(charCode + 2)) {
        inc = true;
      }
    }
    return pairs.size > 1 && inc;
  }

  findNextPassword(str: string): string {
    if (this.ans.get(str)) return this.ans.get(str)!;

    let current = toNumber(str);
    let count = 0;
    while (!this.isValidPassword(fromNumber(current))) {
      count++;
      current = current + 1;
      if (count > 1e6) throw new Error('Failed to find');
    }
    const output = fromNumber(current);
    this.ans.set(str, output);
    return output;
  }

  ans = new Map<string, string>();
  partA(input: string): string {
    return this.findNextPassword(input);
  }

  partB(input: string): string {
    const firstNumber = this.partA(input);
    const nextNumber = fromNumber(toNumber(firstNumber) + 1);
    return this.findNextPassword(nextNumber);
  }
}

export const aoc2015day11 = new AoC2015Day11();

aoc2015day11.test();
