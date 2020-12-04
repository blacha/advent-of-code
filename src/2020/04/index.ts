import { Day4Input, Day4InputTest } from './input';

export interface Passport {
  byr: string;
  iyr: string;
  eyr: string;
  hgt: string;
  hcl: string;
  ecl: string;
  pid: string;
  cid?: string;
}

export interface PassportData {
  passport: Passport;
  isValid: boolean;
  isValidated: boolean;
}

const RequiredFields = new Set<keyof Passport>([
  'byr', // (Birth Year)
  'iyr', // (Issue Year)
  'eyr', // (Expiration Year)
  'hgt', // (Height)
  'hcl', // (Hair Color)
  'ecl', // (Eye Color)
  'pid', // (Passport ID)
  'cid', // (Country ID)
]);
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
  cid: () => true,
};

function isKeyValid(k: any): k is keyof Passport {
  return RequiredFields.has(k);
}

export function parseDay4Input(f: string): PassportData[] {
  let passport: Partial<Passport> = {};
  const passports = [{ passport, isValid: true, isValidated: false }];

  for (const line of f.split('\n')) {
    if (line == '') {
      passport = {};
      passports.push({ passport, isValid: true, isValidated: false });
      continue;
    }
    for (const pairs of line.split(' ')) {
      if (!pairs.includes(':')) continue;
      const [key, value] = pairs.split(':') as [keyof Passport, string];
      if (!isKeyValid(key)) throw new Error('WeirdKey:' + key);
      passport[key] = value;
    }
  }
  for (const p of passports) {
    // Question 1 validation
    const fieldCount = Object.keys(p.passport).length;
    p.isValid = fieldCount == RequiredFields.size || (fieldCount == RequiredFields.size - 1 && p.passport.cid == null);
    // Question 2 validation
    let isValid = true;
    for (const key of RequiredFields) {
      const validator = Validators[key];
      if (validator(p.passport[key]) == false) {
        isValid = false;
        break;
      }
    }
    p.isValidated = isValid;
  }

  return passports as PassportData[];
}
