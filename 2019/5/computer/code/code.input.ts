import { ComputerCommand } from './code';
import { Computer } from '../int.computer';

export class CodeInput extends ComputerCommand {
    name = 'input';
    code = 3;
    run(computer: Computer, offset: number, modes: number[]): number {
        const inputVal = computer.memory.input.shift();

        // Need more input, hopefully someone will resume us with input
        if (inputVal == null) {
            computer.wait();
            return 0;
        }

        const outputOffset = computer.gets(offset + 1, 1);
        computer.debug('\t', this.name, inputVal);

        computer.set(outputOffset, inputVal);
        return 2;
    }
}
