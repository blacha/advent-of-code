import { ComputerCommand } from './code';
import { Computer } from '../int.computer';

export class CodeMultiply extends ComputerCommand {
    name = 'multiply';
    code = 2;

    run(computer: Computer, offset: number, modes: number[]): number {
        const valA = computer.get(offset + 1, modes.shift());
        const valB = computer.get(offset + 2, modes.shift());
        const outputOffset = computer.offset(offset + 3, modes.shift());

        computer.print('\t', this.name, valA, 'x', valB, '=>', outputOffset, 'Modes', modes);
        computer.set(outputOffset, valA * valB);
        return 4;
    }
}
