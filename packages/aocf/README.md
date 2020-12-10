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
// 2020-12-01.Question#1 1371 // Answer to Q1
// 2020-12-01.Question#2 2117 // Answer to Q2
```


Or used as a script format
```typescript
const aoc = AoC.create(2020, 1)
const input = await aoc.input
```


Or as a combination
```typescript
const aoc = AoC.create(2020, 1);

aoc.partA = (d) => {
  let total = 0;
  for (const line of d.split('\n')) total++;
  return total;
};

aoc.run();
```

## Export

All answers and input can be export into a JSON file for sharing

```typescript
import '@blacha/advent-of-code-2020';
const data = await AoC.export(2020);
writeFileSync(`./aoc-${data.user}-${data.year}.json`, JSON.stringify(data, null, 2));
```

Format: 
```typescript 
export interface AoCJsonData {
    /** Github username for where the puzzle data came from */
    user: string;
    /** Advent of code year */ 
    year: number;

    puzzles: {
        /** Raw puzzle input */
        input: string;
        /** Answers for the day */
        answers: { a: string | number, b: string | number}
    }[]
}
```

## Configuration

Session and data storage locations can be configured with a `.aocrc` 

```bash
AOC_SESSION=YourAoCSession
AOC_USER=blacha # github user name
AOC_DATA_PATH=. # Store the .aoc-data folder in the same folder as your .aocrc
```