class CodeEnd {
    name = 'end'
    code = 99

    constructor(computer) {
        this.computer = computer
    }

    run(offset, modes) {
        this.computer.quit()
    }
}


module.exports = CodeEnd;
