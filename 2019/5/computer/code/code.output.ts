import { ComputerCommand } from './code';

export class CodeOutput extends ComputerCommand {
    name = 'output';
    code = 4;

    run(offset: number, modes: number[]): number {
        const valA = this.computer.gets(offset + 1, modes[0]);
        this.computer.output.push(valA);
        this.computer.debug('\t', this.name, offset, valA);
        return 2;
    }
}
