import o from 'ospec';
import { findSum, threeFor2020, twoFor2020 } from '.';
import { Day1Input } from './input';

o.spec('Day1', () => {
  const testValues = [1721, 979, 366, 299, 675, 1456];

  o('twoFor2020', () => {
    o(twoFor2020(testValues)).equals(514579);
    o(findSum(testValues, 2, 2020)).equals(514579);
    o(twoFor2020(Day1Input)).equals(1003971);
  });
  o('threeFor2020', () => {
    o(threeFor2020(testValues)).equals(241861950);
    o(threeFor2020(Day1Input)).equals(84035952);
  });

  o('Answer', () => {
    console.log('');
    console.time('2020:Day1');
    console.log('2020:Day1.Question#1', twoFor2020(Day1Input), findSum(Day1Input, 2, 2020));
    console.log('2020:Day1.Question#2', threeFor2020(Day1Input), findSum(Day1Input, 3, 2020));
    console.timeEnd('2020:Day1');
  });
});
