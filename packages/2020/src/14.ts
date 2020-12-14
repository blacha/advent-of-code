import { AoC } from 'aocf';

export type Op = OpMask | OpMem;
export interface OpMem {
  op: 'mem';
  index: number;
  v: number;
}
export interface OpMask {
  op: 'mask';
  value: string;
}

function parseBigInt(numberString: string, keyspace = '01'): bigint {
  let result = 0n;
  const keyspaceLength = BigInt(keyspace.length);
  for (let i = numberString.length - 1; i >= 0; i--) {
    const value = keyspace.indexOf(numberString[i]);
    if (value === -1) throw new Error('invalid string');
    result = result * keyspaceLength + BigInt(value);
  }
  return result;
}
export class AoC2020Day14 extends AoC<Op[]> {
  constructor() {
    super(2020, 14);
  }

  parse(i: string): Op[] {
    const chunks = i.split('\n');
    return chunks.map((c) => {
      if (c.startsWith('mask')) {
        return {
          op: 'mask',
          value: c.split('= ')[1].trim(),
        };
      } else {
        return {
          op: 'mem',
          index: Number(c.slice(c.indexOf('[') + 1, c.indexOf(']'))),
          v: Number(c.split(' =')[1].trim()),
        };
      }
    });
  }

  partA(input: Op[]): number {
    const mem = new Map<number, number>();
    let mask = '';
    for (const op of input) {
      if (op.op == 'mask') {
        mask = op.value;
        continue;
      }

      const opValue = op.v.toString(2).padStart(36, '0').split('');

      for (let i = 0; i < mask.length; i++) {
        const maskVal = mask[i];
        if (maskVal == '1') opValue[i] = '1';
        if (maskVal == '0') opValue[i] = '0';
      }
      const opReal = parseInt(opValue.join(''), 2);
      mem.set(op.index, opReal);
    }
    let total = 0;
    for (const c of mem.values()) total += c;
    return Number(total);
  }

  partB(input: Op[]): number {
    let mask = '';
    const mem = new Map<string, number>();
    let xCount = 0;
    let xLength = 0;
    for (const op of input) {
      if (op.op == 'mask') {
        mask = op.value;
        xCount = 2 ** mask.split('').filter((f) => f == 'X').length;
        xLength = xCount.toString(2).length - 1;
        continue;
      }

      for (let j = 0; j < xCount; j++) {
        const opValue = op.index.toString(2).padStart(36, '0').split('');
        const xObj = j.toString(2).padStart(xLength, '0');
        let xOff = 0;
        for (let i = 0; i < mask.length; i++) {
          const maskVal = mask[i];
          if (maskVal == 'X') {
            if (xOff > xObj.length - 1) console.log('Overflow??');

            const xVal = xObj[xOff];
            opValue[i] = xVal;
            xOff++;
          } else if (maskVal == '1') opValue[i] = '1';
        }
        mem.set(opValue.join(''), op.v);
      }
    }
    let total = 0;
    for (const c of mem.values()) total += c;
    return total;
  }
}

export const aoc2020day14 = new AoC2020Day14();

aoc2020day14.run();
