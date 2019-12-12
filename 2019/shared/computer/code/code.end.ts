import { ComputerCommand } from './code';
import { Computer } from '../int.computer';

export class CodeEnd extends ComputerCommand {
    name = 'end';
    code = 99;

    run(computer: Computer, offset: number, modes: number[]): number {
        computer.quit();
        return 0;
    }
}
