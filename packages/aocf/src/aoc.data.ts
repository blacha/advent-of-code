// Hack to include "fetch" until typing is fixed
/// <reference lib="dom" />
import { existsSync, promises as fs, readFileSync } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { AoC } from './aoc.js';
import { AoCDataFile, AoCJson } from './export.js';
import { log } from './util/log.js';

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

  puzzle(day: number, user?: string): AoCJson | null {
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

  getDay(year: number, day: number, user: string): AoCJson | null {
    return this.getDb(year).get(day, user);
  }

  loaded = new Set<string>();
  async loadFromFile(year: number, day: number, user: string): Promise<AoCJson | null> {
    const existing = this.getDay(year, day, user);
    if (existing != null) return existing;

    const targetFolder = path.join(this.folder, user, String(year));
    const dayId = String(day).padStart(2, '0');
    const inputFile = path.join(targetFolder, dayId);
    const answerFile = path.join(targetFolder, dayId + '_answer');

    const aocJson: AoCJson = {
      year,
      day,
      user,
      input: '',
    };
    try {
      aocJson.input = (await fs.readFile(inputFile)).toString();
    } catch (e) {
      return null;
    }

    try {
      const [a, b] = (await fs.readFile(answerFile)).toString().split('\n');
      aocJson.a = Number(a);
      if (isNaN(aocJson.a)) aocJson.a = a;
      aocJson.b = Number(b);
      if (isNaN(aocJson.b)) aocJson.b = b;
    } catch (e) {
      // noop
    } finally {
      return aocJson;
    }
  }

  async saveFlatFile(puzzle: AoCJson): Promise<void> {
    const targetFolder = path.join(this.folder, puzzle.user, String(puzzle.year));

    const dayId = String(puzzle.day).padStart(2, '0');
    await fs.mkdir(targetFolder, { recursive: true });

    const targetFile = path.join(targetFolder, `${dayId}`);
    await fs.writeFile(targetFile, puzzle.input);

    if (puzzle.a != null || puzzle.b != null) {
      const puzzleA = path.join(targetFolder, `${dayId}_answer`);
      await fs.writeFile(puzzleA, [puzzle.a ?? '', puzzle.b ?? ''].join('\n'));
    }
  }

  async get(aoc: AoC<unknown>): Promise<AoCJson | null> {
    const existing = this.getDb(aoc.year).puzzle(aoc.day, this.state.user);
    if (existing == null) return this.loadFromFile(aoc.year, aoc.day, this.state.user!);
    return existing;
  }

  init(): void {
    if (this.isInit) return;
    this.isInit = true;
    this.stateFromEnv();
    let currentPath = fileURLToPath(import.meta.url);

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

  async fetch(aoc: AoC<unknown>): Promise<AoCJson> {
    this.init();
    if (!aoc.isUnlocked) throw new Error(`Puzzle ${aoc.id} has not unlocked yet! unlocks in ${timeTo(aoc.unlockDate)}`);

    // Cache hit
    const dataLocal = await this.get(aoc);
    if (dataLocal) return dataLocal;

    const user = this.state.user;
    if (user == null) throw new Error('Failed to find username');

    log.info('FetchingData...', { url: `https://adventofcode.com/${aoc.year}/day/${aoc.day}/input` });

    const headers = { cookie: `session=${this.session}` };
    const fetched = await fetch(`https://adventofcode.com/${aoc.year}/day/${aoc.day}/input`, { headers });
    if (!fetched.ok) throw new Error(`Failed to fetch data for ${aoc.id}: ` + fetched.statusText);
    const text = await fetched.text();

    const db = this.getDb(aoc.year);
    const puzzle: AoCJson = { user, year: aoc.year, day: aoc.day, input: text.trim() };
    db.add(user, puzzle);
    await this.saveFlatFile(puzzle);
    return puzzle;
  }
}

export const AoCData = new AoCDataRegistry();
