const fs = require('fs')

function getFuel(input) {
    return Math.floor(input / 3) - 2
}

function getFuelOfFuel(input, count = 0) {
    const newFuel = getFuel(input)
    console.log(newFuel, input)
    if (newFuel < 0) {
        return input
    }
    if (count > 10) {
        return newFuel
    }
    return input + getFuelOfFuel(newFuel, count + 1)
}

console.assert(getFuel(12) == 2, 12);
console.assert(getFuelOfFuel(12) == 2, 12)
console.assert(getFuel(14) == 2, 14);

console.assert(getFuel(1969) == 654, 1969);
console.assert(getFuelOfFuel(getFuel(1969)) == 966, getFuelOfFuel(getFuel(1969)) + ' vs ' + getFuel(1969))

console.assert(getFuel(100756) == 33583, 100756);
console.assert(getFuelOfFuel(getFuel(100756)) == 50346, getFuelOfFuel(getFuel(100756)) + ' vs ' + getFuel(100756))

const lines = fs.readFileSync('./input').toString().split('\n').map(f => parseInt(f, 10))
let total = 0
let fuelOfFuel = 0;
for (const line of lines) {
    if (isNaN(line)) {
        break;
    }
    const fuel = getFuel(line)
    total += getFuel(line)
    fuelOfFuel += getFuelOfFuel(fuel)
}

console.log(total, fuelOfFuel, getFuelOfFuel(total))
