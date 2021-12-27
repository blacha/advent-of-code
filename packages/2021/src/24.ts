import { AoC } from 'aocf';

export type Output = { x: number; y: number; z: number; w: number };
export type Func = (w: number, z: number) => Output;
export type Input = [number, number, number][];

const aoc = AoC.create<Input>(2021, 24);

aoc.parse = (l: string): Input => {
  const constants: [number, number, number][] = [];
  const chunks = l.split('inp w\n');

  for (const c of chunks) {
    if (c.trim() == '') continue;
    const lines = c.trim().split('\n');
    constants.push([Number(lines[3].split(' ')[2]), Number(lines[4].split(' ')[2]), Number(lines[14].split(' ')[2])]);
  }
  return constants;
};

function solve(input: Input): { a: number; b: number } {
  const stack: [number, number][] = [];
  const a: number[] = [];
  const b: number[] = [];

  for (let i = 0; i < input.length; i++) {
    const [x, y, z] = input[i];
    if (x == 1) {
      stack.push([i, z]);
    } else {
      const p = stack.pop();
      if (p == null) throw new Error('Stack empty');
      const complement = p[1] + y;

      a[p[0]] = Math.min(9, 9 - complement);
      a[i] = a[p[0]] + complement;

      b[p[0]] = Math.max(1, 1 - complement);
      b[i] = b[p[0]] + complement;
    }
  }

  return { a: Number(a.join('')), b: Number(b.join('')) };
}

aoc.partA = (input: Input): number => solve(input).a;
aoc.partB = (input: Input): number => solve(input).b;

aoc.test();

/*
function toFunction(text: string): Func {
  const func = [`let x = 0;`, `let y = 0;`];
  const lines = text.split('\n');
  for (const l of lines) {
    if (l.trim() == '') continue;
    const [op, v, val] = l.split(' ');

    switch (op) {
      case 'inp':
        continue;
      case 'mul':
        if (val == '0') func.push(`${v} = 0;`);
        else func.push(`${v} = ${v} * ${val};`);
        break;
      case 'add':
        func.push(`${v} = ${v} + ${val};`);
        break;
      case 'eql':
        func.push(`${v} = ${v} == ${val} ? 1 : 0;`);
        break;
      case 'mod':
        func.push(`${v} = ${v} % ${val};`);
        break;
      case 'div':
        func.push(`${v} = Math.floor(${v} / ${val});`);
        break;
      default:
        throw new Error('Unknown op: ' + op);
    }
  }

  func.push('return {x,y,z,w};');
  return new Function('w', 'z', func.join('\n')) as any;
}
*/
