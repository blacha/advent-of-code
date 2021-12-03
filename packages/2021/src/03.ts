import { AoC } from 'aocf';

const aoc = AoC.create<string[]>(2021, 3);

aoc.parse = (input: string): string[] => input.split('\n')

function countBits(lines: string[], index: number): { zeroes: number, ones: number } {
    let zeroes = 0;
    let ones = 0;
    for (const line of lines) {
        if (line[index] === '0') zeroes++;
        else ones++;
    }
    return { zeroes, ones };
}

aoc.partA = (input: string[]): number => {
    const len = input[0].length - 1;
    let outA = 0;
    let outB = 0;
    for (let i = 0; i <= len; i++) {
        const val = 1 << (len - i);
        const bits = countBits(input, i);
        if (bits.ones > bits.zeroes) outA = outA + val
        else outB = outB + val

    }
    return outA * outB
};


function filterVals(input: string[], f: (bits: {zeroes:number, ones: number}) => string): number {
    let vals = input;
    for (let i = 0; i < input[0].length; i++) {
        const bits = countBits(vals, i);
        const expected = f(bits)
        vals = vals.filter(f => f[i] === expected)
        if (vals.length === 1) return parseInt(vals[0], 2)
    }
    return -1;
}
aoc.partB = (input: string[]): number => {
    const valA = filterVals(input, bits => bits.ones >= bits.zeroes ? '1' : '0');
    const valB = filterVals(input, bits => bits.ones < bits.zeroes ? '1' : '0');
    return valA * valB;
}

aoc.test((o) => {
    const testValues = `00100\n11110\n10110\n10111\n10101\n01111\n00111\n11100\n10000\n11001\n00010\n01010`;

    o('2021partA', () => {
        o(aoc.answers(testValues).a).equals(198);
    });

    o('2021partB', () => {
        o(aoc.answers(testValues).b).equals(230);
    });
});
