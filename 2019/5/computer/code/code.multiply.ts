import { ComputerCommand } from './code';

export class CodeMultiply extends ComputerCommand {
    name = 'multiply';
    code = 2;

    run(offset: number, modes: number[]): number {
        const valA = this.computer.gets(offset + 1, modes[0]);
        const valB = this.computer.gets(offset + 2, modes[1]);
        const outputOffset = this.computer.gets(offset + 3, 1);
        this.computer.debug('\t', this.name, valA, '+', valB, '=>', outputOffset, 'Modes', modes);
        this.computer.set(outputOffset, valA * valB);
        return 4;
    }
}
