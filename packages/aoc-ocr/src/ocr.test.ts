import o from 'ospec';
import { AoCOcr, Characters, Glyphs } from './index.js';

const GlyphG = `
░██░
█░░█
█░░░
█░██
█░░█
░███`;

const TextString = `
###   ##  #  # #### ###  ####   ##  ##
#  # #  # #  #    # #  # #       # #  #
#  # #    ####   #  ###  ###     # #
###  # ## #  #  #   #  # #       # #
#    #  # #  # #    #  # #    #  # #  #
#     ### #  # #### ###  #     ##   ##
`
  .trim()
  .split('\n')
  .map((c) => c.split(''));

o.spec('AoCOcr', () => {
  o('should parse the letter A with numbers', () => {
    o(
      AoCOcr.parse(
        [
          [0, 1, 1, 0],
          [1, 0, 0, 1],
          [1, 0, 0, 1],
          [1, 1, 1, 1],
          [1, 0, 0, 1],
          [1, 0, 0, 1],
        ],
        1,
      ),
    ).equals('A');
  });

  o('should parse the letter A with a single string', () => {
    const res = AoCOcr.parse(GlyphG, '█');
    o(res).equals('G');
  });

  o('should parse with other text combinations', () => {
    const GHash = GlyphG.replace(/█/g, '#');
    o(AoCOcr.parse(GHash, '█')).equals(null);
    o(AoCOcr.parse(GHash, '#')).equals('G');
  });

  o('should parse a number of glyphs', () => {
    o(
      AoCOcr.parseAll(
        Characters.trim()
          .split('\n')
          .map((c) => c.split('')),
        Glyphs.fill,
      ),
    ).equals(Glyphs.letters);
  });

  o('should parse multiple numbers', () => {
    o(
      AoCOcr.parseAll(
        [
          [0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0],
          [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
          [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
          [1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1],
          [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
          [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
        ],
        1,
      ),
    ).equals('AAA');
  });

  o('should parse some examples', () => {
    const res = AoCOcr.parseAll(TextString, '#');
    o(res).equals('PGHZBFJC');
  });

  o('should convert to text', () => {
    const res = AoCOcr.toAoC('ABC');
    o(res).equals(
      `
⬛⬜⬜⬛ ⬜⬜⬜⬛ ⬛⬜⬜⬛
⬜⬛⬛⬜ ⬜⬛⬛⬜ ⬜⬛⬛⬜
⬜⬛⬛⬜ ⬜⬜⬜⬛ ⬜⬛⬛⬛
⬜⬜⬜⬜ ⬜⬛⬛⬜ ⬜⬛⬛⬛
⬜⬛⬛⬜ ⬜⬛⬛⬜ ⬜⬛⬛⬜
⬜⬛⬛⬜ ⬜⬜⬜⬛ ⬛⬜⬜⬛
`.trim(),
    );
  });

  o('should convert to text with different fill and blanks', () => {
    const res = AoCOcr.toAoC('ABC', '#', '.');
    o(res).equals(
      `
.##. ###. .##.
#..# #..# #..#
#..# ###. #...
#### #..# #...
#..# #..# #..#
#..# ###. .##.
`.trim(),
    );
  });
});
