export { AoC } from './aoc.js';
export { toNumberArray, toNumberArraySorted } from './util/parse.js';
export { permutations } from './util/combonitorics.js';
export { Iter } from './util/iter.js';
export { Grid } from './util/grid.js';
export { timer } from './util/timer.js';
export { log } from './util/log.js';
export { AoCDataFile, AoCAnswer, AoCJson } from './export.js';
export { AoCData } from './aoc.data.js';

export interface Point {
  x: number;
  y: number;
}

export interface Vec3 extends Point {
  z: number;
}

export interface Vec4 extends Vec3 {
  w: number;
}

/** Collection of UTF block colors */
export const Colors = {
  Black: '⬛',
  White: '⬜',
  Purple: '🟪',
  Yellow: '🟧',
};
