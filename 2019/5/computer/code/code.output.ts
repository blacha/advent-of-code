import { ComputerCommand } from './code';
import { Computer } from '../int.computer';

export class CodeOutput extends ComputerCommand {
    name = 'output';
    code = 4;

    run(computer: Computer, offset: number, modes: number[]): number {
        const valA = computer.gets(offset + 1, modes[0]);
        computer.memory.output.push(valA);
        computer.debug('\t', this.name, offset, valA);
        return 2;
    }
}
