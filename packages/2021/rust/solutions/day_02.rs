use crate::aoc::{Puzzle, PuzzleAnswer, Solution};

enum Direction {
    Up = 0,
    Down = 1,
    Forward = 2,
}

struct Movement {
    direction: Direction,
    count: usize,
}

#[inline]
fn puzzle_a(input: &Vec<Movement>) -> usize {
    let mut x = 0;
    let mut y = 0;
    for vm in input.iter() {
        match vm.direction {
            Direction::Forward => x += vm.count,
            Direction::Up => y -= vm.count,
            Direction::Down => y += vm.count,
        }
    }
    return x * y;
}

#[inline]
fn puzzle_b(input: &Vec<Movement>) -> usize {
    let mut x = 0;
    let mut y = 0;
    let mut aim = 0;
    for vm in input.iter() {
        match vm.direction {
            Direction::Forward => {
                x += vm.count;
                y += vm.count * aim;
            }
            Direction::Up => aim -= vm.count,
            Direction::Down => aim += vm.count,
        }
    }
    return x * y;
}

fn puzzle_parse(puzzle: &Puzzle) -> Vec<Movement> {
    let mut movements: Vec<Movement> = Vec::new();

    for line in puzzle.input.lines() {
        let mut movement = Movement {
            count: 0,
            direction: Direction::Forward,
        };
        let mut splits = line.split_whitespace();

        let first = splits.next().unwrap();
        movement.direction = match first {
            "up" => Direction::Up,
            "down" => Direction::Down,
            "forward" => Direction::Forward,
            unk => panic!("Invalid direction {}", unk),
        };
        movement.count = splits.next().unwrap().parse::<usize>().unwrap();
        movements.push(movement);
    }

    return movements;
}

pub struct Day02 {
    pub day: usize,
    pub year: usize,
}

impl Solution for Day02 {
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
