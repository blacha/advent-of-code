import { AoC, Grid } from 'aocf';

export enum Cabin {
  Floor = '.',
  SeatEmpty = 'L',
  SeatOccupied = '#',
}

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

  partA(input: Grid): number {
    let grid = input;
    for (let i = 0; i < 1000; i++) {
      const output = grid.clone();
      for (const { x, y, i } of grid) {
        if (i == Cabin.Floor) continue;

        let count = 0;
        for (const d of Grid.Around) {
          count += grid.get(x + d.x, y + d.y) == Cabin.SeatOccupied ? 1 : 0;
        }

        if (i == Cabin.SeatEmpty && count == 0) {
          output.set(x, y, Cabin.SeatOccupied);
        } else if (i == Cabin.SeatOccupied && count > 3) {
          output.set(x, y, Cabin.SeatEmpty);
        }
      }

      if (output.hasChanges == false) {
        let count = 0;
        for (const i of grid.values()) if (i == Cabin.SeatOccupied) count++;
        return count;
      }
      grid = output;
    }

    return -1;
  }

  partB(input: Grid): number {
    let grid = input;
    for (let i = 0; i < 1000; i++) {
      const o = grid.clone();
      for (const { x, y, i } of grid) {
        if (i == Cabin.Floor) continue;

        let count = 0;
        for (const dir of Grid.Around) {
          let cx = x;
          let cy = y;
          let it;
          do {
            cx = cx + dir.x;
            cy = cy + dir.y;
            it = grid.get(cx, cy);
            if (it == Cabin.SeatEmpty) break;
            if (it == Cabin.SeatOccupied) {
              count++;
              break;
            }
          } while (it != null);
        }

        if (i == Cabin.SeatEmpty && count == 0) {
          o.set(x, y, Cabin.SeatOccupied);
        } else if (i == Cabin.SeatOccupied && count > 4) {
          o.set(x, y, Cabin.SeatEmpty);
        }
      }

      if (o.hasChanges == false) {
        let count = 0;
        for (const i of grid.values()) if (i == Cabin.SeatOccupied) count++;
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

  o('partA', () => {
    o(aoc2020Day11.partA(start)).equals(37);
  });
  o('partB', () => {
    o(aoc2020Day11.partB(start)).equals(26);
  });
});
