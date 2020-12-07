import { Computer } from '../int.computer';

export abstract class ComputerCommand {
  abstract name: string;
  abstract code: number;

  abstract run(computer: Computer, offset: number, modes: number[]): number;
}
