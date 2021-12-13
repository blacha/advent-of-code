import { GlyphSmall } from './ocr';

function loadCharacters(): void {
  for (let i = 0; i < GlyphSmall.letters.length; i++) {
    const letter = GlyphSmall.letters[i];
    const offset = i * (GlyphSmall.width + 1);

    const output: number[] = [];
    for (let y = 0; y < GlyphSmall.glyphs.length; y++) {
      for (let x = offset; x <= offset + GlyphSmall.width; x++) {
        if (GlyphSmall.glyphs[y][x] == '#') output.push(x - offset + y * GlyphSmall.width);
      }
    }

    GridCharacter.Characters.set(output.join(':'), letter);
  }
}

export class GridCharacter {
  static Characters: Map<string, string> = new Map();
  size = { width: 4, height: 6, spacing: { x: 1, y: 0 } };

  characters: number[][];
  constructor(charCount: number) {
    if (GridCharacter.Characters.size == 0) loadCharacters();
    this.characters = [];
    for (let i = 0; i < charCount; i++) this.characters.push([]);
  }

  set(x: number, y: number): void {
    const charNumber = Math.floor(x / (this.size.width + this.size.spacing.x));
    const charOffset = charNumber * (this.size.width + this.size.spacing.x);
    this.characters[charNumber][x - charOffset + y * this.size.width] = 1;
  }

  static parse(ch: number[]): string {
    const pattern: number[] = [];
    for (let i = 0; i < ch.length; i++) if (ch[i] === 1) pattern.push(i);
    return GridCharacter.Characters.get(pattern.join(':')) ?? '?';
  }

  toChars(): string {
    return this.characters
      .map((c) => {
        if (c.length == 0) return '';
        return GridCharacter.parse(c);
      })
      .join('');
  }

  dump(): void {
    const lines: string[][] = [];
    for (const ch of this.characters) {
      for (let y = 0; y < this.size.height; y++) {
        lines[y] = lines[y] ?? [];
        const line: string[] = [];
        for (let x = 0; x < this.size.width; x++) {
          const isHit = ch[x + y * this.size.width] === 1;
          line.push(isHit ? '#' : '.');
        }
        lines[y].push(line.join(''));
      }
    }
    console.log(lines.map((c) => c.join(' ')).join('\n'));
  }
}
