mod aoc;

#[inline]
fn puzzle_a(input: &Vec<u32>) -> u32 {
    let mut count: u32 = 0;
    for i in 0..input.len() - 1 {
        if input[i + 1] > input[i] {
            count = count + 1
        }
    }
    return count;
}

#[inline]
fn puzzle_b(input: &Vec<u32>) -> u32 {
    let mut count = 0;
    for i in 0..input.len() - 3 {
        if input[i + 3] > input[i] {
            count = count + 1
        }
    }
    return count;
}

fn puzzle_parse(input: &String) -> Vec<u32> {
    return input
        .lines()
        .map(|line| line.parse::<u32>().unwrap())
        .collect();
}

fn main() {
    let user_name = "blacha";
    let puzzle = aoc::puzzle_load(&user_name, 2021, 1);
    let data = puzzle_parse(&puzzle.input);

    println!("Puzzle {}-{} a:{} b:{}", puzzle.year, puzzle.day, puzzle.a.unwrap(), puzzle.b.unwrap());

    let res_a = puzzle_a(&data);
    if let Some(ans_a) = puzzle.a {
        assert_eq!(res_a, ans_a);
    }

    let res_b = puzzle_b(&data);
    if let Some(ans_b) = puzzle.b {
        assert_eq!(res_b, ans_b);
    }
}
