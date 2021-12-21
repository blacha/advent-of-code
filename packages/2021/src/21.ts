import { AoC } from 'aocf';

export type Input = number[];

const aoc = AoC.create<Input>(2021, 21);

aoc.parse = (l: string): Input => {
  return l.split('\n').map((c) => Number(c.split(': ').pop() ?? '-1'));
};

class Dice {
  v = 1;
  rollCount = 0;
  roll(): number {
    this.rollCount++;
    const v = this.v;
    this.v++;
    if (this.v > 100) this.v = 1;
    return v;
  }
}

aoc.partA = (input: Input): number => {
  const dice = new Dice();

  const positions = [...input];
  const scores = [0, 0];
  for (let i = 0; i < 1000; i++) {
    const playerId = i % 2 == 0 ? 0 : 1;

    const roll = dice.roll() + dice.roll() + dice.roll();
    positions[playerId] += roll;

    while (positions[playerId] > 10) positions[playerId] -= 10;
    scores[playerId] += positions[playerId];

    if (scores[playerId] >= 1000) break;
  }
  return dice.rollCount * Math.min(...scores);
};

const Roll3 = [3, 4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 8, 8, 8, 9];

aoc.partB = (input: Input): number => {
  let OpenGames = new Map<string, number>();
  OpenGames.set([input[0], 0, input[1], 0].join(':'), 1);

  let winnerA = 0;
  let winnerB = 0;

  while (OpenGames.size > 0) {
    for (let playerId = 0; playerId < 2; playerId++) {
      const gameState = new Map<string, number>();

      for (const g of OpenGames.entries()) {
        const [playerALocation, playerAScore, playerBLocation, playerBScore] = g[0].split(':').map(Number);
        const gameCount = g[1];

        const score = playerId == 0 ? playerAScore : playerBScore;
        const location = playerId == 0 ? playerALocation : playerBLocation;

        for (const roll of Roll3) {
          let nextLocation = location + roll;
          while (nextLocation > 10) nextLocation -= 10;

          const nextScore = score + nextLocation;
          if (nextScore >= 21) {
            if (playerId == 0) winnerA += gameCount;
            else winnerB += gameCount;
          } else {
            const gameId =
              playerId == 0
                ? [nextLocation, nextScore, playerBLocation, playerBScore].join(':')
                : [playerALocation, playerAScore, nextLocation, nextScore].join(':');
            gameState.set(gameId, (gameState.get(gameId) ?? 0) + gameCount);
          }
        }
      }
      OpenGames = gameState;
    }
  }
  return Math.max(winnerA, winnerB);
};

const testValues = `Player 1 starting position: 4\nPlayer 2 starting position: 8`.trim();

aoc.test((o) => {
  o('partA', () => {
    o(aoc.answers(testValues).a).equals(739785);
  });

  o('partB', () => {
    o(aoc.answers(testValues).b).equals(444356092776315);
  });
});
