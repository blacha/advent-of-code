import { AoC } from 'aocf';

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

aoc2020day4.test((o) => {
  o('should validate test input', async () => {
    const testData = aoc2020day4.parse(`ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm

iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
hcl:#cfa07d byr:1929

hcl:#ae17e1 iyr:2013
eyr:2024
ecl:brn pid:760753108 byr:1931
hgt:179cm

hcl:#cfa07d eyr:2025 pid:166559648
iyr:2011 ecl:brn hgt:59in`);
    o(testData.length).equals(4);
    o(aoc2020day4.partA(testData)).equals(2);
    o(aoc2020day4.partB(testData)).equals(2);
  });
  o('should validate tests', () => {
    const validationTestFail = aoc2020day4.parse(`eyr:1972 cid:100
      hcl:#18171d ecl:amb hgt:170 pid:186cm iyr:2018 byr:1926

      iyr:2019
      hcl:#602927 eyr:1967 hgt:170cm
      ecl:grn pid:012533040 byr:1946

      hcl:dab227 iyr:2012
      ecl:brn hgt:182cm pid:021572410 eyr:2020 byr:1992 cid:277

      hgt:59cm ecl:zzz
      eyr:2038 hcl:74454a iyr:2023
      pid:3556412378 byr:2007`);

    const validationTestPass = aoc2020day4.parse(`pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980
      hcl:#623a2f

      eyr:2029 ecl:blu cid:129 byr:1989
      iyr:2014 pid:896056539 hcl:#a97842 hgt:165cm

      hcl:#888785
      hgt:164cm byr:2001 iyr:2015 cid:88
      pid:545766238 ecl:hzl
      eyr:2022

      iyr:2010 hgt:158cm hcl:#b6652a ecl:blu byr:1944 eyr:2021 pid:093154719`);
    o(aoc2020day4.partB(validationTestPass)).equals(4);
    o(aoc2020day4.partB(validationTestFail)).equals(0);
  });
});
