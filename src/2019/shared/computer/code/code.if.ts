import { ComputerCommand } from './code';
import { Computer } from '../int.computer';

export class CodeIfLess extends ComputerCommand {
  name = 'if-less';
  code = 7;

  run(computer: Computer, offset: number, modes: number[]): number {
    const valA = computer.get(offset + 1, modes.shift());
    const valB = computer.get(offset + 2, modes.shift());
    const outputOffset = computer.offset(offset + 3, modes.shift());

    computer.print('\t', this.name, valA, '<', valB, '=>', valA < valB, outputOffset, 'Modes', modes);
    computer.set(outputOffset, valA < valB ? 1 : 0);
    return 4;
  }
}
export class CodeIfEqual extends ComputerCommand {
  name = 'if-equal';
  code = 8;

  run(computer: Computer, offset: number, modes: number[]): number {
    const valA = computer.get(offset + 1, modes.shift());
    const valB = computer.get(offset + 2, modes.shift());
    const outputOffset = computer.offset(offset + 3, modes.shift());

    computer.print('\t', this.name, valA, '==', valB, '=>', offset + 1, offset + 2, outputOffset, 'Modes', modes);
    computer.set(outputOffset, valA == valB ? 1 : 0);

    return 4;
  }
}
