export { AoC } from './aoc';
export { toNumberArray, toNumberArraySorted } from './util/parse';
export { permutations } from './util/combonitorics';
export { Iter } from './util/iter';
export { Grid } from './util/grid';

export interface Point {
  x: number;
  y: number;
}
export interface Vector extends Point {
  z: number;
}
