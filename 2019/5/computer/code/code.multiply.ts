import { ComputerCommand } from './code';
import { Computer } from '../int.computer';

export class CodeMultiply extends ComputerCommand {
    name = 'multiply';
    code = 2;

    run(computer: Computer, offset: number, modes: number[]): number {
        const valA = computer.gets(offset + 1, modes[0]);
        const valB = computer.gets(offset + 2, modes[1]);
        const outputOffset = computer.gets(offset + 3, 1);
        computer.debug('\t', this.name, valA, '+', valB, '=>', outputOffset, 'Modes', modes);
        computer.set(outputOffset, valA * valB);
        return 4;
    }
}
