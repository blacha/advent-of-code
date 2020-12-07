import { AoC, toNumberArray } from 'aocf';

const dupes = ['00', '11', '22', '33', '44', '55', '66', '77', '88', '99'];

export class AoC2019Day4 extends AoC<string> {
  constructor() {
    super(2019, 4);
  }
  checkInput(str: string): boolean {
    let firstChar = str.charCodeAt(0);
    let dupeFound = false;
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      if (charCode < firstChar) return false;
      if (str[i] == str[i + 1]) dupeFound = true;

      firstChar = charCode;
    }
    return dupeFound;
  }

  hasDoubleDupe(str: string): boolean {
    for (const dupe of dupes) {
      const dupeIndex = str.indexOf(dupe);
      if (dupeIndex == -1) continue;
      if (str.indexOf(dupe + dupe[0]) == dupeIndex) continue;
      if (str.indexOf(dupe + dupe) == dupeIndex) continue;
      if (str.indexOf(dupe + dupe + dupe[0]) == dupeIndex) continue;
      return true;
    }
    return false;
  }

  partA(input: string): number {
    const [low, high] = toNumberArray(input, '-');
    let count = 0;
    for (let i = low; i <= high; i++) {
      if (this.checkInput(i.toString())) count++;
    }

    return count;
  }
  partB(input: string): number {
    const [low, high] = toNumberArray(input, '-');
    let count = 0;
    for (let i = low; i <= high; i++) {
      const iStr = i.toString();
      if (this.checkInput(iStr) && this.hasDoubleDupe(iStr)) count++;
    }
    return count;
  }
}

const aoc2019day4 = new AoC2019Day4();

aoc2019day4.test((o) => {
  o('check dupes', () => {
    o(aoc2019day4.checkInput('111111')).equals(true);
    o(aoc2019day4.checkInput('223450')).equals(false);
    o(aoc2019day4.checkInput('123789')).equals(false);
  });
});
