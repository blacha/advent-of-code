import { AoC } from 'aocf';

interface Input {
    balls: number[]
    ballLookup: number[]
    boards: number[][][]
}

const aoc = AoC.create<Input>(2021, 4);

aoc.parse = (input: string): Input => {
    const lines = input.split('\n')
    const balls = lines[0].split(',').map(Number);

    let ballLookup = [];
    for (let i = 0; i < balls.length; i++) {
        let num = balls[i];
        ballLookup[num] = i;
    }

    const boards: number[][][] = [];
    let current: number[][] = []
    for (let i = 1; i < lines.length; i++) {
        const l = lines[i].trim();
        if (l.trim() == '') {
            if (current.length > 0) boards.push(current);
            current = [];
            continue
        }
        current.push(l.replace(/  /g, ' ').split(' ').map(Number))
    }
    if (current.length > 0) boards.push(current);
    return { boards, balls: balls, ballLookup: ballLookup }
}

function boardStats(lookup: number[], board: number[][]): { board: number[][], winX: number, winY: number, win: number } {
    let bestXLine = Number.MAX_SAFE_INTEGER;
    let bestYLine = Number.MAX_SAFE_INTEGER;

    for (let y = 0; y < board.length; y++) {
        const line = board[y];

        let maxBall = -1
        for (const num of line) maxBall = Math.max(maxBall, lookup[num])

        bestXLine = Math.min(maxBall, bestXLine);
    }

    for (let x = 0; x < board[0].length; x++) {
        let maxBall = -1

        for (const line of board)  maxBall = Math.max(maxBall, lookup[line[x]])
        bestYLine = Math.min(maxBall, bestYLine);
    }

    return { board, winX: bestXLine, winY: bestYLine, win: Math.min(bestXLine, bestYLine) }
}

function sumBoard(board: number[][], lookup: number[], since: number): number {
    let sum = 0;
    for (let line of board) {
        for (const num of line) {
            const lineIndex = lookup[num];
            if (lineIndex <= since) continue;
            sum += num
        }
    }
    return sum;
}


aoc.partA = (input: Input): number => {
    const stats = input.boards.map(c => boardStats(input.ballLookup, c))

    let best = stats[0];
    for (const stat of stats) if (stat.win < best.win) best=stat;
    const sum = sumBoard(best.board, input.ballLookup, best.win);
    const num = input.balls[best.win]
    return sum * num
}


aoc.partB = (input: Input): number => {
    const stats = input.boards.map(c => boardStats(input.ballLookup, c))

    let best = stats[0];
    for (const stat of stats) if (stat.win > best.win) best=stat;
    const sum = sumBoard(best.board, input.ballLookup, best.win);
    const num = input.balls[best.win]
    return sum * num
}


const testValues = `
7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`.trim()

aoc.test((o) => {
    o('2021partA', () => {
        o(aoc.answers(testValues).a).equals(4512);
    });

    o('2021partB', () => {
        o(aoc.answers(testValues).b).equals(1924);
    });
});
