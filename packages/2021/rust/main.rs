mod aoc;
mod solutions;

use std::time::Instant;

fn get_puzzle(puzzles: &Vec<aoc::Puzzle>, day: usize) -> &aoc::Puzzle {
    for x in puzzles {
        if x.day == day {
            return x;
        }
    }

    panic!("Unable to find puzzle for day: {}", day);
}

const PUZZLE_OK: &str = "✔️";
const PUZZLE_FAIL: &str = "✘";

fn get_puzzle_ok(res: usize, expected: usize) -> &'static str {
    if res == expected {
        return PUZZLE_OK;
    }
    return PUZZLE_FAIL;
}

pub fn main() {
    let user_name = "blacha";
    let puzzles = aoc::puzzle_load_all(&user_name, 2021);

    let start_time = Instant::now();
    for sol in solutions::ALL {
        let puzzle = get_puzzle(&puzzles, sol.get_day());
        let now = Instant::now();
        let res = sol.run(puzzle);
        let duration = now.elapsed();

        println!(
            "Puzzle {}-{:02} \ta:{: >16} {}\tb:{: >16} {}\t {:.3}ms",
            sol.get_year(),
            sol.get_day(),
            res.a,
            get_puzzle_ok(res.a, puzzle.a),
            res.b,
            get_puzzle_ok(res.b, puzzle.b),
            duration.as_secs_f64() * 1000.0
        );
    }

    println!(
        "\nDone {} puzzles in {:.3}ms",
        solutions::ALL.len(),
        start_time.elapsed().as_secs_f64() * 1000.0
    );
    // solutions::ALL[0].run(&puzzle_01);

    // let puzzle_01_input = day_01::puzzle_parse(&puzzle_01.input)
    // let puzzle_01_a = day_01::pu
    // let data =

    // let data = puzzle_parse(&puzzle.input);
}
