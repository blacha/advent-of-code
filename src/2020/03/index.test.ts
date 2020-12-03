import o from 'ospec';
import { day3Map, day3Question1, day3Question2 } from '.';

o.spec('2020:03', () => {
  o('Answer', () => {
    console.log('');
    console.time('2020:03');
    console.log('2020:03.Question#1', day3Question1(day3Map));
    console.log('2020:03.Question#2', day3Question2(day3Map));
    console.timeEnd('2020:03');
  });
});
