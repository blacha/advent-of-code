use crate::aoc::{Puzzle, PuzzleAnswer, Solution};

struct Input {
    input: Vec<usize>,
    total: usize,
}

fn puzzle_parse(puzzle: &Puzzle) -> Input {
    let mut total: usize = 0;
    let mut input: Vec<usize> = puzzle
        .input
        .split(',')
        .map(|ch| {
            let ret = ch.parse::<usize>().unwrap();
            total = total + ret;
            return ret;
        })
        .collect();
    input.sort_by(|a, b| a.partial_cmp(b).unwrap());

    return Input { input, total };
}

#[inline]
fn delta(a: usize, b: usize) -> usize {
    if a > b {
        return a - b;
    }
    return b - a;
}

fn puzzle_a(input: &Input) -> usize {
    let best_index = input.input[input.input.len() / 2];
    let mut sum: usize = 0;
    for j in 0..input.input.len() {
        sum = sum + delta(input.input[j], best_index);
    }
    return sum;
}

fn puzzle_b(input: &Input) -> usize {
    let input_len = input.input.len();
    let average = input.total / input_len;
    let mut sum_floor = 0;
    let mut sum_ceil = 0;

    for j in 0..input_len {
        let val_floor = delta(input.input[j], average);
        sum_floor = sum_floor + (val_floor * (val_floor + 1) / 2);

        let val_ceil = delta(input.input[j], average + 1);
        sum_ceil = sum_ceil + (val_ceil * (val_ceil + 1) / 2);
    }
    if sum_floor < sum_ceil {
        return sum_floor;
    }
    return sum_ceil;
}

pub struct Day07 {
    pub day: usize,
    pub year: usize,
}

impl Solution for Day07 {
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
