export function findSum(values: number[], numbersToUse: number, numberToFind: number, startOffset = 0): number {
  const numberSize = values.length;
  for (let i = startOffset; i < numberSize; i++) {
    const value = values[i];
    if (numbersToUse == 1) {
      if (value == numberToFind) return numberToFind;
      continue;
    }
    const nextNumber = numberToFind - value;
    if (nextNumber < 0) continue;
    const res = findSum(values, numbersToUse - 1, nextNumber, i + 1);
    if (res > 0) return res * value;
  }
  return -1;
}

export function twoFor2020(values: number[]): number {
  return findSum(values, 2, 2020);
}

export function threeFor2020(values: number[]): number {
  return findSum(values, 3, 2020);
}
