import arg from 'arg';
import { writeFileSync } from 'fs';
import { Answers } from './answers';
import { AoC } from './aoc';
import { AoCData } from './aoc.data';

const Args = arg({ '--user': String, '--year': Number });

export interface AoCJsonAnswers {
  /** AoC Event year 2015 - 2020 */
  year: number;
  /** AoC Event day 1 -> 30 */
  day: number;
  /** github username for where the answers came from */
  user: string;
  /** Advent of code data input */
  input: string;
  /** Optional answers */
  answers: { a: string | number; b: string | number } | null;
}

async function main() {
  const user = Args['--user'];
  const year = Args['--year'] as 2105;
  if (user == null) throw new Error('Missing --user');
  if (year == null) throw new Error('Missing --year');
  if (year < 2015 || year > new Date().getUTCFullYear()) throw new Error('Invalid --year');

  AoCData.state.user = user;

  const output: AoCJsonAnswers[] = [];
  console.log(`Fetching data for year: ${year} user: ${user}`);

  for (let day = 1; day < 30; day++) {
    const aoc = AoC.create<string>(year, day);
    if (!aoc.isUnlocked) break;
    const input = await aoc.input;

    const answers = Answers.get(user, aoc.year, aoc.day);
    output[day] = { year, day, user, input, answers };
  }

  const json = JSON.stringify(output, null, 2);
  console.log('Writing ', output.length, ' questions into file');
  writeFileSync(`./aoc-data.${year}.${user}.json`, json);
}

main().catch((c) => console.log(c));
