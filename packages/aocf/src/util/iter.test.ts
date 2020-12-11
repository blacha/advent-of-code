import 'source-map-support/register';
import o from 'ospec';
import { Iter } from './iter';

o.spec('Iter', () => {
  const items = [90, 1, 2, 3, 4];
  const set = new Set(items);
  const map = new Map<string, number>();
  for (const i of items) map.set(i.toString(), i);

  o.spec('MinMax', () => {
    o('should min/max numbers', () => {
      const { min, max } = Iter.minMax(items, (s) => s);
      o(min).equals(1);
      o(max).equals(90);
    });

    o('should min/max sets', () => {
      const { min, max } = Iter.minMax(set, (s) => s);
      o(min).equals(1);
      o(max).equals(90);
    });

    o('should min/max maps', () => {
      const { min, max } = Iter.minMax(map, (s) => s);
      o(min).equals(1);
      o(max).equals(90);
    });

    const objects = [{ a: 1 }, { a: 5 }, { a: -1 }];
    o('should min/max objects', () => {
      const { min, max } = Iter.minMax(objects, (s) => s.a);
      o(min.a).equals(-1);
      o(max.a).equals(5);
    });
  });

  o('size', () => {
    o(Iter.size(items)).equals(5);
    o(Iter.size(set)).equals(5);
    o(Iter.size(map)).equals(5);
  });
});
