const dupes = ['00', '11', '22', '33', '44', '55', '66', '77', '88', '99'];

function hasDupe(str: string) {
    for (const dupe of dupes) {
        if (str.includes(dupe)) {
            return true;
        }
    }
    return false;
}

function hasIncrease(str: string) {
    let firstChar = str.charCodeAt(0);
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

export function hasDoubleDupe(str: string) {
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

export function checkInput(iStr: string) {
    if (!hasDupe(iStr)) {
        return false;
    }

    if (!hasIncrease(iStr)) {
        return false;
    }
    return true;
}
