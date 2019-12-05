import { Computer } from '../int.computer';

export abstract class ComputerCommand {
    abstract name: string;
    abstract code: number;
    computer: Computer;

    constructor(computer: Computer) {
        this.computer = computer;
    }

    abstract run(offset: number, modes: number[]): number;
}
