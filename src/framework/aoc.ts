import o, { Ospec } from 'ospec';
import 'source-map-support/register';
import { Answers } from './answers';
import { AoCData } from './aoc.data';

export abstract class AoC<T = string> {
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

  /**  */
  get dataRaw(): Promise<string> {
    if (!this.isUnlocked) throw new Error('Unable to get data for puzzle which has not unlocked ');
    return AoCData.data(this);
  }

  get dataTestRaw(): Promise<string> {
    return AoCData.data(this, 'test');
  }

  get dataTest(): Promise<T> | T {
    return this.dataTestRaw.then((data): Promise<T> | T => {
      if (this.parse) return this.parse(data);
      return (data as any) as T;
    });
  }

  get data(): Promise<T> | T {
    return this.dataRaw.then((data): Promise<T> | T => {
      if (this.parse) return this.parse(data);
      return (data as any) as T;
    });
  }

  parse?(data: string): Promise<T> | T;
  abstract partA(input: T): Promise<number> | number;
  abstract partB(input: T): Promise<number> | number;

  test(fn?: (o: Ospec) => void, run = false): void {
    o.spec(this.id, () => {
      if (fn) fn(o);
      o('Answer', async () => {
        o.timeout(2000);

        const ans = Answers.get(AoCData.user, this.year, this.day);
        console.log('');
        const aocId = this.id;
        console.time(aocId);
        const { a, b } = await this.answers();
        console.timeEnd(aocId);

        console.log(`${this.id}.Question#1`, a);
        console.log(`${this.id}.Question#2`, b);
        if (ans) {
          o(a).equals(ans.a);
          o(b).equals(ans.b);
        }
      });
    });
    if (run) o.run();
  }

  async answers(): Promise<{ a: number; b: number | string }> {
    const data = await this.data;
    const a = await this.partA(data);
    const b = await this.partB(data);
    return { a, b };
  }

  async run(): Promise<void> {
    const { a, b } = await this.answers();
    console.log(`${this.id}.Question#1`, a);
    console.log(`${this.id}.Question#2`, b);
  }
}
