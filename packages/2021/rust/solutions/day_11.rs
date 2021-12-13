use crate::aoc::{Puzzle, PuzzleAnswer, Solution};
use std::collections::VecDeque;

const SIZE: usize = 10;
const SIZE_I: i8 = 10;

const GRID: [[i8; 2]; 8] = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
];

fn _dump_grid(grid: &[i8; 100]) -> usize {
    print!("\n");
    for y in 0..SIZE {
        for x in 0..SIZE {
            let index = y * 5 + x;
            print!("{:#04x} ", grid[index]);
        }
        println!();
    }
    return 0;
}

fn puzzle_parse(puzzle: &Puzzle) -> [i8; 100] {
    let mut input: [i8; 100] = [0; 100];
    let mut index = 0;

    for line in puzzle.input.split('\n') {
        for ch in line.chars().into_iter() {
            let ret = ch.to_digit(10).unwrap() as i8;
            input[index] = ret;
            index = index + 1;
        }
    }

    return input;
}

fn run_step(input: &mut [i8; 100]) -> usize {
    let mut to_flash = VecDeque::new();
    for index in 0..100 {
        input[index] = input[index] + 1;
        if input[index] > 9 {
            to_flash.push_back(index.to_owned());
        }
    }

    let mut flash_count = 0;
    let mut flashed: [bool; 100] = [false; 100];
    while !to_flash.is_empty() {
        let index = match to_flash.pop_front() {
            None => break,
            Some(index) => index,
        };
        if flashed[index] {
            continue;
        }
        flash_count = flash_count + 1;
        flashed[index] = true;

        let x: i8 = (index % SIZE).try_into().unwrap();
        let y: i8 = (index / SIZE).try_into().unwrap();

        for pt in GRID {
            let new_x = x + pt[0];
            let new_y = y + pt[1];
            if new_x < 0 || new_x >= SIZE_I {
                continue;
            }
            if new_y < 0 || new_y >= SIZE_I {
                continue;
            }

            let new_index: usize = (new_x + new_y * SIZE_I).try_into().unwrap();
            input[new_index] = input[new_index] + 1;
            if input[new_index] > 9 {
                to_flash.push_back(new_index);
            }
        }
    }

    if flash_count > 0 {
        for index in 0..100 {
            if flashed[index] {
                input[index] = 0;
            }
        }
    }

    return flash_count;
}

fn puzzle_a(input: &mut [i8; 100]) -> usize {
    let mut flash_count = 0;
    for _i in 0..100 {
        flash_count = flash_count + run_step(input);
    }
    return flash_count;
}

fn puzzle_b(input: &mut [i8; 100]) -> usize {
    let mut flash_count = 0;
    let mut step_count = 100; // ran 100 steps in puzzle_a
    while flash_count < 100 {
        flash_count = run_step(input);
        step_count = step_count + 1;
    }
    return step_count;
}

pub struct Day11 {
    pub day: usize,
    pub year: usize,
}

impl Solution for Day11 {
    fn get_year(&self) -> usize {
        return self.year;
    }

    fn get_day(&self) -> usize {
        return self.day;
    }

    fn run(&self, puzzle: &Puzzle) -> PuzzleAnswer {
        let mut input = puzzle_parse(puzzle);
        return PuzzleAnswer {
            a: puzzle_a(&mut input),
            b: puzzle_b(&mut input),
        };
    }
}
