import { AoC } from '../aoc';
const $Year = 2020;
const $Day = 5;

export class AoC$YearDay$Day extends AoC<string> {
  constructor() {
    super($Year, $Day);
  }
  parse(input: string): string {
    return input;
  }
  partA(input: string): number {
    return -1;
  }
  partB(input: string): number {
    return -1;
  }
}

const aoc = new AoC$YearDay$Day();
aoc.run();
