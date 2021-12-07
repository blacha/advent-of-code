export type IterUtilType<T> = T[] | Set<T> | Map<any, T>;

export interface IterStats<T> {
  min: { item: T; v: number };
  max: { item: T; v: number };
  total: number;
  average: number;
}

export const Iter = {
  size<T>(t: IterUtilType<T>): number {
    if (Array.isArray(t)) return t.length;
    return t.size;
  },

  *iterate<T>(t: IterUtilType<T>): Generator<T> {
    if (t instanceof Map) for (const y of t.values()) yield y;
    else for (const y of t) yield y;
  },

  first<T>(t: Generator<T> | IterableIterator<T>): T {
    return t.next().value;
  },

  /** Find the min and max items inside of a set of items */
  stats<T>(t: IterUtilType<T>, fn: (t: T) => number = (t: T): number => Number(t)): IterStats<T> {
    const size = Iter.size(t);
    if (Iter.size(t) == 0) throw new Error('No items to stats');
    const it = Iter.iterate(t);
    const first = it.next();
    const startVal = fn(first.value);
    let min = startVal;
    let max = startVal;
    let minItem: T = first.value;
    let maxItem: T = first.value;

    let total = 0;

    for (const o of it) {
      const val = fn(o);
      total += val;
      if (val > max) {
        max = val;
        maxItem = o;
      }
      if (val < min) {
        min = val;
        minItem = o;
      }
    }

    return { min: { item: minItem, v: min }, max: { item: maxItem, v: max }, total, average: total / size };
  },
};
