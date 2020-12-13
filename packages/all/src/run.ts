import { AoC, log } from 'aocf';
import arg from 'arg';
import './puzzles';

const a = arg({ '--year': Number, '--day': Number });

async function main() {
  const year = a['--year'];
  const day = a['--day'];
  if (year == null) return console.log('Usage: aoc-run --year :year [--day :day]');

  if (day == null) {
    for (const aoc of AoC.registry.values()) {
      if (aoc.year == year) await aoc.run();
    }
  } else {
    const aoc = AoC.get(year, day);
    await aoc.run();
  }
}

main();
