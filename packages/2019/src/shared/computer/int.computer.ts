import { ComputerCommand } from './code/code';
import { CodeAdd } from './code/code.add';
import { CodeMultiply } from './code/code.multiply';
import { CodeInput } from './code/code.input';
import { CodeOutput } from './code/code.output';
import { CodeIfLess, CodeIfEqual } from './code/code.if';
import { CodeEnd } from './code/code.end';
import { CodeJumpTrue, CodeJumpFalse } from './code/code.jump';
import { CodeOffset } from './code/code.offset';

export enum ComputerState {
  Init = 'Init',
  Ready = 'Ready',
  Running = 'Running',
  WaitingInput = 'Waiting',
  Ended = 'Ended',
}

export enum ComputerParameterMode {
  Lookup = 0,
  Direct = 1,
  Relative = 2,
}

const Commands: Record<number, ComputerCommand> = {};

export interface ComputerMemory {
  state: ComputerState;
  memory: number[];
  offset: number;
  offsetRelative: number;
  input: number[];
  output: number[];
}

export class Computer {
  state: ComputerMemory;

  constructor() {
    this.state = this.reset();
  }

  init(ops: string): void {
    this.state.memory = ops.split(',').map((c) => parseInt(c, 10));
    this.state.state = ComputerState.Ready;
  }

  /** Clone the current state */
  clone(): Computer {
    const computer = new Computer();
    computer.state = JSON.parse(JSON.stringify(this.state));
    return computer;
  }

  static register(cmd: ComputerCommand): void {
    Commands[cmd.code] = cmd;
  }

  reset(): ComputerMemory {
    const state = {
      state: ComputerState.Init,
      memory: [],
      offset: 0,
      offsetRelative: 0,
      input: [],
      output: [],
    };
    this.state = state;
    return state;
  }

  run(ops?: string, input: number[] = []): void {
    this.reset();
    if (ops != null) {
      this.init(ops);
    }
    this.state.input = input;
    this.compute();
  }

  resume(input: number[] = []): void {
    if (!this.isWaiting) {
      throw new Error('Invalid resume state, state:' + this.state.state);
    }
    this.state.input = this.state.input.concat(input);
    this.compute();
  }

  compute(): void {
    this.state.state = ComputerState.Running;
    this.print('-- Start', this.state.memory.join(', '), this.state.input);
    while (this.state.offset > -1 && this.state.offset < this.state.memory.length) {
      const codeMode = this.getCodeMode(this.state.offset);

      const cmd = Commands[codeMode.code];
      if (cmd == null) {
        throw new Error(`Invalid Code ${this.state.memory[this.state.offset]} @ ${this.state.offset}`);
      }

      this.print(`${this.state.offset} ${cmd.name} (${cmd.code}) [${codeMode.modes.join(', ')}]`);
      this.state.offset += cmd.run(this, this.state.offset, codeMode.modes);
      if (codeMode.modes.length > 0) {
        throw Error('Unused modes: ' + cmd.name);
      }

      if (this.isEnded) break;
      if (this.isWaiting) break;
    }
    this.print('--Done: ', this.state.state);
  }

  debugger(debug = true): void {
    this._debug = debug;
  }

  private _debug = false;
  print(...args: any[]): void {
    if (this._debug == false) {
      return;
    }
    console.log(...args);
  }

  quit(): void {
    this.state.state = ComputerState.Ended;
    this.print('-- Quit\n\n');
  }

  wait(): void {
    this.state.state = ComputerState.WaitingInput;
    this.print('-- Wait\n\n');
  }

  getCodeMode(offset: number): { code: number; modes: number[] } {
    const code = this.state.memory[offset];
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

  offset(offset: number, mode = 0): number {
    // Lookup mode
    if (mode == ComputerParameterMode.Lookup) {
      return this.value(offset);
    }

    // Direct mode
    if (mode == ComputerParameterMode.Direct) {
      return offset;
    }

    // relative
    if (mode == ComputerParameterMode.Relative) {
      return this.state.offsetRelative + this.value(offset);
    }
    throw new Error('Unknown get mode: ' + mode);
  }

  get(offset: number, mode = 0): number {
    const addr = this.offset(offset, mode);
    return this.value(addr);
  }

  value(offset: number): number {
    if (offset < 0) {
      throw new Error('Offset < 0 offset:' + offset);
    }
    return this.state.memory[offset] || 0;
  }

  set(offset: number, value: number): void {
    this.state.memory[offset] = value;
  }

  get output(): number | undefined {
    return this.state.output[this.state.output.length - 1];
  }

  get isWaiting(): boolean {
    return this.state.state == ComputerState.WaitingInput || this.state.state == ComputerState.Ready;
  }

  get isEnded(): boolean {
    return this.state.state == ComputerState.Ended;
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
Computer.register(new CodeOffset());
