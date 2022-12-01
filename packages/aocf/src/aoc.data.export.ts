import arg from 'arg';
import { writeFileSync } from 'fs';
import { AoC } from './aoc.js';
import { AoCData } from './aoc.data.js';
import { AoCDataFile } from './export.js';

const Args = arg({ '--user': String, '--year': Number });

async function main(): Promise<void> {
  const user = Args['--user'];
  const year = Args['--year'] as 2105;
  if (user == null) throw new Error('Missing --user');
  if (year == null) throw new Error('Missing --year');
  if (year < 2015 || year > new Date().getUTCFullYear()) throw new Error('Invalid --year');
  AoCData.state.user = user;
  const output: AoCDataFile = [];
  console.log(`Fetching data for year: ${year} user: ${user}`);
  for (let day = 1; day < 26; day++) {
    const aoc = AoC.create<string>(year, day);
    if (!aoc.isUnlocked) break;
    const input = await AoCData.fetch(aoc);
    output.push({ year, day, user, input: input.input });
  }
  const json = JSON.stringify(output, null, 2);
  console.log('Writing ', output.length, ' questions into file');
  writeFileSync(`./aoc-data.${year}.${user}.json`, json);
}

main().catch((c) => console.log(c));
