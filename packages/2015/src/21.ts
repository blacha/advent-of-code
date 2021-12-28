import { AoC } from 'aocf';

export type Input = { a: number; b: number };

const aoc = AoC.create<Input>(2015, 21);

interface Stats {
  hp: number;
  dmg: number;
  armor: number;
}

function fight(a: Stats, b: Stats): boolean {
  while (true) {
    const dmgA = Math.max(a.dmg - b.armor, 1);
    b.hp = b.hp - dmgA;
    if (b.hp <= 0) break;

    const dmgB = Math.max(b.dmg - a.armor, 1);
    a.hp = a.hp - dmgB;
    if (a.hp <= 0) break;
  }

  return a.hp > 0;
}

const Items = {
  weapons: [
    { name: 'Dagger', cost: 8, dmg: 4, armor: 0 },
    { name: 'Shortsword', cost: 10, dmg: 5, armor: 0 },
    { name: 'Warhammer', cost: 25, dmg: 6, armor: 0 },
    { name: 'Longsword', cost: 40, dmg: 7, armor: 0 },
    { name: 'Greataxe', cost: 74, dmg: 8, armor: 0 },
  ],

  armor: [
    { name: 'none', cost: 0, dmg: 0, armor: 0 },
    { name: 'Leather', cost: 13, dmg: 0, armor: 1 },
    { name: 'Chainmail', cost: 31, dmg: 0, armor: 2 },
    { name: 'Splintmail', cost: 53, dmg: 0, armor: 3 },
    { name: 'Bandedmail', cost: 75, dmg: 0, armor: 4 },
    { name: 'Platemail', cost: 102, dmg: 0, armor: 5 },
  ],
  ringA: [
    { name: 'none', cost: 0, dmg: 0, armor: 0 },
    { name: 'Damage +1', cost: 25, dmg: 1, armor: 0 },
    { name: 'Damage +2', cost: 50, dmg: 2, armor: 0 },
    { name: 'Damage +3', cost: 100, dmg: 3, armor: 0 },
  ],
  ringB: [
    { name: 'none', cost: 0, dmg: 0, armor: 0 },
    { name: 'Defense +1', cost: 20, dmg: 0, armor: 1 },
    { name: 'Defense +2', cost: 40, dmg: 0, armor: 2 },
    { name: 'Defense +3', cost: 80, dmg: 0, armor: 3 },
  ],
};

aoc.parse = (l: string): Input => {
  const stats = { hp: 0, dmg: 0, armor: 0 };
  l.split('\n').forEach((c) => {
    const [stat, val] = c.split(':');
    if (stat == 'Damage') stats.dmg = Number(val);
    else if (stat == 'Armor') stats.armor = Number(val);
    else if (stat == 'Hit Points') stats.hp = Number(val);
    else throw `Unknown stat: ${c}`;
  });

  const boss = { ...stats };
  let lowestCost = Number.MAX_VALUE;
  let biggestCost = Number.MIN_VALUE;

  for (const w of Items.weapons) {
    for (const a of Items.armor) {
      for (const r1 of Items.ringA) {
        for (const r2 of Items.ringB) {
          const cost = w.cost + a.cost + r1.cost + r2.cost;

          boss.hp = stats.hp;
          const player = {
            hp: 100,
            armor: r1.armor + r2.armor + a.armor + w.armor,
            dmg: r1.dmg + r2.dmg + a.dmg + w.dmg,
          };

          if (fight(player, boss)) lowestCost = Math.min(lowestCost, cost);
          else biggestCost = Math.max(biggestCost, cost);
        }
      }
    }
  }

  return { a: lowestCost, b: biggestCost };
};

aoc.partA = (input: Input): number => input.a;
aoc.partB = (input: Input): number => input.b;
aoc.test();
