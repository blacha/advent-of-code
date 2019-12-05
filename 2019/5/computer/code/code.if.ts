import { ComputerCommand } from './code';

export class CodeIfLess extends ComputerCommand {
    name = 'if-less';
    code = 7;

    run(offset: number, modes: number[]): number {
        const valA = this.computer.gets(offset + 1, modes[0]);
        const valB = this.computer.gets(offset + 2, modes[1]);
        const outputOffset = this.computer.gets(offset + 3, 1);
        this.computer.debug('\t', this.name, valA, '<', valB, '=>', outputOffset, 'Modes', modes);
        this.computer.set(outputOffset, valA < valB ? 1 : 0);
        return 4;
    }
}
export class CodeIfEqual extends ComputerCommand {
    name = 'if-equal';
    code = 8;

    run(offset: number, modes: number[]): number {
        const valA = this.computer.gets(offset + 1, modes[0]);
        const valB = this.computer.gets(offset + 2, modes[1]);
        const outputOffset = this.computer.gets(offset + 3, 1);
        this.computer.debug('\t', this.name, valA, '==', valB, '=>', outputOffset, 'Modes', modes);
        this.computer.set(outputOffset, valA == valB ? 1 : 0);
        return 4;
    }
}
