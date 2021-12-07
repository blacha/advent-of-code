export function* permutations<T>(arr: T[] | Set<T>): Generator<T[]> {
  if (arr instanceof Set) return yield* heaps([...arr.values()], 0, arr.size);
  yield* heaps(arr.slice(), 0, arr.length);
}

function* heaps<T>(arr: T[], index: number, size: number): Generator<T[]> {
  if (index === size) return yield arr;

  for (let j = index; j < size; j++) {
    swap(arr, index, j);
    yield* heaps(arr, index + 1, size);
    swap(arr, index, j);
  }
}

function swap<T>(arr: T[], i: number, j: number): T[] {
  if (i >= arr.length || j >= arr.length) throw new Error('Swap out of bounds');
  const temp = arr[j];
  arr[j] = arr[i];
  arr[i] = temp;
  return arr;
}
