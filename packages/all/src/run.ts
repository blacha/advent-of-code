import { AoC, log, AoCData } from 'aocf';

import arg from 'arg';
import './puzzles';

const a = arg({ '--year': Number, '--day': Number, '--export': Boolean });
const usage = 'Usage: aoc-run --year :year [--day :day] [--export]';
async function main() {
  const year = a['--year'];
  const day = a['--day'];
  if (year == null) return console.log(usage);

  if (day == null) {
    for (const aoc of AoC.registry.values()) {
      if (aoc.year == year) aoc.run();
    }
  } else {
    const aoc = AoC.get(year, day);
    aoc.run();
  }

  if (a['--export']) {
    if (day) throw new Error('Can only export a full year\n\n' + usage);
    log.info('Exporting');
    const data = await AoC.export(year);
    AoCData.save(data);
  }
}

main();
