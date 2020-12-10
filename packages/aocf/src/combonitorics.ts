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

function swap<T>(arr: T[], i: number, j: number) {
  if (i >= arr.length || j >= arr.length) throw new Error('Swap out of bounds');
  const temp = arr[j];
  arr[j] = arr[i];
  arr[i] = temp;
  return arr;
}

export function minMax<T>(t: T[], fn: (t: T) => number): { min: T; max: T } {
  if (t.length == 0) throw new Error('No items to min/max');
  const startVal = fn(t[0]);
  let min = startVal;
  let max = startVal;
  let minItem: T = t[0];
  let maxItem: T = t[0];

  for (const o of t) {
    const val = fn(o);
    if (val > max) {
      max = val;
      maxItem = o;
    }
    if (val < min) {
      min = val;
      minItem = o;
    }
  }

  return { min: minItem, max: maxItem };
}
