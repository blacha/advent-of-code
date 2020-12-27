export type AoCDataFile = AoCJson[];
export type AoCAnswer = number | string | undefined;

export interface AoCJson {
  /** AoC Event year 2015 - 2020 */
  year: number;
  /** AoC Event day 1 -> 30 */
  day: number;
  /** github username for where the answers came from */
  user: string;
  /** Advent of code data input */
  input: string;
  /** Optional answers */
  answers: { a: AoCAnswer; b: AoCAnswer } | null;
}
