import o from 'ospec';
import { Iter } from './iter.js';

o.spec('Iter', () => {
  const items = [90, 1, 2, 3, 4];
  const set = new Set(items);
  const map = new Map<string, number>();
  for (const i of items) map.set(i.toString(), i);

  o.spec('stats', () => {
    o('should min/max numbers', () => {
      const mm = Iter.stats(items);
      o(mm.min.v).equals(1);
      o(mm.max.v).equals(90);
    });

    o('should min/max sets', () => {
      const mm = Iter.stats(set);
      o(mm.min.v).equals(1);
      o(mm.max.v).equals(90);
    });

    o('should min/max maps', () => {
      const mm = Iter.stats(map);
      o(mm.min.v).equals(1);
      o(mm.max.v).equals(90);
    });

    const objects = [{ a: 1 }, { a: 5 }, { a: -1 }];
    o('should min/max objects', () => {
      const mm = Iter.stats(objects, (s) => s.a);
      o(mm.min.item.a).equals(-1);
      o(mm.max.item.a).equals(5);
    });
  });

  o('size', () => {
    o(Iter.size(items)).equals(5);
    o(Iter.size(set)).equals(5);
    o(Iter.size(map)).equals(5);
  });
});
