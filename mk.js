#!/usr/bin/env node

const { readFileSync, writeFileSync, existsSync } = require('fs');

const currentYear = Number(new Date().toISOString().slice(0, 4));
const errorMessage = `./mk.js <year 2015..${currentYear}> <day 1..25>`;

const Day = Number(process.argv.pop());
if (isNaN(Day)) throw new Error(errorMessage);
if (Day < 1 || Day > 25) throw new Error(errorMessage);
const Year = Number(process.argv.pop());
if (isNaN(Year)) throw new Error(errorMessage);

if (Year < 2015 || Year > currentYear) throw new Error(errorMessage);

const target = `./packages/${Year}/src/${String(Day).padStart(2, '0')}.ts`;
console.log('Create', target);

if (existsSync(target)) throw new Error(`${target} exists.`);

const src = readFileSync('./template').toString().replace('$YEAR', Year).replace('$DAY', Day);

writeFileSync(target, src);
