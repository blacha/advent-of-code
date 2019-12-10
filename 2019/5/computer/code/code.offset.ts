import { ComputerCommand } from './code';
import { Computer } from '../int.computer';

export class CodeOffset extends ComputerCommand {
    name = 'offset';
    code = 9;

    run(computer: Computer, offset: number, modes: number[]): number {
        const valA = computer.gets(offset + 1, modes.shift());
        computer.memory.offsetRelative += valA;
        computer.debug('\t', this.name, valA, '=>', computer.memory.offsetRelative, 'Modes', modes);

        return 2;
    }
}
