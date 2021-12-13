use crate::aoc::{Puzzle, PuzzleAnswer, Solution};

pub struct Day03Input {
    values: Vec<usize>,
    bits: usize,
}
pub struct Day03 {
    pub day: usize,
    pub year: usize,
}

fn puzzle_parse(puzzle: &Puzzle) -> Day03Input {
    let mut bits = 0;
    let values = puzzle
        .input
        .lines()
        .map(|line| {
            let line_size = line.len();
            if line_size > bits {
                bits = line_size;
            }
            return usize::from_str_radix(line, 2).unwrap();
        })
        .collect();
    return Day03Input { bits, values };
}

enum BitCount {
    Ones = 1,
    Zeroes = 0,
    Equal = -1,
}

#[inline]
fn bit_count(input: &Vec<usize>, offset: usize) -> BitCount {
    let mut ones: usize = 0;
    let mut zeroes: usize = 0;
    for i in 0..input.len() {
        if input[i] & offset == offset {
            ones = ones + 1;
        } else {
            zeroes = zeroes + 1;
        }
    }
    if ones == zeroes {
        return BitCount::Equal;
    } else if ones > zeroes {
        return BitCount::Ones;
    }
    return BitCount::Zeroes;
}

fn puzzle_a(input: &Day03Input) -> usize {
    let mut out_a: usize = 0;
    let mut out_b: usize = 0;
    for i in 0..input.bits {
        let val = 1 << i;
        let bits = bit_count(&input.values, val);

        match bits {
            BitCount::Ones => out_a = out_a + val,
            BitCount::Equal => out_a = out_a + val,
            BitCount::Zeroes => out_b = out_b + val,
        }
    }
    return out_a * out_b;
}

fn puzzle_b(input: &Day03Input) -> usize {
    let mut out_a = input.values.clone();
    let mut out_b = input.values.clone();

    for i in (0..input.bits).rev() {
        let val = 1 << i;
        if out_a.len() > 1 {
            let count = bit_count(&out_a, val);

            out_a = out_a
                .into_iter()
                .filter(|v| match count {
                    BitCount::Ones => return *v & val == val,
                    BitCount::Equal => return *v & val == val,
                    BitCount::Zeroes => return *v & val != val,
                })
                .collect();
        }
        if out_b.len() > 1 {
            let count = bit_count(&out_b, val);
            out_b = out_b
                .into_iter()
                .filter(|v| match count {
                    BitCount::Ones => return *v & val != val,
                    BitCount::Equal => return *v & val != val,
                    BitCount::Zeroes => return *v & val == val,
                })
                .collect();
        }
    }
    return out_a[0] * out_b[0];
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
