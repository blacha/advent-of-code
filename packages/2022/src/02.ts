import { AoC } from 'aocf';

export type Rps = 'rock' | 'paper' | 'scissors';

export type Game = { a: Rps; b: 'X' | 'Y' | 'Z' };
export type Input = Game[];

const scores: Record<Rps, number> = { rock: 1, paper: 2, scissors: 3 };

export const GameA: Record<string, Rps> = { A: 'rock', B: 'paper', C: 'scissors' };
export const GameBPartA: Record<string, Rps> = { X: 'rock', Y: 'paper', Z: 'scissors' };

const aoc = AoC.create<Input>(2022, 2);
aoc.parse = (s: string): Input => {
  return s.split('\n').map((c) => {
    return { a: GameA[c.charAt(0)], b: c.charAt(2) } as { a: Rps; b: 'X' | 'Y' | 'Z' };
  });
};

function winner(a: Rps, b: Rps): 'a' | 'b' | 0 {
  if (a == b) return 0;

  if (a == 'rock' && b == 'scissors') return 'a';
  if (a == 'rock' && b == 'paper') return 'b';

  if (a == 'paper' && b == 'rock') return 'a';
  if (a == 'paper' && b == 'scissors') return 'b';

  if (a == 'scissors' && b == 'paper') return 'a';
  if (a == 'scissors' && b == 'rock') return 'b';

  throw Error('Unknown game: ' + a + ': ' + b);
}

aoc.partA = (data: Input): number => {
  let score = 0;

  for (const game of data) {
    const choice = GameBPartA[game.b];
    const ret = winner(game.a, choice);

    if (ret == 'b') score += 6;
    if (ret == 0) score += 3;

    score += scores[choice];
  }
  return score;
};

function getChoicePartB(game: Game): Rps {
  if (game.b == 'X') {
    if (game.a === 'rock') return 'scissors';
    if (game.a === 'paper') return 'rock';
    if (game.a === 'scissors') return 'paper';
  }

  if (game.b === 'Y') return game.a;

  if (game.b === 'Z') {
    if (game.a === 'rock') return 'paper';
    if (game.a === 'paper') return 'scissors';
    if (game.a === 'scissors') return 'rock';
  }

  throw new Error('Unknown Choice: ' + game.b);
}

aoc.partB = (data: Input): number => {
  let score = 0;

  for (const game of data) {
    const choice = getChoicePartB(game);
    const ret = winner(game.a, choice);

    if (ret == 'b') score += 6;
    if (ret == 0) score += 3;
    score += scores[choice];
  }
  return score;
};

aoc.test((o) => {
  const input = `A Y\nB X\nC Z`;

  o('should parse', () => {
    o(aoc.parse(input)).deepEquals([
      { a: 'rock', b: 'Y' },
      { a: 'paper', b: 'X' },
      { a: 'scissors', b: 'Z' },
    ]);
  });

  o('partA', () => {
    o(aoc.partA(aoc.parse(input))).equals(15);
  });

  o('partB', () => {
    o(aoc.partB(aoc.parse(input))).equals(12);
  });
});
