import { Computer } from '../5/computer/int.computer';

export interface AmplifierOutput {
    key: number[];
    value: number;
}

function combinations(numbers: number[]): number[][] {
    if (numbers.length < 2) {
        return [numbers];
    } else {
        // By declaring all variables outside of the loop,
        // we improve efficiency, avoiding the needless
        // declarations each time.
        const anagrams = [];
        let before, focus, after;
        let shortWord, subAnagrams, newEntry;

        for (let i = 0; i < numbers.length; i++) {
            before = numbers.slice(0, i);
            focus = numbers[i];
            after = numbers.slice(i + 1, numbers.length + 1);
            shortWord = before.concat(after);
            subAnagrams = combinations(shortWord);

            for (let j = 0; j < subAnagrams.length; j++) {
                newEntry = [focus].concat(subAnagrams[j]);
                anagrams.push(newEntry);
            }
        }

        return anagrams;
    }
}

export class AmplifierControl {
    amps: Computer[] = [new Computer(), new Computer(), new Computer(), new Computer(), new Computer()];

    constructor(program = '') {
        for (const comp of this.amps) {
            comp.init(program);
        }
    }

    clone() {
        const amp = new AmplifierControl();
        amp.amps = this.amps.map(comp => comp.clone());
        return amp;
    }

    get isWaiting() {
        for (const amp of this.amps) {
            if (amp.isWaiting) {
                return true;
            }
        }
        return false;
    }

    setPhase(phases: number[]) {
        for (let i = 0; i < phases.length; i++) {
            const computer = this.amps[i];
            computer.state.input = [phases[i]];
        }
    }

    run(lastVal = 0) {
        for (let i = 0; i < this.amps.length; i++) {
            const comp = this.amps[i];
            comp.resume([lastVal]);
            if (comp.output == null) {
                throw new Error('No output');
            }
            lastVal = comp.output;
        }
        return lastVal;
    }

    static brute(program: string, inputs = [0, 1, 2, 3, 4]) {
        const base = new AmplifierControl(program);
        const allInputs = combinations(inputs);

        const bestState: BestState = {
            amp: new AmplifierControl(''),
            value: Number.MIN_SAFE_INTEGER,
            input: [],
        };
        for (const input of allInputs) {
            const amp = base.clone();

            amp.setPhase(input);

            let res = amp.run();
            while (amp.isWaiting) {
                res = amp.run(res);
            }
            if (res > bestState.value) {
                bestState.value = res;
                bestState.amp = amp;
                bestState.input = input;
            }
        }
        return bestState;
    }
}

export interface BestState {
    amp: AmplifierControl;
    value: number;
    input: number[];
}
// const amp = AmplifierControl.brute('3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0')
// o(res).deepEquals({ key: [1, 0, 4, 3, 2], value: 65210 })
