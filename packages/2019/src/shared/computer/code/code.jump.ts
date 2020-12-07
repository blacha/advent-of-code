import { ComputerCommand } from './code';
import { Computer } from '../int.computer';

export class CodeJumpTrue extends ComputerCommand {
  name = 'jump-if-true';
  code = 5;

  run(computer: Computer, offset: number, modes: number[]): number {
    const valA = computer.get(offset + 1, modes.shift());
    const jumpAddr = computer.get(offset + 2, modes.shift());
    if (valA != 0) {
      computer.print('\t', this.name, 'to', jumpAddr);
      return jumpAddr - offset;
    }

    return 3;
  }
}
export class CodeJumpFalse extends ComputerCommand {
  name = 'jump-if-False';
  code = 6;

  run(computer: Computer, offset: number, modes: number[]): number {
    const valA = computer.get(offset + 1, modes.shift());
    const jumpAddr = computer.get(offset + 2, modes.shift());
    if (valA == 0) {
      computer.print('\t', this.name, 'to', jumpAddr, offset, jumpAddr - offset);
      return jumpAddr - offset;
    }

    return 3;
  }
}
