import { ComputerCommand } from './code';
import { Computer } from '../int.computer';

export class CodeOffset extends ComputerCommand {
  name = 'offset';
  code = 9;

  run(computer: Computer, offset: number, modes: number[]): number {
    const valA = computer.get(offset + 1, modes.shift());
    computer.state.offsetRelative += valA;
    computer.print('\t', this.name, valA, '=>', computer.state.offsetRelative, 'Modes', modes);

    return 2;
  }
}
