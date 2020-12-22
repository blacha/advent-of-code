export type IterUtilType<T> = T[] | Set<T> | Map<any, T>;

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
  minMax<T>(t: IterUtilType<T>, fn: (t: T) => number): { min: T; max: T } {
    if (Iter.size(t) == 0) throw new Error('No items to min/max');
    const it = Iter.iterate(t);
    const first = it.next();
    const startVal = fn(first.value);
    let min = startVal;
    let max = startVal;
    let minItem: T = first.value;
    let maxItem: T = first.value;

    for (const o of it) {
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
  },
};
