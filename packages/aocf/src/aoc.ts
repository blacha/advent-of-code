import o, { Ospec } from 'ospec';
import 'source-map-support/register';
import { AoCData } from './aoc.data';
import { AoCAnswer, AoCDataFile } from './export';
import { log } from './util/log';
import { timer } from './util/timer';

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

  static async export(year: number): Promise<AoCDataFile> {
    const data: AoCDataFile = [];
    for (let day = 1; day < 26; day++) {
      if (!AoC.registry.has(AoC.id(year, day))) continue;
      const aoc = AoC.get(year, day);
      if (aoc == null) continue;

      const puzzle = await AoCData.fetch(aoc);
      const answers = aoc.answers(puzzle.input) as any;
      delete answers.duration;
      data.push({ year, day, user: AoCData.user, input: puzzle.input, answers });
    }
    return data;
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
  get input(): string {
    if (!this.isUnlocked) throw new Error('Unable to get data for puzzle which has not unlocked: ' + this.id);
    const local = AoCData.get(this);
    if (local == null) throw new Error('No local data found for puzzle: ' + this.id);
    return local.input;
  }

  data(data: string): T {
    if (this.parse) return this.parse(data);
    return data as any as T;
  }

  parse?(data: string): T;
  partA?(input: T): number | string;
  partB?(input: T): number | string;

  test(fn?: (o: Ospec) => void): void {
    o.spec(this.id, () => {
      if (fn) fn(o);
      o('Answer', async () => {
        o.timeout(2000);
        const puzzle = await AoCData.fetch(this);

        console.log('');
        const { a, b, duration } = this.answers(puzzle.input);

        console.log(`${this.id}.Question#1`, a, `${duration.a} ms`);
        console.log(`${this.id}.Question#2`, b, `${duration.b} ms`);
        if (puzzle.answers) {
          o(a).equals(puzzle.answers.a);
          o(b).equals(puzzle.answers.b);
        } else {
          console.log('No known answers for ', this.id);
        }
      });
    });
  }

  answers(input: string): { a: AoCAnswer; b: AoCAnswer; duration: { a: number; b: number } } {
    const data = this.data(input);
    const tA = timer(() => this.partA && this.partA(data));
    const tB = timer(() => this.partB && this.partB(data));
    const duration = { a: tA.duration, b: tB.duration };
    return { a: tA.v, b: tB.v, duration };
  }

  run(input?: string): { a: AoCAnswer; b: AoCAnswer; duration: { a: number; b: number } } {
    AoCData.init();
    const isReal = input == null;

    input = input ?? this.input;
    const { a, b, duration } = this.answers(input);

    log.info({ aoc: this.id, value: a, duration: duration.a }, 'PartA');
    log.info({ aoc: this.id, value: b, duration: duration.b }, 'PartB');
    if (isReal) {
      const ans = AoCData.get(this)?.answers;
      if (ans) {
        if (ans.a == a && ans.b == b) log.info({ aoc: this.id, a: ans.a == a, b: ans.b == b }, 'Validated');
        else log.error({ aoc: this.id, a: ans.a == a, b: ans.b == b }, 'Validated:Failed');
      }
    }
    return { a, b, duration };
  }
}
