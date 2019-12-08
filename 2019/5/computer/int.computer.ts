import { ComputerCommand } from './code/code';
import { CodeAdd } from './code/code.add';
import { CodeMultiply } from './code/code.multiply';
import { CodeInput } from './code/code.input';
import { CodeOutput } from './code/code.output';
import { CodeIfLess, CodeIfEqual } from './code/code.if';
import { CodeEnd } from './code/code.end';
import { CodeJumpTrue, CodeJumpFalse } from './code/code.jump';

export enum ComputerState {
    Init = 'Init',
    Ready = 'Ready',
    Running = 'Running',
    WaitingInput = 'Waiting',
    Ended = 'Ended',
}

const Commands: Record<number, ComputerCommand> = {};

export interface ComputerMemory {
    state: ComputerState;
    ops: number[];
    offset: number;
    input: number[];
    output: number[];
}
export class Computer {
    memory: ComputerMemory = {
        state: ComputerState.Init,
        ops: [],
        offset: 0,
        input: [],
        output: [],
    };

    init(ops: string) {
        this.memory.ops = ops.split(',').map(c => parseInt(c, 10));
        this.memory.state = ComputerState.Ready;
    }

    /** Clone the current state */
    clone(): Computer {
        const computer = new Computer();
        computer.memory = JSON.parse(JSON.stringify(this.memory));
        return computer;
    }

    static register(cmd: ComputerCommand) {
        Commands[cmd.code] = cmd;
    }

    run(ops?: string, input: number[] = []) {
        if (ops != null) {
            this.init(ops);
        }
        this.memory.offset = 0;
        this.memory.input = input;
        this.memory.output = [];
        this.compute();
    }

    resume(input: number[]) {
        if (!this.isWaiting) {
            throw new Error('Invalid resume state, state:' + this.memory.state);
        }
        this.memory.input = this.memory.input.concat(input);
        this.compute();
    }

    compute() {
        this.memory.state = ComputerState.Running;
        this.debug('-- Start', this.memory.ops.join(', '), this.memory.input);
        while (this.memory.offset > -1 && this.memory.offset < this.memory.ops.length) {
            const codeMode = this.getCodeMode(this.memory.offset);

            const cmd = Commands[codeMode.code];
            if (cmd == null) {
                throw new Error(`Invalid Code ${this.memory.ops[this.memory.offset]} @ ${this.memory.offset}`);
            }
            this.debug(`0x${this.memory.offset.toString(16).padStart(3, '0')} ${cmd.name} (${cmd.code})`);
            this.memory.offset += cmd.run(this, this.memory.offset, codeMode.modes);

            if (this.isEnded) break;
            if (this.isWaiting) break;
        }
        this.debug('--Done: ', this.memory.state);
    }

    debugger(debug = true) {
        this._debug = debug;
    }
    _debug = false;
    debug(...args: any[]) {
        if (this._debug == false) {
            return;
        }
        console.log(...args);
    }

    quit() {
        this.memory.state = ComputerState.Ended;
        this.debug('-- Quit\n\n');
    }

    wait() {
        this.memory.state = ComputerState.WaitingInput;
        this.debug('-- Wait\n\n');
    }

    getCodeMode(offset: number): { code: number; modes: number[] } {
        const code = this.memory.ops[offset];
        const modes: number[] = [];
        if (code < 100) {
            return {
                code,
                modes,
            };
        }
        let codes = Math.floor(code / 100);
        const outputCode = code % 100;
        while (codes > 0) {
            const mode = codes % 10;
            modes.push(mode);
            codes = Math.floor(codes / 10);
        }
        return {
            code: outputCode,
            modes,
        };
    }

    gets(offset: number, mode: number): number {
        // Lookup mode
        if (mode == null || mode == 0) {
            return this.memory.ops[this.memory.ops[offset]];
        }
        // Direct mode
        if (mode == 1) {
            return this.memory.ops[offset];
        }
        throw new Error('Unknown get mode: ' + mode);
    }

    set(offset: number, value: number) {
        this.memory.ops[offset] = value;
    }

    get output(): number | undefined {
        return this.memory.output[this.memory.output.length - 1];
    }

    get isWaiting() {
        return this.memory.state == ComputerState.WaitingInput || this.memory.state == ComputerState.Ready;
    }

    get isEnded() {
        return this.memory.state == ComputerState.Ended;
    }
}

Computer.register(new CodeAdd());
Computer.register(new CodeMultiply());
Computer.register(new CodeInput());
Computer.register(new CodeOutput());
Computer.register(new CodeJumpTrue());
Computer.register(new CodeJumpFalse());
Computer.register(new CodeIfLess());
Computer.register(new CodeIfEqual());
Computer.register(new CodeEnd());
