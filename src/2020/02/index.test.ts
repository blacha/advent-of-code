import o from 'ospec';
import { aoc2020day2 } from '.';

aoc2020day2.test(() => {
  o('should parse input', async () => {
    const data = await aoc2020day2.dataTest;
    o(data).deepEquals([
      { min: 1, max: 3, char: 'a', pass: 'abcde' },
      { min: 1, max: 3, char: 'b', pass: 'cdefg' },
      { min: 2, max: 9, char: 'c', pass: 'ccccccccc' },
    ]);
  });
  o('should validate test data', async () => {
    const data = await aoc2020day2.dataTest;
    o(aoc2020day2.partA(data)).equals(2);
    o(aoc2020day2.partB(data)).equals(1);
  });
});
