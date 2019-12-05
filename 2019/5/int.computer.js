const CodeMultiply = require('./code.multiply')
const CodeAdd = require('./code.add')
const CodeEnd = require('./code.end')
const CodeInput = require('./code.input')
const CodeOutput = require('./code.output')
const CodeIf = require('./code.if')
const CodeJump = require('./code.jump');

class IntComputer {
    Commands = {
        1: new CodeAdd(this),
        2: new CodeMultiply(this),
        3: new CodeInput(this),
        4: new CodeOutput(this),
        5: new CodeJump.CodeJumpTrue(this),
        6: new CodeJump.CodeJumpFalse(this),
        7: new CodeIf.CodeIfLess(this),
        8: new CodeIf.CodeIfEqual(this),
        99: new CodeEnd(this)
    }

    debug = true

    constructor(ops, input = []) {
        if (this.ops == null) {
            return;
        }
        this.run(ops, input)
    }

    run(ops, input = []) {
        this.ops = ops.split(',').map(c => parseInt(c, 10));
        this.offset = 0;
        this.input = input
        this.output = []
        this.compute();
    }

    compute() {
        this.debug && console.log('-- Start', this.ops)
        while (this.offset > -1 && this.offset < this.ops.length) {

            const codeMode = this.getCodeMode(this.offset);

            const cmd = this.Commands[codeMode.code];
            if (cmd == null) {
                throw new Error(`Invalid Code ${this.ops[this.offset]} @ ${this.offset}`)
            }
            this.debug && console.log(`0x${this.offset.toString(16).padStart(3,'0')} ${cmd.name} (${cmd.code})`)
            this.offset += cmd.run(this.offset, codeMode.modes)
        }
    }

    quit() {
        this.ended = true;
        this.debug && console.log('-- Quit\n\n')
    }

    getCodeMode(offset) {
        const code = this.ops[offset];
        const modes = [];
        if (code < 100) {
            return {
                code,
                modes
            };
        }
        let codes = Math.floor(code / 100);
        const outputCode = code % 100;
        while (codes > 0) {
            const mode = codes % 10
            modes.push(mode);
            codes = Math.floor(codes / 10)
        }
        return {
            code: outputCode,
            modes
        }
    }

    gets(offset, mode) {
        // Lookup mode
        if (mode == null || mode == 0) {
            return this.ops[this.ops[offset]]
        }
        // Direct mode
        if (mode == 1) {
            return this.ops[offset]
        }
    }

    set(offset, value) {
        this.ops[offset] = value
    }
}


module.exports = IntComputer
