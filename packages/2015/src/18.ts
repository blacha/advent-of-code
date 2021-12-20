import { AoC, Grid } from 'aocf';

export type Input = boolean[][];

const aoc = AoC.create<Input>(2015, 18);

aoc.parse = (l: string): Input => {
  return l.split('\n').map((c) => c.split('').map((c) => c === '#'));
};

function step(g: Input): Input {
  const output: boolean[][] = [];
  for (let y = 0; y < g.length; y++) {
    const input = g[y];
    const line = [];
    for (let x = 0; x < input.length; x++) {
      let count = 0;

      for (const pt of Grid.Around) {
        const nY = pt.y + y;
        if (nY < 0 || nY >= g.length) continue;
        const nX = pt.x + x;

        if (nX < 0 || nX >= g[nY].length) continue;
        if (g[nY][nX]) count++;
      }

      if (input[x]) {
        line[x] = count == 2 || count == 3;
      } else {
        line[x] = count === 3;
      }
    }
    output.push(line);
  }
  return output;
}

aoc.partA = (input: Input): number => {
  for (let i = 0; i < 100; i++) input = step(input);

  let count = 0;
  for (const y of input) {
    for (const x of y) if (x) count++;
  }
  return count;
};
aoc.partB = (input: Input): number => {
  input[0][0] = true;
  input[0][input.length - 1] = true;
  input[input.length - 1][0] = true;
  input[input.length - 1][input.length - 1] = true;
  for (let i = 0; i < 100; i++) {
    input = step(input);
    input[0][0] = true;
    input[0][input.length - 1] = true;
    input[input.length - 1][0] = true;
    input[input.length - 1][input.length - 1] = true;
  }

  let count = 0;
  for (const y of input) {
    for (const x of y) if (x) count++;
  }
  return count;
};

// const testValues = `.#.#.#\n...##.\n#....#\n..#...\n#.#..#\n####..`.trim();

aoc.test(() => {
  //   o('partA', () => {
  //     o(aoc.answers(testValues).a).equals(-1);
  //   });
  //   o('partB', () => {
  //     o(aoc.answers(testValues).b).equals(-1);
  //   });
});

// aoc.run();
