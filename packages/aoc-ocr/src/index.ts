export const Characters = `
⬛⬜⬜⬛ ⬜⬜⬜⬛ ⬛⬜⬜⬛ ⬜⬜⬜⬜ ⬜⬜⬜⬜ ⬛⬜⬜⬛ ⬜⬛⬛⬜ ⬛⬛⬜⬜ ⬜⬛⬛⬜ ⬜⬛⬛⬛ ⬛⬜⬜⬛ ⬜⬜⬜⬛ ⬜⬜⬜⬛ ⬛⬜⬜⬜ ⬜⬛⬛⬜ ⬜⬜⬜⬜
⬜⬛⬛⬜ ⬜⬛⬛⬜ ⬜⬛⬛⬜ ⬜⬛⬛⬛ ⬜⬛⬛⬛ ⬜⬛⬛⬜ ⬜⬛⬛⬜ ⬛⬛⬛⬜ ⬜⬛⬜⬛ ⬜⬛⬛⬛ ⬜⬛⬛⬜ ⬜⬛⬛⬜ ⬜⬛⬛⬜ ⬜⬛⬛⬛ ⬜⬛⬛⬜ ⬛⬛⬛⬜
⬜⬛⬛⬜ ⬜⬜⬜⬛ ⬜⬛⬛⬛ ⬜⬜⬜⬛ ⬜⬜⬜⬛ ⬜⬛⬛⬛ ⬜⬜⬜⬜ ⬛⬛⬛⬜ ⬜⬜⬛⬛ ⬜⬛⬛⬛ ⬜⬛⬛⬜ ⬜⬛⬛⬜ ⬜⬛⬛⬜ ⬜⬛⬛⬛ ⬜⬛⬛⬜ ⬛⬛⬜⬛
⬜⬜⬜⬜ ⬜⬛⬛⬜ ⬜⬛⬛⬛ ⬜⬛⬛⬛ ⬜⬛⬛⬛ ⬜⬛⬜⬜ ⬜⬛⬛⬜ ⬛⬛⬛⬜ ⬜⬛⬜⬛ ⬜⬛⬛⬛ ⬜⬛⬛⬜ ⬜⬜⬜⬛ ⬜⬜⬜⬛ ⬛⬜⬜⬛ ⬜⬛⬛⬜ ⬛⬜⬛⬛
⬜⬛⬛⬜ ⬜⬛⬛⬜ ⬜⬛⬛⬜ ⬜⬛⬛⬛ ⬜⬛⬛⬛ ⬜⬛⬛⬜ ⬜⬛⬛⬜ ⬜⬛⬛⬜ ⬜⬛⬜⬛ ⬜⬛⬛⬛ ⬜⬛⬛⬜ ⬜⬛⬛⬛ ⬜⬛⬜⬛ ⬛⬛⬛⬜ ⬜⬛⬛⬜ ⬜⬛⬛⬛
⬜⬛⬛⬜ ⬜⬜⬜⬛ ⬛⬜⬜⬛ ⬜⬜⬜⬜ ⬜⬛⬛⬛ ⬛⬜⬜⬜ ⬜⬛⬛⬜ ⬛⬜⬜⬛ ⬜⬛⬛⬜ ⬜⬜⬜⬜ ⬛⬜⬜⬛ ⬜⬛⬛⬛ ⬜⬛⬛⬜ ⬜⬜⬜⬛ ⬛⬜⬜⬛ ⬜⬜⬜⬜
`;

export const Glyphs = {
  letters: 'ABCEFGHJKLOPRSUZ',
  glyphs: Characters.trim()
    .split('\n')
    .map((c) => c.split(' ')),
  width: 4,
  fill: '⬜',
};

export const Alphabet = new Map<string, string>();
for (let i = 0; i < Glyphs.letters.length; i++) {
  const char = Glyphs.letters[i];
  const grid = Glyphs.glyphs.map((line) => line[i]);
  Alphabet.set(grid.join(''), char);
}

function normalizeFill<T>(c: T, fill: T): string {
  return c == fill ? '⬜' : '⬛';
}
export class AoCOcr {
  static Width = 4;

  static parse(input: string, fill: string): string | null;
  static parse<T>(input: T[][], fill: T): string | null;
  static parse<T = string>(input: T[][] | string, fill: T | string): string | null {
    if (typeof input === 'string') {
      const data = input
        .trim()
        .split('\n')
        .join('')
        .split('')
        .map((c) => normalizeFill(c, fill))
        .join('');
      return Alphabet.get(data) ?? null;
    }

    return Alphabet.get(AoCOcr.format(input, fill, '')) ?? null;
  }

  static parseAll<T>(input: T[][], fill: T, spacing = 1): string {
    if (input.length == 0) return '';
    const maxLineLength = input.reduce((total, c) => Math.max(total, c.length), 0);
    const charSize = AoCOcr.Width + spacing;
    const chars = Math.floor(maxLineLength / charSize);

    const output = [];
    for (let i = 0; i <= chars; i++) {
      const lineStart = i * charSize;
      const lineEnd = lineStart + AoCOcr.Width;
      const char = input.map((c) => c.slice(lineStart, lineEnd));
      output.push(Alphabet.get(AoCOcr.format(char, fill, '')) ?? '?');
    }

    return output.join('');
  }

  static format<T>(input: T[][], fill: T, join = '\n'): string {
    let maxLength = 0;
    for (const line of input) maxLength = Math.max(line.length, maxLength);

    const data = [];
    for (const line of input) {
      const out = [];
      for (let i = 0; i < maxLength; i++) out.push(normalizeFill(line[i], fill));
      data.push(out.join(''));
    }
    return data.join(join);
  }
}
