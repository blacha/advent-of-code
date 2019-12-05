import { ComputerCommand } from './code';

export class CodeJumpTrue extends ComputerCommand {
    name = 'jump-if-true';
    code = 5;

    run(offset: number, modes: number[]): number {
        const valA = this.computer.gets(offset + 1, modes[0]);
        const jumpAddr = this.computer.gets(offset + 2, modes[1]);
        if (valA != 0) {
            this.computer.debug('\t', this.name, 'to', jumpAddr);
            return jumpAddr - offset;
        }

        return 3;
    }
}
export class CodeJumpFalse extends ComputerCommand {
    name = 'jump-if-False';
    code = 6;

    run(offset: number, modes: number[]): number {
        const valA = this.computer.gets(offset + 1, modes[0]);
        const jumpAddr = this.computer.gets(offset + 2, modes[1]);
        if (valA == 0) {
            this.computer.debug('\t', this.name, 'to', jumpAddr, offset, jumpAddr - offset);
            return jumpAddr - offset;
        }

        return 3;
    }
}
