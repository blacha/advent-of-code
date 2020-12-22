import { AoC } from 'aocf';

export type AocRules = string | number[][];

export interface AoC2020Day19Input {
  rules: Map<number, AocRules>;
  data: string[];
}

function validateRule(rules: Map<number, AocRules>, message: string, ruleId: number, offset = 0): number[] {
  const rule = rules.get(ruleId) ?? '';

  if (typeof rule === 'string') return message[offset] === rule ? [offset + 1] : [];
  return rule.flatMap((ruleOptions) => {
    let offsets = [offset];
    for (const opt of ruleOptions) {
      offsets = offsets.flatMap((newIndex) => validateRule(rules, message, opt, newIndex));
    }
    return offsets;
  });
}

export class AoC2020Day19 extends AoC<AoC2020Day19Input> {
  constructor() {
    super(2020, 19);
  }

  parse(i: string): AoC2020Day19Input {
    const [ruleData, messages] = i.split('\n\n');
    const rulesRaw = ruleData.split('\n');
    const rules: Map<number, AocRules> = new Map();
    for (const f of rulesRaw) {
      const [offset, more] = f.split(': ');
      if (more.includes('"')) {
        const char = more.slice(more.indexOf('"') + 1, more.lastIndexOf('"'));
        rules.set(Number(offset), char);
        continue;
      }

      rules.set(
        Number(offset),
        more.split(' | ').map((c) => c.split(' ').map(Number)),
      );
    }

    return { rules, data: messages.split('\n') };
  }

  partA(input: AoC2020Day19Input): number {
    let count = 0;
    for (const data of input.data) if (validateRule(input.rules, data, 0)[0] === data.length) count++;
    return count;
  }

  partB(input: AoC2020Day19Input): number {
    input.rules.set(8, [[42], [42, 8]]);
    input.rules.set(11, [
      [42, 31],
      [42, 11, 31],
    ]);
    let count = 0;
    for (const data of input.data) if (validateRule(input.rules, data, 0)[0] === data.length) count++;
    return count;
  }
}

export const aoc2020day19 = new AoC2020Day19();
aoc2020day19.run();
