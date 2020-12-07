import { ComputerCommand } from './code';
import { Computer } from '../int.computer';

export class CodeOutput extends ComputerCommand {
  name = 'output';
  code = 4;

  run(computer: Computer, offset: number, modes: number[]): number {
    const valA = computer.get(offset + 1, modes.shift());
    computer.state.output.push(valA);
    computer.print('\t', this.name, valA);
    return 2;
  }
}
