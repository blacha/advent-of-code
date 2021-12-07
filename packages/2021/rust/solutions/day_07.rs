use crate::aoc::{Puzzle, PuzzleAnswer, Solution};

struct Input {
    input: Vec<usize>,
    min: usize,
    max: usize,
}

fn puzzle_parse(puzzle: &Puzzle) -> Input {
    let mut min: usize = usize::MAX;
    let mut max: usize = 0;
    let mut input: Vec<usize> = puzzle
        .input
        .split(',')
        .map(|ch| {
            let ret = ch.parse::<usize>().unwrap();
            if ret < min {
                min = ret
            };
            if ret > max {
                max = ret
            };
            return ret;
        })
        .collect();
    input.sort_by(|a, b| a.partial_cmp(b).unwrap());

    return Input { input, min, max };
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
    let mut fuel_cost: Vec<usize> = vec![0];
    for i in 1..input.max + 1 {
        let fuel = fuel_cost[i - 1] + i;
        fuel_cost.push(fuel);
    }

    let mut min = usize::MAX;
    for i in input.min..input.max {
        let mut sum: usize = 0;
        for j in 0..input.input.len() {
            let val = delta(input.input[j], i);
            sum = sum + (val * (val + 1) / 2)
        }
        if sum < min {
            min = sum;
        } else {
            break;
        }
    }
    return min;
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
