use crate::aoc::{Puzzle, PuzzleAnswer, Solution};

pub struct Day05 {
    pub day: usize,
    pub year: usize,
}

impl Solution for Day05 {
    fn get_year(&self) -> usize {
        return self.year;
    }
    fn get_day(&self) -> usize {
        return self.day;
    }

    fn run(&self, puzzle: &Puzzle) -> PuzzleAnswer {
        // let input = puzzle_parse(puzzle);
        return PuzzleAnswer {
            a: 0,
            b: 0,
        };
    }
}
