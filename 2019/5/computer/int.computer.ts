import { ComputerCommand } from './code/code';
import { CodeAdd } from './code/code.add';
import { CodeMultiply } from './code/code.multiply';
import { CodeInput } from './code/code.input';
import { CodeOutput } from './code/code.output';
import { CodeIfLess, CodeIfEqual } from './code/code.if';
import { CodeEnd } from './code/code.end';
import { CodeJumpTrue, CodeJumpFalse } from './code/code.jump';

export class Computer {
    Commands: Record<number, ComputerCommand> = {};

    ops: number[] = [];
    offset = 0;
    input: number[] = [];
    output: number[] = [];
    ended = false;

    constructor(ops?: string, input: number[] = []) {
        this.register(new CodeAdd(this));
        this.register(new CodeMultiply(this));
        this.register(new CodeInput(this));
        this.register(new CodeOutput(this));
        this.register(new CodeJumpTrue(this));
        this.register(new CodeJumpFalse(this));
        this.register(new CodeIfLess(this));
        this.register(new CodeIfEqual(this));
        this.register(new CodeEnd(this));

        if (ops == null) {
            return;
        }
        this.run(ops, input);
    }

    register(cmd: ComputerCommand) {
        this.Commands[cmd.code] = cmd;
    }

    run(ops: string, input: number[] = []) {
        this.ops = ops.split(',').map(c => parseInt(c, 10));
        this.offset = 0;
        this.input = input;
        this.output = [];
        this.ended = false;
        this.compute();
    }

    compute() {
        this.debug('-- Start', this.ops);
        while (this.offset > -1 && this.offset < this.ops.length) {
            const codeMode = this.getCodeMode(this.offset);

            const cmd = this.Commands[codeMode.code];
            if (cmd == null) {
                throw new Error(`Invalid Code ${this.ops[this.offset]} @ ${this.offset}`);
            }
            this.debug(`0x${this.offset.toString(16).padStart(3, '0')} ${cmd.name} (${cmd.code})`);
            this.offset += cmd.run(this.offset, codeMode.modes);

            if (this.ended) break;
        }
    }

    _debug = false;
    debug(...args: any[]) {
        if (this._debug == false) {
            return;
        }
        console.log(...args);
    }

    quit() {
        this.ended = true;
        this.debug('-- Quit\n\n');
    }

    getCodeMode(offset: number): { code: number; modes: number[] } {
        const code = this.ops[offset];
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
            return this.ops[this.ops[offset]];
        }
        // Direct mode
        if (mode == 1) {
            return this.ops[offset];
        }
        throw new Error('Unknown get mode: ' + mode);
    }

    set(offset: number, value: number) {
        this.ops[offset] = value;
    }
}
