class CodeInput {

    name = 'input'
    code = 3

    constructor(computer) {
        this.computer = computer
    }

    run(offset, modes) {
        const inputVal = this.computer.input.shift();
        if (inputVal == null) {
            throw new Error('Missing input')
        }
        const outputOffset = this.computer.gets(offset + 1, 1);
        console.log('\t', this.name, inputVal)

        this.computer.set(outputOffset, inputVal);
        return 2
    }
}


module.exports = CodeInput;
