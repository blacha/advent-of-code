import { AoC } from 'aocf';

export interface AoC2020Day22Input {
  players: {
    id: number;
    cards: number[];
  }[];
}

export class AoC2020Day22 extends AoC<AoC2020Day22Input> {
  constructor() {
    super(2020, 22);
  }

  parse(str: string): AoC2020Day22Input {
    const playerRaw = str.split('\n\n');
    const players: {
      id: number;
      cards: number[];
    }[] = [];
    for (const player of playerRaw) {
      const lines = player.split('\n');
      const id = Number(lines.shift()?.split('Player ')[1].replace(':', ''));
      const cards = lines.map(Number);
      players.push({ id, cards });
    }
    return { players };
  }

  score(cardsIn: number[][]): number {
    const [cardsA, cardsB] = cardsIn;
    const cards = cardsA.length == 0 ? cardsB : cardsA;
    let points = 0;
    for (let i = 0; i < cards.length; i++) {
      points = points + cards[cards.length - 1 - i] * (i + 1);
    }
    return points;
  }

  partA(input: AoC2020Day22Input): number {
    const [p1, p2] = input.players;
    return this.score(this.combat(p1.cards.slice(), p2.cards.slice(), false));
  }

  combat(cardsA: number[], cardsB: number[], recurse = false): number[][] {
    const previous = new Set();
    while (cardsA.length > 0 && cardsB.length > 0) {
      const cardKeys = cardsA.join(':') + '--' + cardsB.join(':');
      if (previous.has(cardKeys)) return [cardsA, []];
      previous.add(cardKeys);

      const cardA = cardsA.shift()!;
      const cardB = cardsB.shift()!;

      if (recurse && cardA <= cardsA.length && cardB <= cardsB.length) {
        const [cA, cB] = this.combat(cardsA.slice(0, cardA), cardsB.slice(0, cardB), recurse);
        if (cA.length == 0) cardsB.push(cardB, cardA);
        else if (cB.length == 0) cardsA.push(cardA, cardB);
      } else if (cardA > cardB) {
        cardsA.push(cardA, cardB);
      } else if (cardB > cardA) {
        cardsB.push(cardB, cardA);
      }
    }
    return [cardsA, cardsB];
  }

  partB(input: AoC2020Day22Input): number {
    const [p1, p2] = input.players;
    return this.score(this.combat(p1.cards.slice(), p2.cards.slice(), true));
  }
}

export const aoc2020day22 = new AoC2020Day22();
aoc2020day22.run();
