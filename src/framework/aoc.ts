import 'source-map-support/register';
import * as fs from 'fs';
import o, { Ospec } from 'ospec';
import { Answers } from './answers';

export abstract class AoC<T = string> {
  static registry: Map<string, AoC> = new Map();
  static get(year: number, day: number): AoC {
    const aocId = `${year}:${day}`;
    const aoc = this.registry.get(aocId);
    if (aoc == null) throw new Error(`AoC not found: ${aocId}`);
    return aoc;
  }

  user = 'blacha';
  year: number;
  day: number;

  constructor(year: number, day: number) {
    this.year = year;
    this.day = day;
    if (day < 0 || day > 30) throw new Error('Day out of range');
    if (year < 2015) throw new Error('Year out of range');
    if (AoC.registry.has(this.id)) throw new Error('Duplicate Year/Date: ' + this.id);
  }

  get dayId(): string {
    return this.day.toString().padStart(2, '0');
  }

  get id(): string {
    return this.year + ':' + this.dayId;
  }

  get dataRaw(): Promise<string> {
    const filePath = `./data/${this.user}/${this.year}/${this.dayId}`;
    if (fs.existsSync(filePath)) {
      return fs.promises.readFile(filePath).then((f) => f.toString());
    }
    return fs.promises.readFile(filePath + '.txt').then((f) => f.toString());
  }

  get dataTestRaw(): Promise<string> {
    return fs.promises.readFile(`./data/${this.user}/${this.year}/${this.dayId}.test`).then((f) => f.toString());
  }

  get dataTest(): Promise<T> {
    return this.dataTestRaw.then((data): Promise<T> | T => {
      if (this.parse) return this.parse(data);
      return (data as any) as T;
    });
  }

  get data(): Promise<T> {
    return this.dataRaw.then((data): Promise<T> | T => {
      if (this.parse) return this.parse(data);
      return (data as any) as T;
    });
  }

  parse?(data: string): Promise<T> | T;
  abstract partA(input: T): Promise<number> | number;
  abstract partB(input: T): Promise<number> | number;

  async solutionA(): Promise<number> {
    const data = await this.data;
    return this.partA(data);
  }

  async solutionB(): Promise<number> {
    const data = await this.data;
    return this.partB(data);
  }

  test(fn?: (o: Ospec) => void, run = false): void {
    o.spec(this.id, () => {
      if (fn) fn(o);
      o('Answer', async () => {
        const ans = Answers.get(this.user, this.year, this.day);
        console.log('');
        console.time(`${this.id}`);
        const ansA = await this.solutionA();
        const ansB = await this.solutionB();
        console.log(`${this.id}.Question#1`, ansA);
        console.log(`${this.id}.Question#2`, ansB);
        if (ans) {
          o(ansA).equals(ans.a);
          o(ansB).equals(ans.b);
        }
        console.timeEnd(`${this.id}`);
      });
    });
    if (run) o.run();
  }

  async run() {
    const ansA = await this.solutionA();
    const ansB = await this.solutionB();
    console.log(`${this.id}.Question#1`, ansA);
    console.log(`${this.id}.Question#2`, ansB);
  }
}
