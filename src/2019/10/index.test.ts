import 'source-map-support/register';

import o from 'ospec';
import { Sensors } from './index';

o.spec('2019:Day10', () => {
  o('should do first example', () => {
    const sensors = Sensors.scan(
      `.#..#
            .....
            #####
            ....#
            ...##`,
    );
    o(sensors.count).equals(8);
    o(sensors.asteroid.x).equals(3);
    o(sensors.asteroid.y).equals(4);
  });

  o('should do second example', () => {
    const sensors = Sensors.scan(
      `......#.#.
            #..#.#....
            ..#######.
            .#.#.###..
            .#..#.....
            ..#....#.#
            #..#....#.
            .##.#..###
            ##...#..#.
            .#....####`,
    );
    o(sensors.count).equals(33);
    o(sensors.asteroid.x).equals(5);
    o(sensors.asteroid.y).equals(8);
  });

  o('should do third example', () => {
    const sensors = Sensors.scan(
      `#.#...#.#.
            .###....#.
            .#....#...
            ##.#.#.#.#
            ....#.#.#.
            .##..###.#
            ..#...##..
            ..##....##
            ......#...
            .####.###.`,
    );
    o(sensors.count).equals(35);
    o(sensors.asteroid.x).equals(1);
    o(sensors.asteroid.y).equals(2);
  });
  o('should do forth example', () => {
    const sensors = Sensors.scan(
      `.#..#..###
            ####.###.#
            ....###.#.
            ..###.##.#
            ##.##.#.#.
            ....###..#
            ..#.#..#.#
            #..#.#.###
            .##...##.#
            .....#.#..`,
    );
    o(sensors.count).equals(41);
    o(sensors.asteroid.x).equals(6);
    o(sensors.asteroid.y).equals(3);
  });

  o('should do fifth example', () => {
    const sensors = Sensors.scan(
      `#.#...#.#.
            .###....#.
            .#....#...
            ##.#.#.#.#
            ....#.#.#.
            .##..###.#
            ..#...##..
            ..##....##
            ......#...
            .####.###.`,
    );
    o(sensors.count).equals(35);
    o(sensors.asteroid.x).equals(1);
    o(sensors.asteroid.y).equals(2);
  });
  o('should do sixth example', () => {
    const sensors = Sensors.scan(
      `.#..##.###...#######
            ##.############..##.
            .#.######.########.#
            .###.#######.####.#.
            #####.##.#.##.###.##
            ..#####..#.#########
            ####################
            #.####....###.#.#.##
            ##.#################
            #####.##.###..####..
            ..######..##.#######
            ####.##.####...##..#
            .#####..#.######.###
            ##...#.##########...
            #.##########.#######
            .####.#.###.###.#.##
            ....##.##.###..#####
            .#.#.###########.###
            #.#.#.#####.####.###
            ###.##.####.##.#..##`,
    );
    o(sensors.count).equals(210);
    o(sensors.asteroid.x).equals(11);
    o(sensors.asteroid.y).equals(13);
  });

  o('should do first destroy', () => {
    const sensors = new Sensors(`.#..##.###...#######
            ##.############..##.
            .#.######.########.#
            .###.#######.####.#.
            #####.##.#.##.###.##
            ..#####..#.#########
            ####################
            #.####....###.#.#.##
            ##.#################
            #####.##.###..####..
            ..######..##.#######
            ####.##.####...##..#
            .#####..#.######.###
            ##...#.##########...
            #.##########.#######
            .####.#.###.###.#.##
            ....##.##.###..#####
            .#.#.###########.###
            #.#.#.#####.####.###
            ###.##.####.##.#..##`);

    const source = sensors.get(11, 13);
    o(sensors.destroy(source, 1).point).deepEquals({ x: 11, y: 12 });
    o(sensors.destroy(source, 2).point).deepEquals({ x: 12, y: 1 });
    o(sensors.destroy(source, 3).point).deepEquals({ x: 12, y: 2 });
    o(sensors.destroy(source, 10).point).deepEquals({ x: 12, y: 8 });
    o(sensors.destroy(source, 20).point).deepEquals({ x: 16, y: 0 });
    o(sensors.destroy(source, 50).point).deepEquals({ x: 16, y: 9 });
    o(sensors.destroy(source, 100).point).deepEquals({ x: 10, y: 16 });
    o(sensors.destroy(source, 199).point).deepEquals({ x: 9, y: 6 });
    o(sensors.destroy(source, 200).point).deepEquals({ x: 8, y: 2 });
    o(sensors.destroy(source, 201).point).deepEquals({ x: 10, y: 9 });
    o(sensors.destroy(source, 299).point).deepEquals({ x: 11, y: 1 });
  });

  o('Answers', () => {
    const base = new Sensors(
      `#...##.####.#.......#.##..##.#.
            #.##.#..#..#...##..##.##.#.....
            #..#####.#......#..#....#.###.#
            ...#.#.#...#..#.....#..#..#.#..
            .#.....##..#...#..#.#...##.....
            ##.....#..........##..#......##
            .##..##.#.#....##..##.......#..
            #.##.##....###..#...##...##....
            ##.#.#............##..#...##..#
            ###..##.###.....#.##...####....
            ...##..#...##...##..#.#..#...#.
            ..#.#.##.#.#.#####.#....####.#.
            #......###.##....#...#...#...##
            .....#...#.#.#.#....#...#......
            #..#.#.#..#....#..#...#..#..##.
            #.....#..##.....#...###..#..#.#
            .....####.#..#...##..#..#..#..#
            ..#.....#.#........#.#.##..####
            .#.....##..#.##.....#...###....
            ###.###....#..#..#.....#####...
            #..##.##..##.#.#....#.#......#.
            .#....#.##..#.#.#.......##.....
            ##.##...#...#....###.#....#....
            .....#.######.#.#..#..#.#.....#
            .#..#.##.#....#.##..#.#...##..#
            .##.###..#..#..#.###...#####.#.
            #...#...........#.....#.......#
            #....##.#.#..##...#..####...#..
            #.####......#####.....#.##..#..
            .#...#....#...##..##.#.#......#
            #..###.....##.#.......#.##...##`,
    );

    console.log();
    const scan = base.scan();
    console.log('2019:10.Question#1', scan.count);
    o(scan.count).equals(288);

    const destroyed = base.destroy(scan.asteroid, 200);
    console.log('2019:10.Question#2', destroyed.x * 100 + destroyed.y);
    o(base.scan().count).equals(288);
  });
});
