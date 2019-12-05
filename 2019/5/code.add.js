module.exports = class CodeAdd {
    name = 'add'
    code = 1
    constructor(computer) {
        this.computer = computer
    }

    run(offset, modes) {
        const valA = this.computer.gets(offset + 1, modes[0])
        const valB = this.computer.gets(offset + 2, modes[1])
        const outputOffset = this.computer.gets(offset + 3, 1);
        console.log('\t', this.name, valA, '+', valB, '=>', outputOffset, 'Modes', modes)
        this.computer.set(outputOffset, valA + valB)
        return 4;
    }
}
