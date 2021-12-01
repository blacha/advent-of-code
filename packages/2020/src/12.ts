import { AoC, Point } from 'aocf';

function rotate(p: { x: number; y: number }, deg: number): void {
  if (deg > 360) deg -= 360;
  if (deg < 0) deg += 360;
  if (deg == 0 || deg == 360) return;

  const y = p.y;
  if (deg == 90) {
    p.y = -1 * p.x;
    p.x = y;
  } else if (deg == 180) {
    p.y = -1 * p.y;
    p.x = -1 * p.x;
  } else if (deg == 270) {
    p.y = p.x;
    p.x = -1 * y;
  } else throw new Error('Weird Rotation');
}
function move(ch: string, p: Point, amount: number): void {
  if (ch == 'N') p.y += amount;
  else if (ch == 'S') p.y -= amount;
  else if (ch == 'E') p.x += amount;
  else if (ch == 'W') p.x -= amount;
  else throw new Error('Weird Move:' + ch);
}

export class AoC2020Day12 extends AoC<string> {
  constructor() {
    super(2020, 12);
  }

  partA(input: string): number {
    const p = { x: 0, y: 0 };
    let direction = 90;
    const lines = input.split('\n');
    for (const l of lines) {
      const amount = Number(l.slice(1));
      const ch = l[0];

      if (ch == 'F') {
        if (direction == 0) p.y += amount;
        else if (direction == 180) p.y -= amount;
        else if (direction == 90) p.x += amount;
        else if (direction == 270) p.x -= amount;
        else throw new Error('Weird Angle: ' + l + ' Angle:' + direction);
      } else if (ch == 'L') direction -= amount;
      else if (ch == 'R') direction += amount;
      else move(ch, p, amount);

      if (direction > 360) direction -= 360;
      if (direction < 0) direction += 360;
      if (direction == 360) direction = 0;
    }
    return Math.abs(p.x) + Math.abs(p.y);
  }

  partB(input: string): number {
    const p = { x: 10, y: 1 };
    const ship = { x: 0, y: 0 };
    const lines = input.split('\n');
    for (const l of lines) {
      const amount = Number(l.slice(1));
      const ch = l[0];
      if (ch == 'F') {
        ship.x += p.x * amount;
        ship.y += p.y * amount;
      } else if (ch == 'L') rotate(p, -amount);
      else if (ch == 'R') rotate(p, amount);
      else move(ch, p, amount);
    }

    return Math.abs(ship.x) + Math.abs(ship.y);
  }
}

const aoc2020Day12 = new AoC2020Day12();

aoc2020Day12.test((o) => {
  const start = `F10\nN3\nF7\nR90\nF11`;
  o('partA', () => {
    o(aoc2020Day12.partA(start)).equals(25);
  });
  o('partB', () => {
    o(aoc2020Day12.partB(start)).equals(286);
  });
});
