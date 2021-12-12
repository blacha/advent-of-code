import { AoC } from 'aocf';

export type Input = string[];

const aoc = AoC.create<Input>(2021, 10);

aoc.parse = (l: string): Input => {
  return l.split('\n');
};

const Points: Record<string, number> = { ')': 3, ']': 57, '}': 1197, '>': 25137 };
const BracketsOpenClose: Record<string, string> = { '(': ')', '[': ']', '{': '}', '<': '>' };
const BracketsClosePoints: Record<string, number> = { ')': 1, ']': 2, '}': 3, '>': 4 };

function validateLine(line: string, openCloseStack: string[] = []): string | null {
  for (const ch of line) {
    const closeChar = BracketsOpenClose[ch];
    if (closeChar != null) {
      openCloseStack.push(closeChar);
    } else {
      const expectedClose = openCloseStack.pop();
      if (expectedClose != ch) return ch;
    }
  }
  return null;
}

aoc.partA = (input: Input): number => {
  let output = 0;
  for (const line of input) {
    const ch = validateLine(line);
    if (ch) output += Points[ch];
  }
  return output;
};

aoc.partB = (input: Input): number => {
  const output = [];
  for (const line of input) {
    const openCloseStack: string[] = [];
    if (validateLine(line, openCloseStack) != null) continue;

    let points = 0;
    for (const stack of openCloseStack.reverse()) points = points * 5 + BracketsClosePoints[stack];
    output.push(points);
  }
  output.sort((a, b) => b - a);
  return output[Math.floor(output.length / 2)];
};

const testValues = `[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]`.trim();

aoc.test((o) => {
  o('test values', () => {
    o(aoc.answers(testValues).a).equals(26397);
    o(aoc.answers(testValues).b).equals(288957);
  });

  o('validate part b math', () => {
    o(aoc.partB?.(['<{([{{}}[<[[[<>{}]]]>[]]'])).equals(294);
    o(aoc.partB?.(['{<[[]]>}<{[{[{[]{()[[[]'])).equals(995444);
    o(aoc.partB?.(['(((({<>}<{<{<>}{[]{[]{}'])).equals(1480781);
    o(aoc.partB?.(['[(()[<>])]({[<{<<[]>>('])).equals(5566);
    o(aoc.partB?.(['[({(<(())[]>[[{[]{<()<>>'])).equals(288957);
  });
});
