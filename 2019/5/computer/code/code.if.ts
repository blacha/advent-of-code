import { ComputerCommand } from './code';
import { Computer } from '../int.computer';

export class CodeIfLess extends ComputerCommand {
    name = 'if-less';
    code = 7;

    run(computer: Computer, offset: number, modes: number[]): number {
        const valA = computer.gets(offset + 1, modes[0]);
        const valB = computer.gets(offset + 2, modes[1]);
        const outputOffset = computer.gets(offset + 3, 1);
        computer.debug('\t', this.name, valA, '<', valB, '=>', outputOffset, 'Modes', modes);
        computer.set(outputOffset, valA < valB ? 1 : 0);
        return 4;
    }
}
export class CodeIfEqual extends ComputerCommand {
    name = 'if-equal';
    code = 8;

    run(computer: Computer, offset: number, modes: number[]): number {
        const valA = computer.gets(offset + 1, modes[0]);
        const valB = computer.gets(offset + 2, modes[1]);
        const outputOffset = computer.gets(offset + 3, 1);
        computer.debug('\t', this.name, valA, '==', valB, '=>', outputOffset, 'Modes', modes);
        computer.set(outputOffset, valA == valB ? 1 : 0);
        return 4;
    }
}
