import { ComputerCommand } from './code';

export class CodeEnd extends ComputerCommand {
    name = 'end';
    code = 99;

    run(offset: number, modes: number[]): number {
        this.computer.quit();
        return 0;
    }
}
