# Advent of Code Framework (aocf)

Framework for working with Advent of Code in typescript

## Usage

Can be used to structure puzzles as classes
```typescript
import {AoC} from 'aocf'

export class AoC2020Day1 extends AoC {
    partA(input: string):number {
        return 95;
    }

    partB(input: string): number {
        return 105;
    }
}

// Download data using a $AOC_SESSION and run against your input
new AoC2020Day1.run()
// 2020-12-01: 0.934ms - Duration that the solution run in
// 2020-12-01.Question#1 95 // Answer to Q1
// 2020-12-01.Question#2 105 // Answer to Q2
```


Or used as a script format
```typescript
import {AoC} from 'aocf'

const aoc = AoC.create(2020, 1)
const input = await aoc.input
```


Or as a combination
```typescript
import {AoC} from 'aocf'

const aoc = AoC.create(2020, 1);

aoc.partA = (d) => {
  let total = 0;
  for (const line of d.split('\n')) total++;
  return total;
};

aoc.run();
```

## Configuration

Session and data storage locations can be configured with a `.aocrc`  or environment variables

```bash
AOC_SESSION=YourAoCSession
AOC_USER=blacha # github user name
AOC_DATA_PATH=. # Store the .aoc-data folder in the same folder as your .aocrc
```

```bash
export AOC_SESSION=YourAoCSession
```

