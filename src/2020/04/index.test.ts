import o from 'ospec';
import { parseDay4Input } from '.';
import { Day4Input, Day4InputTest } from './input';

o.spec('2020:04', () => {
  o('should validate test input', () => {
    const day4Data = parseDay4Input(Day4InputTest);
    o(day4Data.length).equals(4);
    o(day4Data.filter((f) => f.isValid).length).equals(2);
  });

  o('should validate tests', () => {
    const validationTestFail = parseDay4Input(`eyr:1972 cid:100
hcl:#18171d ecl:amb hgt:170 pid:186cm iyr:2018 byr:1926

iyr:2019
hcl:#602927 eyr:1967 hgt:170cm
ecl:grn pid:012533040 byr:1946

hcl:dab227 iyr:2012
ecl:brn hgt:182cm pid:021572410 eyr:2020 byr:1992 cid:277

hgt:59cm ecl:zzz
eyr:2038 hcl:74454a iyr:2023
pid:3556412378 byr:2007`);

    const validationTestPass = parseDay4Input(`pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980
hcl:#623a2f

eyr:2029 ecl:blu cid:129 byr:1989
iyr:2014 pid:896056539 hcl:#a97842 hgt:165cm

hcl:#888785
hgt:164cm byr:2001 iyr:2015 cid:88
pid:545766238 ecl:hzl
eyr:2022

iyr:2010 hgt:158cm hcl:#b6652a ecl:blu byr:1944 eyr:2021 pid:093154719`);
    o(validationTestPass.every((f) => f.isValidated)).equals(true);
    o(validationTestFail.every((f) => f.isValidated)).equals(false);
  });
  o('Answer', () => {
    const day4Data = parseDay4Input(Day4Input);
    console.log('');
    console.time('2020:04');
    console.log('2020:04.Question#1', day4Data.filter((f) => f.isValid).length);
    console.log('2020:04.Question#2', day4Data.filter((f) => f.isValid && f.isValidated).length);
    console.timeEnd('2020:04');
  });
});
