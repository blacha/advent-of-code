use serde::{Deserialize, Serialize};
use serde_json;
use std::{env, fs};

const AOC_DATA_PATH: &str = ".aoc-data";

#[derive(Serialize, Deserialize, Debug)]
pub struct Puzzle {
    pub year: usize,
    pub day: usize,
    pub user: String,
    pub input: String,
    pub a: usize,
    pub b: usize,
}

pub trait PuzzleId {
    fn to_id(&self) -> String;
}

impl PuzzleId for Puzzle {
    fn to_id(&self) -> String {
        return format!("{}-{}.{}", self.year, self.day, self.user);
    }
}

pub struct PuzzleAnswer {
    pub a: usize,
    pub b: usize,
}

pub trait Solution {
    fn get_day(&self) -> usize;
    fn get_year(&self) -> usize;
    fn run(&self, puzzle: &Puzzle) -> PuzzleAnswer;
}

fn find_aoc_data() -> Result<std::path::PathBuf, ()> {
    let mut current_dir = env::current_dir().expect("Unable to find current directory");

    loop {
        let aoc_data = current_dir.join(AOC_DATA_PATH);
        if let Ok(ret) = fs::metadata(&aoc_data) {
            if ret.is_dir() {
                return Ok(aoc_data);
            }
        }
        match current_dir.parent() {
            Some(next_path) => current_dir = next_path.to_path_buf(),
            None => return Err(()),
        }
    }
}

pub fn puzzle_load_all(user: &str, year: usize) -> Vec<Puzzle> {
    let aoc_data_path = find_aoc_data().expect("Failed to find .aoc-data folder");
    let target_file_name = format!("{}.{}.json", year, user);

    let target_file = aoc_data_path.join(target_file_name);

    let file = fs::File::open(&target_file).expect("Failed to open data file");

    let puzzles: Vec<Puzzle> = serde_json::from_reader(file).expect("Failed to parse data file");
    return puzzles;
}
