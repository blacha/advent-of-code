use crate::aoc::Solution;

pub mod day_01;
pub mod day_02;
pub mod day_03;
pub mod day_04;
pub mod day_05;
pub mod day_06;
pub mod day_07;
pub mod day_11;

pub const ALL: [&dyn Solution; 8] = [
    &day_01::Day01 { year: 2021, day: 1 },
    &day_02::Day02 { year: 2021, day: 2 },
    &day_03::Day03 { year: 2021, day: 3 },
    &day_04::Day04 { year: 2021, day: 4 },
    &day_05::Day05 { year: 2021, day: 5 },
    &day_06::Day06 { year: 2021, day: 6 },
    &day_07::Day07 { year: 2021, day: 7 },
    &day_11::Day11 {
        year: 2021,
        day: 11,
    },
];
