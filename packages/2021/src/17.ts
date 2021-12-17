import { AoC } from 'aocf';

export type Input = { x: number[]; y: number[] };

const aoc = AoC.create<Input>(2021, 17);

aoc.parse = (l: string): Input => {
  const xIn = l.indexOf('x=');
  const [x, y] = l
    .slice(xIn)
    .split(',')
    .map((c) =>
      c
        .slice(c.indexOf('=') + 1)
        .split('..')
        .map(Number),
    );

  return { x, y };
};

const Values = new Map<string, { hitCount: number; highestY: number }>();

function calcValues(input: Input): { hitCount: number; highestY: number } {
  const [minY, maxY] = input.y;
  const [minX, maxX] = input.x;
  const inputKey = `${minX}..${maxY},${minY}..${maxY}`;
  const existing = Values.get(inputKey);
  if (existing != null) return existing;
  let hitCount = 0;
  let highestY = 0;

  for (let y = minY; y < Math.abs(minY); y++) {
    for (let x = 0; x <= maxX; x++) {
      const velocity = { x, y };
      const position = { x: 0, y: 0 };
      let hit = false;

      let maxHeight = 0;
      while (true) {
        maxHeight = Math.max(position.y, maxHeight);
        position.x += velocity.x;
        position.y += velocity.y;
        if (position.y >= minY && position.y <= maxY) {
          if (position.x >= minX && position.x <= maxX) {
            hit = true;
            break;
          }
        }

        if (position.x > maxX) break;
        if (position.y < minY) break;

        velocity.x = Math.max(0, velocity.x - 1);
        velocity.y = velocity.y - 1;
      }

      if (hit) {
        hitCount++;
        if (highestY < maxHeight) highestY = maxHeight;
      }
    }
  }
  Values.set(inputKey, { hitCount, highestY });
  return { hitCount, highestY };
}

aoc.partA = (input: Input): number => calcValues(input).highestY;
aoc.partB = (input: Input): number => calcValues(input).hitCount;

const testValues = `target area: x=20..30, y=-10..-5`.trim();

aoc.test((o) => {
  o('partA', () => {
    o(aoc.answers(testValues).a).equals(45);
  });

  o('partB', () => {
    o(aoc.answers(testValues).b).equals(112);
  });
});
