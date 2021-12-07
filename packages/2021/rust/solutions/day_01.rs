use crate::aoc::{Puzzle, PuzzleAnswer, Solution};

pub struct Day01 {
    pub day: usize,
    pub year: usize,
}

fn puzzle_parse(puzzle: &Puzzle) -> Vec<usize> {
    return puzzle
        .input
        .lines()
        .map(|line| line.parse::<usize>().unwrap())
        .collect();
}

fn puzzle_a(input: &Vec<usize>) -> usize {
    let mut count: usize = 0;
    for i in 0..input.len() - 1 {
        if input[i + 1] > input[i] {
            count = count + 1
        }
    }
    return count;
}

fn puzzle_b(input: &Vec<usize>) -> usize {
    let mut count = 0;
    for i in 0..input.len() - 3 {
        if input[i + 3] > input[i] {
            count = count + 1
        }
    }
    return count;
}

impl Solution for Day01 {
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
