const assert = require('assert');
const Input = {
    low: 240298,
    high: 784956
}
const dupes = ['00', '11', '22', '33', '44', '55', '66', '77', '88', '99']

function hasDupe(str) {
    for (const dupe of dupes) {
        if (str.includes(dupe)) {
            return true;
        }
    }
    return false;
}

function hasIncrease(str) {
    let firstChar = str.charCodeAt(0)
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        if (charCode >= firstChar) {
            firstChar = charCode;
        } else {
            return false;
        }
    }
    return true;
}

function hasDoubleDupe(str) {
    for (const dupe of dupes) {
        const dupeIndex = str.indexOf(dupe);
        if (dupeIndex == -1) {
            continue;
        }
        if (str.indexOf(dupe + dupe[0]) == dupeIndex) {
            continue;
        }
        if (str.indexOf(dupe + dupe) == dupeIndex) {
            continue;
        }
        if (str.indexOf(dupe + dupe + dupe[0]) == dupeIndex) {
            continue;
        }
        return true;
    }
    return false;
}

function checkInput(iStr) {
    if (!hasDupe(iStr)) {
        return false;
    }

    if (!hasIncrease(iStr)) {
        return false;
    }
    return true;
}

function tests() {
    assert.equal(checkInput('111111'), true);
    assert.equal(checkInput('223450'), false);
    assert.equal(checkInput('123789'), false);
}

tests()
const answerOne = []
for (let i = Input.low; i <= Input.high; i++) {
    const iStr = i.toString()
    if (checkInput(iStr)) {
        answerOne.push(iStr)
    }
}
console.log('Answer#1', answerOne.length)

const answerTwo = []
for (check of answerOne) {
    if (hasDoubleDupe(check)) {
        answerTwo.push(check)
    }
}

console.log('Answer#2', answerTwo.length)
