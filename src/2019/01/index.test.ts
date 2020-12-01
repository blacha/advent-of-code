import o from 'ospec';
import { getFuel, getFuelOfFuel } from './index';
import { InputDayOne } from './input';

o.spec('2019:Day01', () => {
  o('getFuel', () => {
    o(getFuel(12)).equals(2);
    o(getFuel(14)).equals(2);
    o(getFuel(1969)).equals(654);
    o(getFuel(100756)).equals(33583);
  });

  o('getFuelOfFuel', () => {
    o(getFuelOfFuel(12)).equals(14);
    o(getFuelOfFuel(getFuel(1969))).equals(966);
    o(getFuelOfFuel(getFuel(100756))).equals(50346);
  });
  o('Answer', () => {
    const lines = InputDayOne.trim()
      .split('\n')
      .map((f: string) => parseInt(f, 10));
    let total = 0;
    let fuelOfFuel = 0;
    for (const line of lines) {
      if (isNaN(line)) {
        break;
      }
      const fuel = getFuel(line);
      total += getFuel(line);
      fuelOfFuel += getFuelOfFuel(fuel);
    }

    console.log('');
    console.log('2019:01.Question#1', total);
    console.log('2019:01.Question#2', fuelOfFuel);
  });
});
