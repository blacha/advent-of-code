import { existsSync, promises as fs } from 'fs';
import { AoC } from './aoc';
import fetch from 'node-fetch';
import * as os from 'os';
import * as path from 'path';

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

  private isInit = false;
  cache: Map<string, Promise<string>> = new Map();

  async init(): Promise<void> {
    if (this.isInit) return;
    this.isInit = true;
    this.stateFromEnv();
    let currentPath = __dirname;

    while (path.join(currentPath, '..') != currentPath) {
      await this.stateFromRcFile(path.join(currentPath, EnvRcFileName));
      currentPath = path.join(currentPath, '..');
    }
  }

  private stateFromEnv(): void {
    this.state.user = this.state.user ?? process.env[EnvVars.user];
    this.state.session = this.state.session ?? process.env[EnvVars.session];
    this.state.data = this.state.data ?? process.env[EnvVars.data];
  }

  private async stateFromRcFile(rcPath: string): Promise<void> {
    if (existsSync(rcPath)) {
      const data = await fs.readFile(rcPath);
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

  folder(aoc: AoC): string {
    let basePath = BasePath;
    if (this.state.data) basePath = path.join(this.state.data, BasePath);
    return path.join(basePath, this.user, String(aoc.year));
  }

  path(aoc: AoC): string {
    return path.join(this.folder(aoc), aoc.dayId);
  }

  data(aoc: AoC<any>): Promise<string> {
    if (!aoc.isUnlocked) throw new Error(`Puzzle ${aoc.id} has not unlocked yet`);

    const aocId = aoc.id;
    let cachedData = this.cache.get(aocId);
    if (cachedData == null) cachedData = this.fetchData(aoc);
    this.cache.set(aocId, cachedData);
    return cachedData;
  }

  async fetchData(aoc: AoC<any>): Promise<string> {
    await this.init();
    const dataPath = this.path(aoc);
    if (existsSync(dataPath)) return await fs.readFile(dataPath).then((f) => f.toString());

    console.log('FetchingData...', `https://adventofcode.com/${aoc.year}/day/${aoc.day}/input`);

    const headers = { cookie: `session=${this.session}` };
    const fetched = await fetch(`https://adventofcode.com/${aoc.year}/day/${aoc.day}/input`, { headers });
    if (!fetched.ok) throw new Error(`Failed to fetch data for ${aoc.id}: ` + fetched.statusText);
    const text = await fetched.text();
    await fs.mkdir(this.folder(aoc), { recursive: true });
    await fs.writeFile(dataPath, text.trim());
    return text.trim();
  }
}

export const AoCData = new AoCDataRegistry();
