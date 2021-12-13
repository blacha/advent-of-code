# aoc-ocr

[OCR](https://en.wikipedia.org/wiki/Optical_character_recognition) for Advent of Code letters


```typescript
import {AoCOcr} from 'aoc-ocr';

const A = `
⬛⬜⬜⬛
⬜⬛⬛⬜
⬜⬛⬛⬜
⬜⬜⬜⬜
⬜⬛⬛⬜
⬜⬛⬛⬜
`
AoCOcr.parse(A, '⬜') // "A"

const Aaa = 
[
    [0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0],
    [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1],
    [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
];

AoCOcr.parseAll(Aaa, 1) // "AAA"
```

And can work in reverse
```typescript
console.log(AoCOcr.toAoC('ABC'))
```

⬛⬜⬜⬛ ⬜⬜⬜⬛ ⬛⬜⬜⬛
⬜⬛⬛⬜ ⬜⬛⬛⬜ ⬜⬛⬛⬜
⬜⬛⬛⬜ ⬜⬜⬜⬛ ⬜⬛⬛⬛
⬜⬜⬜⬜ ⬜⬛⬛⬜ ⬜⬛⬛⬛
⬜⬛⬛⬜ ⬜⬛⬛⬜ ⬜⬛⬛⬜
⬜⬛⬛⬜ ⬜⬜⬜⬛ ⬛⬜⬜⬛