mod aoc;

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

fn puzzle_parse(input: &String) -> Vec<Movement> {
    let mut movements: Vec<Movement> = Vec::new();

    for line in input.lines() {
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

fn main() {
    let user_name = "blacha";
    let puzzle = aoc::puzzle_load(&user_name, 2021, 2);
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
