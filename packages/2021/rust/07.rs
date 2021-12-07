mod aoc;

struct Input {
    input: Vec<usize>,
    min: usize,
    max: usize,
}

fn puzzle_parse(input: &String) -> Input {
    let mut min: usize = usize::MAX;
    let mut max: usize = 0;
    let mut input: Vec<usize> = input
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
        }
    }
    return min;
}

fn main() {
    let user_name = "blacha";
    let puzzle = aoc::puzzle_load(&user_name, 2021, 7);
    let data = puzzle_parse(&puzzle.input);

    println!(
        "Puzzle {}-{} a:{} b:{}",
        puzzle.year,
        puzzle.day,
        puzzle.a.unwrap(),
        puzzle.b.unwrap(),
    );

    let res_a = puzzle_a(&data);
    if let Some(ans_a) = puzzle.a {
        assert_eq!(res_a, ans_a);
    }

    let res_b = puzzle_b(&data);
    if let Some(ans_b) = puzzle.b {
        assert_eq!(res_b, ans_b);
    }
}
