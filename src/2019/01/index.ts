import 'source-map-support/register';

export function getFuel(input: number): number {
  return Math.floor(input / 3) - 2;
}

export function getFuelOfFuel(input: number, count = 0): number {
  const newFuel = getFuel(input);
  if (newFuel < 0) {
    return input;
  }
  if (count > 10) {
    return newFuel;
  }
  return input + getFuelOfFuel(newFuel, count + 1);
}
