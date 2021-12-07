use crate::aoc::{Puzzle, PuzzleAnswer, Solution};

pub struct Day03 {
    pub day: usize,
    pub year: usize,
}

fn puzzle_parse(puzzle: &Puzzle) -> Vec<&str> {
    return puzzle.input.lines().collect();
}

fn count_ones(input: &Vec<&str>, index: usize) -> usize {
    let mut ones: usize = 0;
    for i in 0..input.len() {
        let val = input[i];
        let ch = val.chars().nth(index).unwrap();
        if ch == '1' {
            ones = ones + 1;
        }
    }
    return ones;
}

fn puzzle_a(input: &Vec<&str>) -> usize {
    let input_count = input.len() / 2;
    let input_size = input[0].len();
    let mut out_a = 0;
    let mut out_b = 0;
    for i in 0..input_size {
        let val = 1 << (input_size - i -1);
        let bits = count_ones(input, i);

        if bits >= input_count {
            out_a = out_a + val
        } else {
            out_b = out_b + val
        }
    }
    return out_a * out_b;
}

fn puzzle_b(input: &Vec<&str>) -> usize {
    return input.len() * 0;
}

impl Solution for Day03 {
    fn get_year(&self) -> usize {
        return self.year;
    }
    fn get_day(&self) -> usize {
        return self.day;
    }

    fn run(&self, puzzle: &Puzzle) -> PuzzleAnswer {
        let input = puzzle_parse(puzzle);
        return PuzzleAnswer {
            a: puzzle_a(&input),
            b: puzzle_b(&input),
        };
    }
}
