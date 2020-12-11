import { AoC, Grid } from 'aocf';
import o from 'ospec';

export enum Cabin {
  Floor = '.',
  SeatEmpty = 'L',
  SeatOccupied = '#',
}

// const Dirs = [
//   { x: -1, y: -1 },
//   { x: -1, y: 0 },
//   { x: -1, y: 1 },
//   { x: 0, y: -1 },

//   { x: 0, y: 1 },
//   { x: 1, y: -1 },
//   { x: 1, y: 0 },
//   { x: 1, y: 1 },
// ];

// function findPoint(input: string[][], startX: number, startY: number, move: { x: number; y: number }): string | null {
//   if (startX < 0 || startY < 0) return null;
//   const line = input[startY];
//   if (line == null) return null;
//   if (line[startX] != Cabin.Floor) {
//     return line[startX];
//   }
//   if (startX >= line.length) return null;
//   return findPoint(input, startX + move.x, startY + move.y, move);
// }

// function countAround(input: string[][], startX: number, startY: number) {
//   let count = 0;
//   for (const d of Dirs) {
//     const pt = findPoint(input, startX + d.x, startY + d.y, d);
//     if (pt == Cabin.SeatOccupied) count += 1;
//   }
//   return count;
// }

export class AoC2020Day11 extends AoC<Grid> {
  constructor() {
    super(2020, 11);
  }

  parse(i: string): Grid {
    return Grid.create(i);
  }

  node(input: string[][], x: number, y: number): number {
    const line = input[y];
    if (line == null) return 0;
    return line[x] === Cabin.SeatOccupied ? 1 : 0;
  }

  tick(grid: Grid): Grid {
    const output = grid.clone();
    for (const { x, y, i } of grid) {
      if (i == Cabin.Floor) continue;

      let count = 0;
      for (const pt of grid.around(x, y)) count += pt.i == Cabin.SeatOccupied ? 1 : 0;

      if (i == Cabin.SeatEmpty && count == 0) {
        output.set(x, y, Cabin.SeatOccupied);
      } else if (i == Cabin.SeatOccupied && count > 3) {
        output.set(x, y, Cabin.SeatEmpty);
      }
    }
    return output;
  }

  partA(input: Grid): number {
    let nodes = input;
    for (let i = 0; i < 1000; i++) {
      const o = this.tick(nodes);
      if (o.isEqual(nodes)) {
        let count = 0;
        for (const { i } of nodes) {
          if (i == Cabin.SeatOccupied) count++;
        }
        return count;
      }
      nodes = o;
    }

    return -1;
  }

  partB(input: Grid): number {
    let grid = input;
    for (let i = 0; i < 1000; i++) {
      const o = grid.clone();
      let changes = false;
      for (const { x, y, i } of grid) {
        if (i == Cabin.Floor) continue;

        let count = 0;
        for (const dir of Grid.Dirs) {
          for (const it of grid.iterate(x, y, dir.x, dir.y)) {
            if (it.i == null) break;
            else if (it.i == Cabin.Floor) continue;
            else if (it.i == Cabin.SeatEmpty) break;
            else if (it.i == Cabin.SeatOccupied) {
              count++;
              break;
            }
          }
        }
        if (i == Cabin.SeatEmpty && count == 0) {
          changes = true;
          o.set(x, y, Cabin.SeatOccupied);
        } else if (i == Cabin.SeatOccupied && count > 4) {
          changes = true;
          o.set(x, y, Cabin.SeatEmpty);
        }
      }

      if (changes == false) {
        let count = 0;
        for (const { i } of grid) if (i == Cabin.SeatOccupied) count++;
        return count;
      }

      grid = o;
    }

    return -1;
  }
}

const aoc2020Day11 = new AoC2020Day11();

aoc2020Day11.test((o) => {
  const start = aoc2020Day11.parse(
    `L.LL.LL.LL\nLLLLLLL.LL\nL.L.L..L..\nLLLL.LL.LL\nL.LL.LL.LL\nL.LLLLL.LL\n..L.L.....\nLLLLLLLLLL\nL.LLLLLL.L\nL.LLLLL.LL`,
  );
  const tick1 = aoc2020Day11.parse(
    `#.##.##.##\n#######.##\n#.#.#..#..\n####.##.##\n#.##.##.##\n#.#####.##\n..#.#.....\n##########\n#.######.#\n#.#####.##`,
  );
  const tick2 = aoc2020Day11.parse(
    `#.LL.L#.##\n#LLLLLL.L#\nL.L.L..L..\n#LLL.LL.L#\n#.LL.LL.LL\n#.LLLL#.##\n..L.L.....\n#LLLLLLLL#\n#.LLLLLL.L\n#.#LLLL.##`,
  );
  const tick3 = aoc2020Day11.parse(
    `#.##.L#.##\n#L###LL.L#\nL.#.#..#..\n#L##.##.L#\n#.##.LL.LL\n#.###L#.##\n..#.#.....\n#L######L#\n#.LL###L.L\n#.#L###.##`,
  );
  o('tick', () => {
    o(aoc2020Day11.tick(start).toString()).deepEquals(tick1.toString());
    o(aoc2020Day11.tick(tick1).toString()).deepEquals(tick2.toString());
    o(aoc2020Day11.tick(tick2).toString()).deepEquals(tick3.toString());
    o(aoc2020Day11.partA(start)).equals(37);
  });
  o('tickLine', () => {
    o(aoc2020Day11.partB(start)).equals(26);
  });
});
