// function main() {}

export const Day2TestInput = `1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc`;

export interface Day2TestData {
  min: number;
  max: number;
  char: string;
  pass: string;
}

export function parseInput(str: string): Day2TestData[] {
  return str.split('\n').map((instr) => {
    const chunks = instr.split(' ');
    const [min, max] = chunks[0].split('-').map((ch) => parseInt(ch));
    const char = chunks[1].replace(':', '');
    return { min, max, char, pass: chunks[2] };
  });
}

export function countValidPasswordsA(input: Day2TestData[]): number {
  let total = 0;
  for (const p of input) {
    let count = 0;
    for (const c of p.pass) if (c == p.char) count++;
    if (count >= p.min && count <= p.max) total++; //console.log(count, p);
  }
  return total;
}

export function countValidPasswordsB(input: Day2TestData[]): number {
  let total = 0;
  for (const p of input) {
    const charMin = p.pass.charAt(p.min - 1) == p.char;
    const charMax = p.pass.charAt(p.max - 1) == p.char;
    if (charMin != charMax) total++;
  }
  return total;
}
