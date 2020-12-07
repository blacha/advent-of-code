import { AoC, toNumberArray } from 'aocf';
import { Grid } from './shared/grid';

export class AoC2019Day3 extends AoC<string> {
  constructor() {
    super(2019, 3);
  }

  partA(input: string): number {
    const g = new Grid(input);
    return g.getHits().total;
  }
  partB(input: string): number {
    const g = new Grid(input);
    return g.getBySum().sum;
  }
}

const aoc2019day3 = new AoC2019Day3();
aoc2019day3.test((o) => {
  o('RunCodes', () => {
    const g = new Grid(`R8,U5,L5,D3\nU7,R6,D4,L4`);
    const hits = g.getHits();
    o(hits.sum).equals(40);
    o(hits.total).equals(6);
    o(hits.key).equals('3:-3');
    const sum = g.getBySum();
    o(sum.sum).equals(30);
    o(sum.total).equals(11);
    o(sum.key).equals('6:-5');
  });

  o('RunCodes#2', () => {
    const g = new Grid(`R75,D30,R83,U83,L12,D49,R71,U7,L72\nU62,R66,U55,R34,D71,R55,D58,R83`);
    const hits = g.getHits();
    o(hits.sum).equals(726);
    o(hits.total).equals(159);
    o(hits.key).equals('155:-4');
    const sum = g.getBySum();
    o(sum.sum).equals(610);
    o(sum.total).equals(170);
    o(sum.key).equals('158:12');
  });
});
