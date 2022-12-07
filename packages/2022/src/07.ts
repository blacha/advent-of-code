import { AoC } from 'aocf';
import { cwd } from 'process';

export type Input = Map<string, { files: { name: string; size: number }[]; size: number; path: string }>;

const aoc = AoC.create<Input>(2022, 7);

aoc.parse = (s: string): Input => {
  const folders = new Map<string, { files: { name: string; size: number }[]; size: number; path: string }>();

  let cwd = [];
  for (const line of s.split('\n')) {
    if (line === '$ cd /') {
      cwd = [];
      continue;
    }

    if (line.startsWith('$ cd ')) {
      const target = line.slice('$ cd '.length);
      if (target == '..') {
        cwd.pop();
      } else {
        cwd.push(target);
      }
    } else if (line.startsWith('$ ls')) {
    } else {
      if (line.startsWith('dir')) continue;
      const path = cwd.join('/');

      const f = folders.get(path) ?? { path, files: [], size: 0 };
      folders.set(path, f);

      const firstSpace = line.indexOf(' ');
      const size = Number(line.slice(0, firstSpace));
      const name = line.slice(firstSpace + 1);

      f.size += size;
      f.files.push({ name, size });

      const current = cwd.slice();
      while (current.length > 0) {
        current.pop();
        const target = current.join('/');

        const ff = folders.get(target) ?? { path: target, files: [], size: 0 };
        ff.size += size;
        folders.set(target, ff);
      }
    }
  }

  return folders;
};

aoc.partA = (data: Input): number => {
  let total = 0;

  for (const f of data) {
    if (f[1].size <= 100000) total += f[1].size;
  }

  return total;
};
aoc.partB = (data: Input): number => {
  const totalSize = 70000000;
  const targetSize = 30000000;
  const currentSize = totalSize - (data.get('')?.size ?? 0);

  const fff = [...data.values()];
  fff.sort((a, b) => a.size - b.size);

  for (const f of fff) {
    if (currentSize + f.size > targetSize) return f.size;
  }
  return -1;
};

const input = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;

aoc.test((o) => {
  o('PartA', () => {
    o(aoc.partA(aoc.parse(input))).equals(95437);
  });

  o('PartB', () => {
    o(aoc.partB(aoc.parse(input))).equals(24933642);
  });
});
