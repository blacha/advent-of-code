import o from 'ospec';
import { countValidPasswordsA, countValidPasswordsB, Day2TestInput, parseInput } from '.';
import { Day2Input } from './input';

o.spec('2020:02', () => {
  o('should parse input', () => {
    o(parseInput(Day2TestInput)).deepEquals([
      { min: 1, max: 3, char: 'a', pass: 'abcde' },
      { min: 1, max: 3, char: 'b', pass: 'cdefg' },
      { min: 2, max: 9, char: 'c', pass: 'ccccccccc' },
    ]);
  });

  o('should validate test data', () => {
    o(countValidPasswordsA(parseInput(Day2TestInput))).equals(2);
    o(countValidPasswordsB(parseInput(Day2TestInput))).equals(1);
  });

  o('Answer', () => {
    const parsedData = parseInput(Day2Input);
    console.log('');
    console.time('2020:02');
    console.log('2020:02.Question#1', countValidPasswordsA(parsedData));
    console.log('2020:02.Question#2', countValidPasswordsB(parsedData));
    console.timeEnd('2020:02');
  });
});
