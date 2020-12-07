import o from 'ospec';
import { Tree } from '.';
import { Day6Input } from './input';

o.spec('2019:Day06', () => {
  o('should do first example', () => {
    const Orbits = Tree.build(`COM)B\nB)C\nC)D\nD)E\nE)F\nB)G\nG)H\nD)I\nE)J\nJ)K\nK)L`.split('\n'));
    o(Orbits.getOrbits()).equals(42);
  });
  o('should make path', () => {
    const orbitB = Tree.build(`COM)B\nB)C\nC)D\nD)E\nE)F\nB)G\nG)H\nD)I\nE)J\nJ)K\nK)L\nK)YOU\nI)SAN`.split('\n'));
    o(orbitB.path('YOU', 'SAN')).equals(4);
  });

  o('Answer', () => {
    const tree = Tree.build(Day6Input);

    console.log();
    console.log('2020:06.Question#1', tree.getOrbits());
    console.log('2020:06.Question#2', tree.path('YOU', 'SAN'));
  });
});
