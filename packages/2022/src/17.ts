import { AoC, Colors, Point } from 'aocf';

export type LeftRightJet = '<' | '>';
export type Input = ('<' | '>')[];

const aoc = AoC.create<Input>(2022, 17);

aoc.parse = (l: string): Input => {
  return l.trim().split('') as LeftRightJet[];
};

const Pieces = [
  [[1, 1, 1, 1]],
  [
    [null, 1, null],
    [1, 1, 1],
    [null, 1, null],
  ],
  [
    [null, null, 1],
    [null, null, 1],
    [1, 1, 1],
  ],
  [[1], [1], [1], [1]],
  [
    [1, 1],
    [1, 1],
  ],
];

// ];

export function print(gIn: number[][], current?: Piece | null): void {
  const grid = current == null ? gIn : gIn.map((c) => c.slice());
  // const grid = gIn.map((c) => c.slice());
  if (current) setPiece(current.piece, current.x, current.y, grid, 2);
  for (let i = grid.length - 1; i >= 0; i--) {
    const row = grid[i]
      .map((c) => {
        switch (c) {
          case 1:
            return Colors.White;
          case 2:
            return Colors.Yellow;
          case 0:
            return Colors.Black;
          default:
            throw new Error('Unknown Color');
        }
      })
      .join('');
    console.log(row);
  }
}

export enum Intersects {
  Wall,
  Rock,
}

function setPiece(piece: number, aX: number, aY: number, grid: number[][], color = 1): void {
  const p = Pieces[piece];
  for (let y = p.length - 1; y >= 0; y--) {
    const row = p[y];
    const targetY = p.length - y + aY - 1;
    if (grid[targetY] == null) continue;
    for (let x = 0; x < row.length; x++) {
      if (row[x] == null) continue;
      const targetX = x + aX;
      grid[targetY][targetX] = color;
    }
  }
}

function intersects(piece: number, aX: number, aY: number, grid: number[][]): Intersects | null {
  const p = Pieces[piece];
  for (let y = p.length - 1; y >= 0; y--) {
    const row = p[y];
    const targetY = p.length - y + aY - 1;
    if (grid[targetY] == null) continue;
    for (let x = 0; x < row.length; x++) {
      if (row[x] == null) continue;
      const targetX = x + aX;
      if (targetX < 0 || targetX > 7) return Intersects.Wall;
      if (grid[targetY][targetX] != 0) return Intersects.Rock;
    }
  }
  return null;
}

export type Piece = { piece: number } & Point;
aoc.partA = (input: Input): number => {
  let nextPiece = 0;
  let pieceCount = 0;
  let current: null | Piece = null;

  const grid: number[][] = [[1, 1, 1, 1, 1, 1, 1]];
  let maxY = 1;
  for (let i = 0; i < 100000; i++) {
    if (pieceCount === 2022) return maxY - 1;
    if (current == null) {
      const pieceY = maxY + 3;
      while (grid.length <= pieceY) grid.push(Array.from({ length: 7 }, () => 0));

      current = { piece: nextPiece, y: grid.length - 1, x: 2 };
      nextPiece = (nextPiece + 1) % Pieces.length;
    }

    const action = input[i % input.length];
    const dX = action == '>' ? 1 : -1;
    if (intersects(current.piece, current.x + dX, current.y, grid) == null) {
      current.x += dX;
    }

    if (intersects(current.piece, current.x, current.y - 1, grid) == null) {
      current.y -= 1;
    } else {
      setPiece(current.piece, current.x, current.y, grid);
      maxY = current.y + Pieces[current.piece].length;
      current = null;
      pieceCount++;
    }
  }
  return pieceCount;
};

function createHeightMap(grid: number[][]): number[] {
  const output: number[] = [];
  for (let i = 0; i < grid[0].length; i++) {
    for (let y = grid.length - 1; y >= 0; y--) {
      if (grid[y][i] == 1) {
        output.push(grid.length - 1 - y);
        break;
      }
    }
  }
  return output;
}

aoc.partB = (input: Input): number => {
  let nextPiece = 0;
  let pieceCount = 0;
  let current: null | (Piece & { sY: number }) = null;

  const grid: number[][] = [[1, 1, 1, 1, 1, 1, 1]];
  let maxY = 1;

  const seen = new Map<string, { i: number; maxY: number; pieceCount: number }>();
  let virtualY = 0;

  for (let i = 0; i < 100_000; i++) {
    if (pieceCount === 1000000000000) return virtualY + maxY - 1;
    if (current == null) {
      const actionId = i % input.length;
      const pieceId = nextPiece;
      const view = createHeightMap(grid);
      const id = [actionId, pieceId, view].join('__');
      const old = seen.get(id);
      if (old != null) {
        const pieceDiff = pieceCount - old.pieceCount;
        const yDiff = maxY - old.maxY;
        const loops = Math.floor((1000000000000 - pieceCount) / pieceDiff);
        pieceCount = pieceCount + loops * pieceDiff;
        virtualY = loops * yDiff;
        seen.clear();
      } else {
        seen.set(id, { i, maxY, pieceCount });
      }
      const pieceY = maxY + 3;
      while (grid.length <= pieceY) grid.push(Array.from({ length: 7 }, () => 0));

      current = { piece: nextPiece, y: grid.length - 1, x: 2, sY: grid.length - 1 };
      nextPiece = (nextPiece + 1) % Pieces.length;
    }

    const action = input[i % input.length];
    const dX = action == '>' ? 1 : -1;
    if (intersects(current.piece, current.x + dX, current.y, grid) == null) {
      current.x += dX;
    }

    if (intersects(current.piece, current.x, current.y - 1, grid) == null) {
      current.y -= 1;
    } else {
      setPiece(current.piece, current.x, current.y, grid);
      maxY = current.y + Pieces[current.piece].length;
      current = null;
      pieceCount++;
    }
  }
  return pieceCount;
};

const testValues = `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`.trim();

aoc.test((o) => {
  o('partA', () => {
    o(aoc.answers(testValues).a).equals(3068);
  });

  o('partB', () => {
    o(aoc.answers(testValues).b).equals(1514285714288);
  });
});
