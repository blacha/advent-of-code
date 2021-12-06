mod aoc;

fn puzzle_parse(input: &String) -> Vec<usize> {
    return input
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

fn main() {
    let user_name = "blacha";
    let puzzle = aoc::puzzle_load(&user_name, 2021, 6);
    let data = puzzle_parse(&puzzle.input);

    println!(
        "Puzzle {}-{} a:{} b:{}",
        puzzle.year,
        puzzle.day,
        puzzle.a.unwrap(),
        puzzle.b.unwrap()
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
