import o, { Ospec } from 'ospec';
import { Memoize } from 'typescript-memoize';
import { AoCData } from './aoc.data.js';
import { AoCAnswer, AoCJson } from './export.js';
import { log } from './util/log.js';
import { timer } from './util/timer.js';

function getTick(puzzle: AoCJson, a: AoCAnswer, b: AoCAnswer): { a: string; b: string } {
  const output = { a: '', b: '' };
  if (puzzle.a != null) output.a = puzzle.a == a ? '✔️' : '✘';
  if (puzzle.b != null) output.b = puzzle.b == b ? '✔️' : '✘';
  return output;
}

export class AoC<T = string> {
  static id(year: number, day: number): string {
    return `${year}-12-${day.toString().padStart(2, '0')}`;
  }
  static registry: Map<string, AoC<unknown>> = new Map();
  static get(year: number, day: number): AoC<unknown> {
    const aocId = AoC.id(year, day);
    const aoc = this.registry.get(aocId);
    if (aoc == null) throw new Error(`AoC not found: ${aocId}`);
    return aoc;
  }

  /** Year of the puzzle */
  year: number;
  /** Day of the puzzle */
  day: number;

  constructor(year: number, day: number) {
    this.year = year;
    this.day = day;
    if (day < 0 || day > 30) throw new Error('Day out of range');
    if (year < 2015) throw new Error('Year out of range');
    if (AoC.registry.has(this.id)) throw new Error('Duplicate Year/Date: ' + this.id);
    AoC.registry.set(this.id, this);
  }

  static create<T = string>(year: number, day: number): AoC<T> {
    return new AoC(year, day);
  }

  /** Day prefixed with a 0, 01, 02 etc */
  get dayId(): string {
    return this.day.toString().padStart(2, '0');
  }

  /** Year-Month-Day of the question */
  get id(): string {
    return AoC.id(this.year, this.day);
  }

  /** When this AoC question unlocks */
  get unlockDate(): Date {
    return new Date(`${this.year}-12-${this.dayId}T05:00:00Z`);
  }

  /** is this question active */
  get isUnlocked(): boolean {
    return this.unlockDate.getTime() <= Date.now();
  }

  /** Raw input data directly from AoC website */
  get input(): Promise<string> {
    if (!this.isUnlocked) throw new Error('Unable to get data for puzzle which has not unlocked: ' + this.id);
    return AoCData.fetch(this).then((f) => f.input);
    // if (local == null) throw new Error('No local data found for puzzle: ' + this.id);
    // return local.input;
  }

  data(data: string): T {
    if (this.parse) return this.parse(data);
    return data as any as T;
  }

  parse(data: string): T {
    return data as unknown as T;
  }
  partA(input: T): number | string {
    return -1;
  }
  partB(input: T): number | string {
    return -1;
  }

  test(fn?: (o: Ospec) => void): void {
    o.spec(this.id, () => {
      if (fn) fn(o);
      o('Answer', async () => {
        o.timeout(2000);
        const puzzle = await AoCData.fetch(this);

        const { a, b, duration } = this.answers(puzzle.input);
        const isCorrect = getTick(puzzle, a, b);

        console.log(
          `${this.id}`,
          'a:',
          String(a).padStart(14, ' '),
          isCorrect.a,
          `\t${duration.a} ms`,
          '\tb:',
          String(b).padStart(14, ' '),
          isCorrect.b,
          `\t${duration.b} ms`,
        );
        if (puzzle.a != null) o(a).equals(puzzle.a);
        if (puzzle.b != null) o(b).equals(puzzle.b);
      });
    });
  }

  @Memoize()
  answers(input: string): { a: AoCAnswer; b: AoCAnswer; duration: { a: number; b: number; parse: number } } {
    const data = timer(() => this.data(input));
    const tA = timer(() => this.partA && this.partA(data.v));
    const tB = timer(() => this.partB && this.partB(data.v));
    const duration = { a: tA.duration, b: tB.duration, parse: data.duration };
    return { a: tA.v, b: tB.v, duration };
  }

  async run(input?: string): Promise<{ a: AoCAnswer; b: AoCAnswer; duration: { a: number; b: number } }> {
    await AoCData.init();
    const isReal = input == null;

    input = input ?? (await this.input);
    const { a, b, duration } = this.answers(input);

    const url = `https://adventofcode.com/${this.year}/day/${this.day}`;
    log.info({ aoc: this.id, duration: duration.parse, url }, 'Parse');
    log.info({ aoc: this.id, value: a, duration: duration.a }, 'PartA');
    log.info({ aoc: this.id, value: b, duration: duration.b }, 'PartB');
    if (isReal) {
      const ans = await AoCData.get(this);
      if (ans && ans.a != null && ans.b != null) {
        if (ans.a == a && ans.b == b) log.info({ aoc: this.id, a: ans.a == a, b: ans.b == b }, 'Validated');
        else log.error({ aoc: this.id, a: ans.a == a, b: ans.b == b }, 'Validated:Failed');
      }
    }
    return { a, b, duration };
  }

  fetch(): Promise<{ a: AoCAnswer; b: AoCAnswer; duration: { a: number; b: number } }> {
    return AoCData.fetch(this).then((f) => this.run(f.input));
  }
}
