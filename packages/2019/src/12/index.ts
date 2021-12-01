export class Vector {
  static PadCount = 2;

  x: number;
  y: number;
  z: number;
  static p(x: number) {
    return String(x).padStart(Vector.PadCount, ' ');
  }

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  get asbTotal(): number {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }

  clone(): Vector {
    return new Vector(this.x, this.y, this.z);
  }

  toString(): string {
    return `<x=${Vector.p(this.x)}, y=${Vector.p(this.y)}, z=${Vector.p(this.z)}>`;
  }
}
export class Moon {
  static Id = 0;
  id = Moon.Id++;
  position: Vector;
  velocity: Vector = new Vector(0, 0, 0);
  constructor(position: Vector) {
    this.position = position;
  }

  static getVelocity(offsetA: number, offsetB: number): number {
    if (offsetA == offsetB) {
      return 0;
    }
    if (offsetA < offsetB) {
      return 1;
    }
    return -1;
  }
  gravity(otherMoon: Moon): void {
    this.velocity.x += Moon.getVelocity(this.position.x, otherMoon.position.x);
    this.velocity.y += Moon.getVelocity(this.position.y, otherMoon.position.y);
    this.velocity.z += Moon.getVelocity(this.position.z, otherMoon.position.z);
  }

  move(): void {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.position.z += this.velocity.z;
  }

  get potential(): number {
    return this.position.asbTotal;
  }
  get kinetic(): number {
    return this.velocity.asbTotal;
  }

  get energy(): number {
    return this.potential * this.kinetic;
  }

  toString(): string {
    return `pos=${this.position.toString()}, vel=${this.velocity.toString()}`;
  }
}

function gcd(a: number, b: number): number {
  if (b == 0) {
    return a;
  }
  return gcd(b, a % b);
}

function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

export class Scanner {
  static PadCount = 2;
  moons: Moon[] = [];
  count = 0;

  initial: Moon[];
  constructor(moons: Vector[]) {
    this.initial = moons.map((c) => new Moon(c));
    this.moons = moons.map((c) => new Moon(c.clone()));
  }

  step(): void {
    this.count++;
    for (const moon of this.moons) {
      for (const otherMoon of this.moons) {
        if (moon.id == otherMoon.id) {
          continue;
        }
        moon.gravity(otherMoon);
      }
    }
    for (const moon of this.moons) {
      moon.move();
    }
  }

  findDupe(): number {
    const xDupe = this.simAxis('x');
    const yDupe = this.simAxis('y');
    const zDupe = this.simAxis('z');
    return lcm(xDupe, lcm(yDupe, zDupe));
  }

  private hashAxis(axis: 'x' | 'y' | 'z'): string {
    return this.moons.map((c) => c.position[axis] + '_' + c.velocity[axis]).join('');
  }

  private simAxis(axis: 'x' | 'y' | 'z'): number {
    const states = new Map<string, number>();
    let count = 0;
    while (1) {
      const hash = this.hashAxis(axis);
      if (states.has(hash)) {
        this.reset();
        return count;
      }
      states.set(hash, count);
      this.step();
      count++;
    }
    throw new Error('Dead');
  }

  reset() {
    this.moons = this.initial.map((c) => new Moon(c.position.clone()));
    this.count = 0;
  }

  get energy(): number {
    let total = 0;
    for (const moon of this.moons) {
      total += moon.energy;
    }
    return total;
  }

  print(): void {
    console.log(`After ${this.count} steps:`);
    this.moons.forEach((m) => console.log(m.toString()));
  }
}
