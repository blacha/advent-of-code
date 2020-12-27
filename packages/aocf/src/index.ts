export { AoC } from './aoc';
export { toNumberArray, toNumberArraySorted } from './util/parse';
export { permutations } from './util/combonitorics';
export { Iter } from './util/iter';
export { Grid } from './util/grid';
export { timer } from './util/timer';
export { log } from './util/log';
export { AoCDataFile, AoCAnswer, AoCJson } from './export';
export { AoCData } from './aoc.data';

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
