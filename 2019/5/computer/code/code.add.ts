import { Computer } from '../int.computer';
import { ComputerCommand } from './code';

export class CodeAdd extends ComputerCommand {
    name = 'add';
    code = 1;

    run(computer: Computer, offset: number, modes: number[]): number {
        const valA = computer.gets(offset + 1, modes[0]);
        const valB = computer.gets(offset + 2, modes[1]);
        const outputOffset = computer.gets(offset + 3, 1);
        computer.debug('\t', this.name, valA, '+', valB, '=>', outputOffset, 'Modes', modes);
        computer.set(outputOffset, valA + valB);
        return 4;
    }
}
