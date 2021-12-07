use crate::aoc::{Puzzle, PuzzleAnswer, Solution};

fn puzzle_parse(puzzle: &Puzzle) -> Vec<usize> {
    return puzzle
        .input
        .split(',')
        .map(|ch| ch.parse::<usize>().unwrap())
        .collect();
}

fn calc_fish(input: &Vec<usize>, days: usize) -> usize {
    let mut fish_counts: Vec<usize> = vec![0; 9];
    for i in 0..input.len() {
        let val = input[i];
        fish_counts[val] = fish_counts[val] + 1;
    }

    for _day in 0..days {
        let new_fish = fish_counts[0];
        fish_counts[0] = fish_counts[1];
        fish_counts[1] = fish_counts[2];
        fish_counts[2] = fish_counts[3];
        fish_counts[3] = fish_counts[4];
        fish_counts[4] = fish_counts[5];
        fish_counts[5] = fish_counts[6];
        fish_counts[6] = fish_counts[7] + new_fish;
        fish_counts[7] = fish_counts[8];
        fish_counts[8] = new_fish;
    }

    let mut sum = 0;
    for val in fish_counts.iter() {
        sum = sum + val;
    }
    return sum;
}

fn puzzle_a(input: &Vec<usize>) -> usize {
    return calc_fish(input, 80);
}

fn puzzle_b(input: &Vec<usize>) -> usize {
    return calc_fish(input, 256);
}

pub struct Day06 {
    pub day: usize,
    pub year: usize,
}

impl Solution for Day06 {
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
