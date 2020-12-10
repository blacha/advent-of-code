import o, { Ospec } from 'ospec';
import 'source-map-support/register';
import { Answers } from './answers';
import { AoCData } from './aoc.data';

export interface AoCJsonData {
  /** Github username for where the puzzle data came from */
  user: string;
  /** Advent of code year */
  year: number;

  puzzles: {
    /** Raw puzzle input */
    input: string;
    /** Answers for the day */
    answers: { a: string | number; b: string | number };
  }[];
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

  static async export(year: number): Promise<AoCJsonData> {
    const data: AoCJsonData = {
      user: AoCData.user,
      year,
      puzzles: [],
    };
    for (let day = 1; day < 31; day++) {
      const aoc = AoC.get(year, day);
      if (aoc == null) continue;

      const input = await aoc.input;
      const answers = await aoc.answers();
      data.puzzles[day] = { input, answers };
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
    return new Date(`${this.id}T05:00:00Z`);
  }

  /** is this question active */
  get isUnlocked(): boolean {
    return this.unlockDate.getTime() <= Date.now();
  }

  /** Raw input data directly from AoC website */
  get input(): Promise<string> {
    if (!this.isUnlocked) throw new Error('Unable to get data for puzzle which has not unlocked ');
    return AoCData.data(this);
  }

  async data(source: Promise<string> | string = this.input): Promise<T> {
    const data = await source;
    if (this.parse) return this.parse(data);
    return (data as any) as T;
  }

  parse?(data: string): Promise<T> | T;
  partA?(input: T): Promise<number | string> | number | string;
  partB?(input: T): Promise<number | string> | number | string;

  test(fn?: (o: Ospec) => void, run = false): void {
    o.spec(this.id, () => {
      if (fn) fn(o);
      o('Answer', async () => {
        o.timeout(2000);

        console.log('');
        const aocId = this.id;
        console.time(aocId);
        const { a, b } = await this.answers();
        console.timeEnd(aocId);

        console.log(`${this.id}.Question#1`, a);
        console.log(`${this.id}.Question#2`, b);
        const ans = Answers.get(AoCData.user, this.year, this.day);
        if (ans) {
          o(a).equals(ans.a);
          o(b).equals(ans.b);
        } else {
          console.log('No known answers for ', this.id);
        }
      });
    });
    if (run) o.run();
  }

  async answers(input: Promise<T> | T = this.data()): Promise<{ a: number | string; b: number | string }> {
    const data = await input;
    if (this.partA == null) throw new Error('No answer A defined');
    const a = await this.partA(data);
    if (this.partB == null) throw new Error('No answer B defined');
    const b = await this.partB(data);
    return { a, b };
  }

  async run(input: Promise<string> | string = this.input): Promise<void> {
    const { a, b } = await this.answers(this.parse ? this.parse(await input) : (input as any));
    console.log(`${this.id}.Question#1`, a);
    console.log(`${this.id}.Question#2`, b);
  }
}
