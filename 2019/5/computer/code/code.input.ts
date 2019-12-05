import { ComputerCommand } from './code';

export class CodeInput extends ComputerCommand {
    name = 'input';
    code = 3;
    run(offset: number, modes: number[]): number {
        const inputVal = this.computer.input.shift();
        if (inputVal == null) {
            throw new Error('Missing input');
        }
        const outputOffset = this.computer.gets(offset + 1, 1);
        this.computer.debug('\t', this.name, inputVal);

        this.computer.set(outputOffset, inputVal);
        return 2;
    }
}
