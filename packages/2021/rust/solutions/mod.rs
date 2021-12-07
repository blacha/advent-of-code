use crate::aoc::Solution;

pub mod day_01;
pub mod day_02;
pub mod day_06;
pub mod day_07;

pub const ALL: [&dyn Solution; 4] = [
    &day_01::Day01 { year: 2021, day: 1},
    &day_02::Day02 { year: 2021, day: 2},
    &day_06::Day06 { year: 2021, day: 6},
    &day_07::Day07 { year: 2021, day: 7},
];