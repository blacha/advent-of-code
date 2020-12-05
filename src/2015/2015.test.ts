import { day1 } from './01';
import { day2 } from './02';
import { day3 } from './03';

day1.test((o) => {
  o('simple tests', () => {
    o(day1.partA('(())')).equals(0);
  });
});

day2.test((o) => {
  o('should calculate', () => {
    o(day2.partA([[2, 3, 4]])).equals(58);
    o(day2.partA([[1, 1, 10]])).equals(43);

    o(day2.partB([[2, 3, 4]])).equals(34);
    o(day2.partB([[1, 1, 10]])).equals(14);
  });
});

day3.test((o) => {
  o('should deliver', () => {
    o(day3.partA('>')).equals(2);
    o(day3.partA('^>v<')).equals(4);
    o(day3.partA('^v^v^v^v^v')).equals(2);
  });
  o('should robo deliver', () => {
    o(day3.partB('^v')).equals(3);
    o(day3.partB('^>v<')).equals(3);
    o(day3.partB('^v^v^v^v^v')).equals(11);
  });
});
