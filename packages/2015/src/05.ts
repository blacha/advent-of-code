import { AoC } from 'aocf';

const Vowels = new Set('aeiou');

export class AoC2015Day5 extends AoC<string[]> {
  constructor() {
    super(2015, 5);
  }

  parse(input: string): string[] {
    return input.trim().split('\n');
  }

  isNice(s: string): boolean {
    let vowels = 0;
    let dupes = 0;
    let lastChar = null;
    for (const ch of s) {
      if (Vowels.has(ch)) vowels++;
      if (lastChar == ch) dupes++;
      lastChar = ch;
    }
    if (s.includes('ab') || s.includes('cd') || s.includes('pq') || s.includes('xy')) return false;

    return vowels >= 3 && dupes > 0;
  }

  isExtraNice(s: string): boolean {
    let gapDupe = false;
    let doublePair = false;
    const pairTypes = new Map<string, number>();
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];

      if (ch == s[i + 2]) gapDupe = true;
      if (i < s.length - 1) {
        const nxChar = s[i + 1];
        const pairChar = ch + nxChar;
        if (pairTypes.has(pairChar)) {
          const firstOffset = pairTypes.get(pairChar)!;
          doublePair = i - firstOffset > 1;
        } else {
          pairTypes.set(pairChar, i);
        }
      }
    }
    if (gapDupe == false) return false;

    return gapDupe && doublePair;
  }

  partA(input: string[]): number {
    return input.filter((f) => this.isNice(f)).length;
  }

  partB(input: string[]): number {
    return input.filter((f) => this.isExtraNice(f)).length;
  }
}

export const aoc2015day5 = new AoC2015Day5();
aoc2015day5.test((o) => {
  o('should test', () => {
    o(aoc2015day5.isNice('ugknbfddgicrmopn')).equals(true);
    o(aoc2015day5.isNice('aaa')).equals(true);
    o(aoc2015day5.isNice('jchzalrnumimnmhp')).equals(false);
    o(aoc2015day5.isNice('haegwjzuvuyypxyu')).equals(false);
    o(aoc2015day5.isNice('dvszwmarrgswjxmb')).equals(false);

    o(aoc2015day5.isExtraNice('qjhvhtzxzqqjkmpb')).equals(true);
    o(aoc2015day5.isExtraNice('xxyxx')).equals(true);
    o(aoc2015day5.isExtraNice('xxx')).equals(false);
    o(aoc2015day5.isExtraNice('uurcxstgmygtbstg')).equals(false);
    o(aoc2015day5.isExtraNice('ieodomkazucvgmuy')).equals(false);
  });
});
