import { AoC } from '../../framework/aoc';

export interface Passport {
  byr: string;
  iyr: string;
  eyr: string;
  hgt: string;
  hcl: string;
  ecl: string;
  pid: string;
}

const RequiredFields = new Set<keyof Passport>(['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']);
const EyeColors = new Set(['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth']);

export const Validators: Record<keyof Passport, (s?: string) => boolean> = {
  byr: (f?: string) => f != null && parseInt(f) >= 1920 && parseInt(f) <= 2002,
  iyr: (f?: string) => f != null && parseInt(f) >= 2010 && parseInt(f) <= 2020,
  eyr: (f?: string) => f != null && parseInt(f) >= 2020 && parseInt(f) <= 2030,
  ecl: (f?: string) => f != null && EyeColors.has(f),
  pid: (f?: string) => f != null && /^([0-9]){9}$/.test(f),
  hgt: (f?: string) => {
    if (f == null) return false;
    const num = parseInt(f);
    if (isNaN(num)) return false;
    if (f.includes('cm')) return num >= 150 && num <= 193;
    if (f.includes('in')) return num >= 49 && num <= 76;
    return false;
  },
  hcl: (f?: string) => f != null && /^#([0-9a-f]){6}/.test(f),
};

export class AoC2020Day4 extends AoC<Passport[]> {
  constructor() {
    super(2020, 4);
  }

  isKeyValid(k: any): k is keyof Passport {
    return RequiredFields.has(k);
  }

  parse(str: string): Passport[] {
    let passport: Partial<Passport> = {};
    const passports = [passport];
    for (const line of str.split('\n')) {
      if (line.trim() == '') {
        passport = {};
        passports.push(passport);
        continue;
      }
      for (const pairs of line.split(' ')) {
        if (!pairs.includes(':')) continue;
        const [key, value] = pairs.split(':');
        if (key == 'cid') continue;

        if (!this.isKeyValid(key)) throw new Error('WeirdKey:' + key);
        passport[key] = value;
      }
    }
    return passports as Passport[];
  }

  partA(input: Passport[]): number {
    return input.filter((f: Passport) => RequiredFields.size == Object.keys(f).length).length;
  }

  partB(input: Passport[]): number {
    return input.filter((f: Passport) => {
      for (const key of RequiredFields) {
        const validator = Validators[key];
        if (validator(f[key])) continue;
        return false;
      }
      return true;
    }).length;
  }
}

export const aoc2020day4 = new AoC2020Day4();
