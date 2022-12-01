import { AoC } from './aoc.js';
import { AoCData } from './aoc.data.js';

const currentYear = new Date().getUTCFullYear() - 1;
const currentDay = new Date().getUTCDate();

console.log(currentYear, currentDay);

const currentPuzzle = AoC.create(currentYear, currentDay);

async function main(): Promise<void> {
  while (!currentPuzzle.isUnlocked) {
    if (currentPuzzle.isUnlocked) {
    }
    console.log(
      'Unlocks in',
      currentPuzzle.isUnlocked,
      ((currentPuzzle.unlockDate.getTime() - Date.now()) / 1000 / 60).toFixed(2) + ' mins',
    );
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  console.log(currentPuzzle.id, 'Checking data exists');
  const val = await AoCData.fetch(currentPuzzle);
  console.log(currentPuzzle.id, 'Puzzle input length', val.input.length);
}

main();
