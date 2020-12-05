import o from 'ospec';
import { aoc2020day1 } from '.';

aoc2020day1.test(() => {
  const testValues = [1721, 979, 366, 299, 675, 1456];

  o('twoFor2020', async () => {
    o(await aoc2020day1.partA(testValues)).equals(514579);
    o(await aoc2020day1.solutionA()).equals(1003971);
  });

  o('threeFor2020', async () => {
    o(await aoc2020day1.partB(testValues)).equals(241861950);
    o(await aoc2020day1.solutionB()).equals(84035952);
  });
});
