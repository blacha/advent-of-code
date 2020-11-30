import 'source-map-support/register';

import o from 'ospec';
import { Scanner, Vector, Moon } from './index';

o.spec('Day12', () => {
  o('should do first example', () => {
    Vector.PadCount = 2;
    const scanner = new Scanner([
      new Vector(-1, 0, 2),
      new Vector(2, -10, -7),
      new Vector(4, -8, 8),
      new Vector(3, 5, -1),
    ]);

    o(scanner.moons[0].toString()).equals(`pos=<x=-1, y= 0, z= 2>, vel=<x= 0, y= 0, z= 0>`);
    o(scanner.moons[1].toString()).equals(`pos=<x= 2, y=-10, z=-7>, vel=<x= 0, y= 0, z= 0>`);
    o(scanner.moons[2].toString()).equals(`pos=<x= 4, y=-8, z= 8>, vel=<x= 0, y= 0, z= 0>`);
    o(scanner.moons[3].toString()).equals(`pos=<x= 3, y= 5, z=-1>, vel=<x= 0, y= 0, z= 0>`);

    scanner.step();
    o(scanner.moons[0].toString()).equals(`pos=<x= 2, y=-1, z= 1>, vel=<x= 3, y=-1, z=-1>`);
    o(scanner.moons[1].toString()).equals(`pos=<x= 3, y=-7, z=-4>, vel=<x= 1, y= 3, z= 3>`);
    o(scanner.moons[2].toString()).equals(`pos=<x= 1, y=-7, z= 5>, vel=<x=-3, y= 1, z=-3>`);
    o(scanner.moons[3].toString()).equals(`pos=<x= 2, y= 2, z= 0>, vel=<x=-1, y=-3, z= 1>`);

    scanner.step();
    o(scanner.moons[0].toString()).equals(`pos=<x= 5, y=-3, z=-1>, vel=<x= 3, y=-2, z=-2>`);
    o(scanner.moons[1].toString()).equals(`pos=<x= 1, y=-2, z= 2>, vel=<x=-2, y= 5, z= 6>`);
    o(scanner.moons[2].toString()).equals(`pos=<x= 1, y=-4, z=-1>, vel=<x= 0, y= 3, z=-6>`);
    o(scanner.moons[3].toString()).equals(`pos=<x= 1, y=-4, z= 2>, vel=<x=-1, y=-6, z= 2>`);

    scanner.step();
    o(scanner.moons[0].toString()).equals(`pos=<x= 5, y=-6, z=-1>, vel=<x= 0, y=-3, z= 0>`);
    o(scanner.moons[1].toString()).equals(`pos=<x= 0, y= 0, z= 6>, vel=<x=-1, y= 2, z= 4>`);
    o(scanner.moons[2].toString()).equals(`pos=<x= 2, y= 1, z=-5>, vel=<x= 1, y= 5, z=-4>`);
    o(scanner.moons[3].toString()).equals(`pos=<x= 1, y=-8, z= 2>, vel=<x= 0, y=-4, z= 0>`);
  });

  o('should do energy example', () => {
    const scanner = new Scanner([
      new Vector(-1, 0, 2),
      new Vector(2, -10, -7),
      new Vector(4, -8, 8),
      new Vector(3, 5, -1),
    ]);

    while (scanner.count < 10) {
      scanner.step();
    }
    o(scanner.energy).equals(179);
  });

  o('should do third example', () => {
    Vector.PadCount = 3;

    const scanner = new Scanner([
      new Vector(-8, -10, 0),
      new Vector(5, 5, 10),
      new Vector(2, -7, 3),
      new Vector(9, -8, -3),
    ]);

    o(scanner.moons[0].toString()).equals(`pos=<x= -8, y=-10, z=  0>, vel=<x=  0, y=  0, z=  0>`);
    o(scanner.moons[1].toString()).equals(`pos=<x=  5, y=  5, z= 10>, vel=<x=  0, y=  0, z=  0>`);
    o(scanner.moons[2].toString()).equals(`pos=<x=  2, y= -7, z=  3>, vel=<x=  0, y=  0, z=  0>`);
    o(scanner.moons[3].toString()).equals(`pos=<x=  9, y= -8, z= -3>, vel=<x=  0, y=  0, z=  0>`);
    while (scanner.count < 100) {
      scanner.step();
    }
    o(scanner.energy).equals(1940);
  });

  o('should make a loop', () => {
    const scanner = new Scanner([
      new Vector(-1, 0, 2),
      new Vector(2, -10, -7),
      new Vector(4, -8, 8),
      new Vector(3, 5, -1),
    ]);

    const dupe = scanner.findDupe();
    o(dupe).equals(2772);
  });
  o('should make a big loop', () => {
    const scanner = new Scanner([
      new Vector(-8, -10, 0),
      new Vector(5, 5, 10),
      new Vector(2, -7, 3),
      new Vector(9, -8, -3),
    ]);
    const dupe = scanner.findDupe();
    o(dupe).equals(4686774924);
  });
  o('Answers', () => {
    const scanner = new Scanner([
      new Vector(0, 4, 0),
      new Vector(-10, -6, -14),
      new Vector(9, -16, -3),
      new Vector(6, -1, 2),
    ]);

    while (scanner.count < 1000) {
      scanner.step();
    }

    console.log();
    console.log('Day12.Question#1', scanner.energy);
    scanner.reset();

    const dupe = scanner.findDupe();
    console.log('Day12.Question#2', dupe);
    o(dupe).equals(278013787106916);
  });
});

o.run();
