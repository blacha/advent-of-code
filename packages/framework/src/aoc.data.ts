import { existsSync, promises as fs } from 'fs';
import { AoC } from './aoc';
import fetch from 'node-fetch';
import * as os from 'os';
import * as path from 'path';

const EnvVar = `AOC_SESSION`;
const EnvRc = `.aocrc`;
const BasePath = '.aoc-data';

export class AoCDataRegistry {
  user = 'blacha';

  cache: Map<string, Promise<string>> = new Map();

  async readRcFile(rcPath: string): Promise<string | null> {
    if (existsSync(rcPath)) {
      const data = await fs.readFile(rcPath);
      const [sessionLine] = data
        .toString()
        .split('\n')
        .filter((f) => f.startsWith(EnvVar));
      if (sessionLine != null) return sessionLine.split('=')[1].trim();
    }
    return null;
  }

  async session(): Promise<string> {
    if (process.env[EnvVar]) return process.env[EnvVar] as string;

    let currentPath = __dirname;
    while (path.join(currentPath, '..') != '/') {
      const data = await this.readRcFile(path.join(currentPath, EnvRc));
      if (data != null) return data;

      currentPath = path.join(currentPath, '..');
    }

    throw new Error(`Unable to fetch data cannot find AoC session`);
  }

  folder(aoc: AoC): string {
    return path.join(BasePath, this.user, String(aoc.year));
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
    const dataPath = this.path(aoc);
    if (existsSync(dataPath)) {
      return await fs.readFile(dataPath).then((f) => f.toString());
    }

    console.log('FetchingData...', `https://adventofcode.com/${aoc.year}/day/${aoc.day}/input`);

    const session = await this.session();
    const fetched = await fetch(`https://adventofcode.com/${aoc.year}/day/${aoc.day}/input`, {
      headers: {
        cookie: `session=${session}`,
      },
    });
    if (!fetched.ok) throw new Error(`Failed to fetch data for ${aoc.id}: ` + fetched.statusText);
    const text = await fetched.text();
    await fs.mkdir(this.folder(aoc), { recursive: true });
    await fs.writeFile(dataPath, text.trim());
    return text.trim();
  }
}

export const AoCData = new AoCDataRegistry();
