import { Computer } from '../int.computer';
import { ComputerCommand } from './code';

export class CodeAdd extends ComputerCommand {
    name = 'add';
    code = 1;

    run(computer: Computer, offset: number, modes: number[]): number {
        const valA = computer.get(offset + 1, modes.shift());
        const valB = computer.get(offset + 2, modes.shift());
        const outputOffset = computer.offset(offset + 3, modes.shift());

        computer.print('\t', this.name, valA, '+', valB, '=>', outputOffset, 'Modes', modes);
        computer.set(outputOffset, valA + valB);
        return 4;
    }
}
