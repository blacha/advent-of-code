import { existsSync, promises as fs } from 'fs';
import { AoC } from './aoc';
import fetch from 'node-fetch';

const EnvVar = `AOC_SESSION`;
const EnvRc = `./.aocrc`;

export class AoCDataRegistry {
  user = 'blacha';

  cache: Map<string, string> = new Map();

  async session(): Promise<string> {
    if (process.env[EnvVar]) return process.env[EnvVar] as string;
    if (existsSync(EnvRc)) {
      const data = await fs.readFile(EnvRc);
      const [sessionLine] = data
        .toString()
        .split('\n')
        .filter((f) => f.startsWith(EnvVar));
      if (sessionLine != null) return sessionLine.split('=')[1].trim();
    }

    throw new Error(`Unable to fetch data cannot find AoC session`);
  }

  folder(aoc: AoC): string {
    return `./data/${this.user}/${aoc.year}`;
  }

  path(aoc: AoC, suffix?: string): string {
    return `${this.folder(aoc)}/${aoc.dayId}${suffix ? `.${suffix}` : ''}`;
  }

  async data(aoc: AoC<any>, suffix?: string): Promise<string> {
    if (!aoc.isUnlocked) throw new Error(`Puzzle ${aoc.id} has not unlocked yet`);

    const aocId = aoc.id + (suffix ?? '');
    const cachedData = this.cache.get(aocId);
    if (cachedData) return cachedData;

    const dataPath = this.path(aoc, suffix);
    if (existsSync(dataPath)) {
      const data = await fs.readFile(dataPath).then((f) => f.toString());
      this.cache.set(aocId, data);
      return data;
    }

    if (suffix != null) throw new Error(`No data found for ${aoc.id} suffix:${suffix} @ ${dataPath}`);
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
    this.cache.set(aocId, text.trim());
    return text;
  }
}

export const AoCData = new AoCDataRegistry();
