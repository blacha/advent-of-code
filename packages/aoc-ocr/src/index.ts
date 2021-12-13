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
export const Symbols = new Map<string, string[]>();

for (let i = 0; i < Glyphs.letters.length; i++) {
  const char = Glyphs.letters[i];
  const grid = Glyphs.glyphs.map((line) => line[i]);
  Alphabet.set(grid.join(''), char);

  Symbols.set(char, grid);
}

function normalizeFill<T>(c: T, fill: T): string {
  return c == fill ? '⬜' : '⬛';
}
export class AoCOcr {
  static Width = 4;

  /**
   * Create a output text string with the desired fill blank and spacing
   *
   * @example
   * ```typescript
   * toAoC('ABC')
   *
   * ⬛⬜⬜⬛ ⬜⬜⬜⬛ ⬛⬜⬜⬛
   * ⬜⬛⬛⬜ ⬜⬛⬛⬜ ⬜⬛⬛⬜
   * ⬜⬛⬛⬜ ⬜⬜⬜⬛ ⬜⬛⬛⬛
   * ⬜⬜⬜⬜ ⬜⬛⬛⬜ ⬜⬛⬛⬛
   * ⬜⬛⬛⬜ ⬜⬛⬛⬜ ⬜⬛⬛⬜
   * ⬜⬛⬛⬜ ⬜⬜⬜⬛ ⬛⬜⬜⬛
   * ```
   * @param input text string
   * @param fill character to use for a fill defaults to '⬜'
   * @param blank character to use for blank spots defaults to '⬛'
   * @param space character to use between letters defaults to ' '
   * @returns Ascii art of the letters
   */
  static toAoC(input: string, fill = '⬜', blank = '⬛', space = ' '): string {
    const lines: string[] = [];
    for (const ch of input) {
      const grid = Symbols.get(ch);
      if (grid == null) throw new Error(`Cannot translate "${ch}"`);
      for (let i = 0; i < grid.length; i++) {
        const existing = lines[i];
        if (existing == null) {
          lines[i] = grid[i];
        } else {
          lines[i] = existing + space + grid[i];
        }
      }
    }

    if (fill !== '⬜' || blank !== '⬛') {
      for (let i = 0; i < lines.length; i++) {
        lines[i] = lines[i].replace(/⬜/g, fill).replace(/⬛/g, blank);
      }
    }

    return lines.join('\n');
  }

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
