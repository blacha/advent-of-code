import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import fetch from 'node-fetch';
import * as path from 'path';
import { AoC } from './aoc';
import { AoCDataFile, AoCJson } from './export';
import { log } from './util/log';

const EnvVars = {
  user: 'AOC_USER',
  session: 'AOC_SESSION',
  data: 'AOC_DATA_PATH',
};

export type AocRc = Partial<Record<keyof typeof EnvVars, string>>;
const EnvRcFileName = `.aocrc`;
const BasePath = '.aoc-data';

export class AoCDataYear {
  year: number;
  puzzles: Map<number, AoCJson[]> = new Map();

  constructor(year: number) {
    this.year = year;
  }

  add(user: string, puzzle: AoCJson): void {
    log.trace({ year: puzzle.year, user: puzzle.user, day: puzzle.day }, 'PuzzleLoad');

    if (puzzle.user == null || puzzle.user != user)
      throw new Error('Failed parsing input invalid user: ' + puzzle.user);
    if (this.get(puzzle.day, user) != null)
      throw new Error(`Duplicate puzzle found: ${puzzle.user} ${puzzle.year}-${puzzle.day}`);

    const p = this.puzzles.get(puzzle.day) ?? [];
    p.push(puzzle);
    this.puzzles.set(puzzle.day, p);
  }

  userData(user: string): AoCDataFile {
    const output = [];
    for (const pzs of this.puzzles.values()) {
      for (const p of pzs) {
        if (p.user == user) output.push(p);
      }
    }
    return output.sort((a, b) => a.day - b.day);
  }

  get(day: number, user?: string): AoCJson | null {
    const data = this.puzzles.get(day);
    if (data == null) return null;

    let puzzleData;
    if (user == null) puzzleData = data[0];
    else puzzleData = data.find((f) => f.user == user);
    if (puzzleData == null) return null;
    return puzzleData;
  }

  puzzle(day: number, user?: string): AoCJson | null{
    const p = this.get(day, user);
    if (p == null) return null;
    return p;
  }
}

function timeTo(date: Date): string {
  const timeDiff = date.getTime() - Date.now();
  const seconds = timeDiff / 1000;
  if (seconds < 60) return Math.round(seconds) + ' seconds';
  const minutes = seconds / 60;
  if (minutes < 60) return Math.round(minutes) + ' minutes';
  return Math.round(minutes / 60) + ' hours';
}

export class AoCDataRegistry {
  state: AocRc = {};
  isInit = false;

  cache: Map<number, AoCDataYear> = new Map();

  getDb(year: number): AoCDataYear {
    let db = this.cache.get(year);
    if (db != null) return db;

    db = new AoCDataYear(year);
    this.cache.set(year, db);
    return db;
  }

  loaded = new Set<string>();
  loadFromFile(year: number, user: string, force = false): void {
    const filePath = this.path(year, user);
    if (this.loaded.has(filePath) && force == false) return;
    this.loaded.add(filePath);
    log.debug({ path: filePath }, 'DataLoad');
    if (!existsSync(filePath)) {
      log.warn({ path: filePath }, 'DataMissing');
      return;
    }

    const fileData = JSON.parse(readFileSync(filePath).toString()) as AoCDataFile;
    if (!Array.isArray(fileData)) throw new Error(`Failed to read ${filePath}, data invalid`);

    for (const p of fileData) {
      this.getDb(p.year).add(p.user, p);
    }
  }

  get(aoc: AoC<any>): AoCJson | null {
    if (this.state.user) this.loadFromFile(aoc.year, this.state.user);
    return this.getDb(aoc.year).puzzle(aoc.day, this.state.user);
  }

  init(): void {
    if (this.isInit) return;
    this.isInit = true;
    this.stateFromEnv();
    let currentPath = __dirname;

    while (path.join(currentPath, '..') != currentPath) {
      this.stateFromRcFile(path.join(currentPath, EnvRcFileName));
      currentPath = path.join(currentPath, '..');
    }
  }

  private stateFromEnv(): void {
    this.state.user = this.state.user ?? process.env[EnvVars.user];
    this.state.session = this.state.session ?? process.env[EnvVars.session];
    this.state.data = this.state.data ?? process.env[EnvVars.data];
  }

  private stateFromRcFile(rcPath: string): void {
    if (existsSync(rcPath)) {
      const data = readFileSync(rcPath);
      for (const line of data.toString().trim().split('\n')) {
        if (!line.includes('=')) continue;
        let value = line.split('=')[1].trim();
        if (line.startsWith(EnvVars.user)) this.state.user = this.state.user ?? value;
        if (line.startsWith(EnvVars.session)) this.state.session = this.state.session ?? value;
        if (line.startsWith(EnvVars.data)) {
          if (value.startsWith('.')) value = path.join(path.dirname(rcPath), value);
          this.state.data = this.state.data ?? value;
        }
      }
    }
  }

  get user(): string {
    if (this.state.user) return this.state.user;
    throw new Error(`Unable to fetch data cannot find AoC username`);
  }
  get session(): string {
    if (this.state.session) return this.state.session;
    throw new Error(`Unable to fetch data cannot find AoC session`);
  }

  private get folder(): string {
    if (this.state.data) return path.join(this.state.data, BasePath);
    return BasePath;
  }

  private path(year: number, user: string): string {
    return path.join(this.folder, `${year}.${user}.json`);
  }

  save(data: AoCDataFile): void {
    if (data.length == 0) throw new Error('No Data to save');
    const first = data[0];
    mkdirSync(this.folder, { recursive: true });
    writeFileSync(this.path(first.year, first.user), JSON.stringify(data, null, 2));
  }

  async fetch(aoc: AoC<any>): Promise<AoCJson> {
    this.init();
    if (!aoc.isUnlocked) throw new Error(`Puzzle ${aoc.id} has not unlocked yet! unlocks in ${timeTo(aoc.unlockDate)}`);

    // Cache hit
    const dataLocal = this.get(aoc);
    if (dataLocal) return dataLocal;

    const user = this.state.user;
    if (user == null) throw new Error('Failed to find username');

    log.info('FetchingData...', { url: `https://adventofcode.com/${aoc.year}/day/${aoc.day}/input` });

    const headers = { cookie: `session=${this.session}` };
    const fetched = await fetch(`https://adventofcode.com/${aoc.year}/day/${aoc.day}/input`, { headers });
    if (!fetched.ok) throw new Error(`Failed to fetch data for ${aoc.id}: ` + fetched.statusText);
    const text = await fetched.text();

    const db = this.getDb(aoc.year);
    const puzzle = {
      user,
      year: aoc.year,
      day: aoc.day,
      input: text.trim(),
      answers: null,
    };
    db.add(user, puzzle);

    const allData = db.userData(user);
    this.save(allData);

    return puzzle;
  }
}

export const AoCData = new AoCDataRegistry();
