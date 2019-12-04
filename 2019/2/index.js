const assert = require('assert')
const data = ['1,0,0,3,99']

const add = {
    name: 'Add',
    size: 3,
    func(bytes, data) {
        console.log('Add', bytes[0], '+', bytes[1], '=>', bytes[2])
        data[bytes[2]] = bytes[0] + bytes[1]
    }
}
const mult = {
    name: 'Mult',
    size: 3,
    func(bytes, data) {
        console.log('Mult', bytes[0], '*', bytes[1], '=>', bytes[2])
        data[bytes[2]] = bytes[0] * bytes[1]
    }
}

const Opts = [null, add, mult]

function run(codes) {
    const ops = codes.split(',').map(c => parseInt(c, 10))
    for (let i = 0; i < ops.length; i++) {
        let code = parseInt(ops[i], 10);
        if (code == 99) {
            // console.log('END')
            break
        }
        if (code == 1) {
            // console.log('Add');
            const valA = ops[ops[i + 1]]
            const valB = ops[ops[i + 2]]
            // console.log('Add', i, valA, valB, 'Store @', ops[i + 3])
            ops[ops[i + 3]] = valA + valB
            i += 3;
            continue;
        }
        if (code == 2) {
            const valA = ops[ops[i + 1]]
            const valB = ops[ops[i + 2]]
            ops[ops[i + 3]] = valA * valB
            // console.log('Mult', i, valA, valB, 'Store @', ops[i + 3])
            i += 3;
            continue;
        }

    }
    // console.log(ops.join(','))
    return ops.join(',')
}

function runTest() {
    assert.equal(run('1,9,10,3,2,3,11,0,99,30,40,50'), '3500,9,10,70,2,3,11,0,99,30,40,50')
    assert.equal(run('1,0,0,0,99'), '2,0,0,0,99')
    assert.equal(run('2,4,4,5,99,0'), '2,4,4,5,99,9801')
    assert.equal(run('1,1,1,4,99,5,6,0,99'), '30,1,1,4,2,5,6,0,99')
}

// runTest()
function runPart1() {
    const input = '1,0,0,3,1,1,2,3,1,3,4,3,1,5,0,3,2,9,1,19,1,19,5,23,1,23,6,27,2,9,27,31,1,5,31,35,1,35,10,39,1,39,10,43,2,43,9,47,1,6,47,51,2,51,6,55,1,5,55,59,2,59,10,63,1,9,63,67,1,9,67,71,2,71,6,75,1,5,75,79,1,5,79,83,1,9,83,87,2,87,10,91,2,10,91,95,1,95,9,99,2,99,9,103,2,10,103,107,2,9,107,111,1,111,5,115,1,115,2,119,1,119,6,0,99,2,0,14,0'.split(',')
    input[1] = '12'
    input[2] = '2'
    console.log('Answer:', run(input.join(',')).split(',')[0])
}

function bruteForce(noun, verb) {
    const input = '1,0,0,3,1,1,2,3,1,3,4,3,1,5,0,3,2,9,1,19,1,19,5,23,1,23,6,27,2,9,27,31,1,5,31,35,1,35,10,39,1,39,10,43,2,43,9,47,1,6,47,51,2,51,6,55,1,5,55,59,2,59,10,63,1,9,63,67,1,9,67,71,2,71,6,75,1,5,75,79,1,5,79,83,1,9,83,87,2,87,10,91,2,10,91,95,1,95,9,99,2,99,9,103,2,10,103,107,2,9,107,111,1,111,5,115,1,115,2,119,1,119,6,0,99,2,0,14,0'.split(',')
    for (let i = 0; i < 100; i++) {
        input[1] = i
        for (let j = 0; j < 100; j++) {
            input[2] = j
            const firstAnswer = run(input.join(',')).split(',')[0]
            if (firstAnswer == '19690720') {
                console.log('Answer:', firstAnswer, i, j)
            }
        }
    }
}

bruteForce()
