import { AoC } from 'aocf';

export type Input = Monkey[];

export interface Monkey {
  id: number;
  items: number[];
  operation: [string, string | number];
  test: number;
  ifTrue: number;
  ifFalse: number;
  count: number;
}

const aoc = AoC.create<string>(2022, 11);

function getMonkies(l: string): Monkey[] {
  const monks: Input = [];
  const chunks = l.split('\n\n');
  for (const m of chunks) {
    const lines = m.split('\n');
    const items = lines[1].split(':')[1].split(', ').map(Number);
    const operation: [string, string | number] = lines[2].split('Operation: new = old ')[1].split(' ') as any;
    if (operation[1] != 'old') operation[1] = Number(operation[1]);
    const test = Number(lines[3].split('Test: divisible by')[1]);
    const ifTrue = Number(lines[4].split('  If true: throw to monkey ')[1]);
    const ifFalse = Number(lines[5].split('  If false: throw to monkey ')[1]);
    const monkey = { id: monks.length, test, items, ifTrue, ifFalse, operation, count: 0 };
    monks.push(monkey as Monkey);
  }

  return monks;
}

function getVal(item: number, monkey: Monkey): number {
  if (monkey.operation[1] === 'old') return item;
  if (typeof monkey.operation[1] === 'number') return monkey.operation[1];
  throw new Error('Unknown op:' + JSON.stringify(monkey));
}
function runOp(item: number, monkey: Monkey): number {
  const val = getVal(item, monkey);
  const op = monkey.operation[0];

  if (op == '+') return val + item;
  else if (op == '*') return val * item;
  else throw new Error('Unk');
}

aoc.partA = (input: string): number => {
  const monkies = getMonkies(input);
  for (let i = 0; i < 20; i++) {
    for (const monkey of monkies) {
      while (monkey.items.length > 0) {
        monkey.count++;
        const item = monkey.items.shift();
        if (item == null) throw new Error('NoItem');
        const ret = Math.floor(runOp(item, monkey) / 3);
        if (ret % monkey.test == 0) {
          monkies[monkey.ifTrue].items.push(ret);
        } else {
          monkies[monkey.ifFalse].items.push(ret);
        }
      }
    }
  }
  monkies.sort((a, b) => b.count - a.count);
  const maxA = monkies[0].count;
  const maxB = monkies[1].count;
  return maxA * maxB;
};
aoc.partB = (l: string): number => {
  const monkies = getMonkies(l);

  let prod = 1;
  for (const mnk of monkies) prod *= mnk.test;
  for (let i = 0; i < 10000; i++) {
    for (const monkey of monkies) {
      while (monkey.items.length > 0) {
        monkey.count++;
        const item = monkey.items.shift();
        if (item == null) throw new Error('NoItem');
        const ret = runOp(item, monkey) % prod;
        if (ret % monkey.test == 0) {
          monkies[monkey.ifTrue].items.push(ret);
        } else {
          monkies[monkey.ifFalse].items.push(ret);
        }
      }
    }
  }
  monkies.sort((a, b) => b.count - a.count);
  const maxA = monkies[0].count;
  const maxB = monkies[1].count;
  return maxA * maxB;
};

aoc.test();
