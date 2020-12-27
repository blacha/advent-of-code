import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import fetch from 'node-fetch';
import * as path from 'path';
import { AoC } from './aoc';

const EnvVars = {
  user: 'AOC_USER',
  session: 'AOC_SESSION',
  data: 'AOC_DATA_PATH',
};

export type AocRc = Partial<Record<keyof typeof EnvVars, string>>;
const EnvRcFileName = `.aocrc`;
const BasePath = '.aoc-data';

export class AoCDataRegistry {
  state: AocRc = {};
  isInit = false;
  cache: Map<string, string> = new Map();

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

  private folder(aoc: AoC): string {
    let basePath = BasePath;
    if (this.state.data) basePath = path.join(this.state.data, BasePath);
    return path.join(basePath, this.user, String(aoc.year));
  }

  private path(aoc: AoC): string {
    return path.join(this.folder(aoc), aoc.dayId);
  }

  dataLocal(aoc: AoC<any>): string | undefined {
    const aocId = aoc.id;

    let cachedData = this.cache.get(aocId);
    if (cachedData != null) return cachedData;

    const dataPath = this.path(aoc);
    if (existsSync(dataPath)) {
      cachedData = readFileSync(dataPath).toString();
      this.cache.set(aocId, cachedData);
      return cachedData;
    }

    return undefined;
  }

  async fetch(aoc: AoC<any>): Promise<string> {
    this.init();
    if (!aoc.isUnlocked) throw new Error(`Puzzle ${aoc.id} has not unlocked yet`);

    // Cache hit
    const dataLocal = this.dataLocal(aoc);
    if (dataLocal) return dataLocal;

    console.log('FetchingData...', `https://adventofcode.com/${aoc.year}/day/${aoc.day}/input`);

    const headers = { cookie: `session=${this.session}` };
    const fetched = await fetch(`https://adventofcode.com/${aoc.year}/day/${aoc.day}/input`, { headers });
    if (!fetched.ok) throw new Error(`Failed to fetch data for ${aoc.id}: ` + fetched.statusText);
    const text = await fetched.text();

    const dataPath = this.path(aoc);

    mkdirSync(this.folder(aoc), { recursive: true });
    writeFileSync(dataPath, text.trim());
    this.cache.set(aoc.id, text.trim());
    return text.trim();
  }
}

export const AoCData = new AoCDataRegistry();
