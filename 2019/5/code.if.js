class CodeIfLess {
    name = 'if-less'
    code = 7

    constructor(computer) {
        this.computer = computer
    }

    run(offset, modes) {
        const valA = this.computer.gets(offset + 1, modes[0])
        const valB = this.computer.gets(offset + 2, modes[1])
        const outputOffset = this.computer.gets(offset + 3, 1);
        console.log('\t', this.name, valA, '<', valB, '=>', outputOffset, 'Modes', modes)
        this.computer.set(outputOffset, valA < valB ? 1 : 0);
        return 4;
    }
}
class CodeIfEqual {
    name = 'if-equal'
    code = 8

    constructor(computer) {
        this.computer = computer
    }

    run(offset, modes) {
        const valA = this.computer.gets(offset + 1, modes[0])
        const valB = this.computer.gets(offset + 2, modes[1])
        const outputOffset = this.computer.gets(offset + 3, 1);
        console.log('\t', this.name, valA, '==', valB, '=>', outputOffset, 'Modes', modes)
        this.computer.set(outputOffset, valA == valB ? 1 : 0);
        return 4;
    }
}




module.exports = {
    CodeIfLess,
    CodeIfEqual
}
