class CodeOutput {
    name = 'output'
    code = 4

    constructor(computer) {
        this.computer = computer
    }

    run(offset, modes) {
        const valA = this.computer.gets(offset + 1, modes[0])
        this.computer.output.push(valA);
        console.log('\t', this.name, offset, valA)
        return 2;
    }
}


module.exports = CodeOutput;
