import { AoC } from 'aocf';

export type Input = { input: string[]; output: string[] }[];

const aoc = AoC.create<Input>(2021, 8);

const Signals = ['abcefg', 'cf', 'acdeg', 'acdfg', 'bcdf', 'abdfg', 'abdefg', 'acf', 'abcdefg', 'abcdfg'].map(
  (c) => new Set(c.split('')),
);

aoc.parse = (l: string): Input => {
  return l.split('\n').map((line) => {
    const [input, output] = line
      .trim()
      .split('|')
      .map((c) =>
        c
          .trim()
          .split(' ')
          .map((a) => a.split('').sort().join('')),
      );
    return { input, output };
  });
};

aoc.partA = (input: Input): number => {
  const nums = new Set([Signals[1].size, Signals[4].size, Signals[7].size, Signals[8].size]);
  let count = 0;
  for (const i of input) {
    for (const sg of i.output) {
      if (nums.has(sg.length)) count++;
    }
  }
  return count;
};

const Chars = 'abcdefg'.split('');

function intersection(a: string, b: string): number {
  const output: Set<string> = new Set();
  for (const ch of a) {
    if (b.includes(ch)) output.add(ch);
  }
  return output.size;
}

function findDigit(chars: string[], ch: string): number {
  const int1 = intersection(ch, chars[1]);
  const int4 = intersection(ch, chars[4]);
  // const int7 = intersection(ch, chars[7]);
  // const int8 = intersection(ch, chars[8]);

  if (ch.length === 6) {
    if (int1 == 2 && int4 == 3) return 0;
    if (int1 == 1 && int4 == 3) return 6;
    if (int1 == 2 && int4 == 4) return 9;
  } else if (ch.length === 5) {
    if (int1 == 1 && int4 == 2) return 2;
    if (int1 == 2 && int4 == 3) return 3;
    if (int1 == 1 && int4 == 3) return 5;
  }

  throw new Error('Failed to match: ' + ch);
}

aoc.partB = (input: Input): number => {
  let output = 0;
  for (const inp of input) {
    const replacements = new Map<string, number>();

    const options = new Map<string, Set<string>>();
    for (const opt in Chars) options.set(opt, new Set(Chars));

    const allSignals = new Set([...inp.input, ...inp.output]);

    const chars = [];
    for (const ch of allSignals) {
      if (ch.length === Signals[1].size) {
        replacements.set(ch, 1);
        chars[1] = ch;
      } else if (ch.length === Signals[4].size) {
        replacements.set(ch, 4);
        chars[4] = ch;
      } else if (ch.length === Signals[7].size) {
        replacements.set(ch, 7);
        chars[7] = ch;
      } else if (ch.length === Signals[8].size) {
        replacements.set(ch, 8);
        chars[8] = ch;
      }
    }

    for (const ch of replacements.keys()) allSignals.delete(ch);
    for (const ch of allSignals) replacements.set(ch, findDigit(chars, ch));

    const num = parseInt(inp.output.map((c) => replacements.get(c)).join(''));
    output += num;
  }

  return output;
};

const testValues = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`.trim();

aoc.test((o) => {
  o('partA', () => {
    o(aoc.answers(testValues).a).equals(26);
  });

  o('partB', () => {
    o(aoc.answers(testValues).b).equals(61229);
  });
});
