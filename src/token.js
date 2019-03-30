var Stack = require('./stack').Stack;

function Tokenizer() {
}

Tokenizer.prototype.isFullString = function (str) {//这里只对单引号和括号做区分
    //不包含  '' 的字符串
    if (str.indexOf("'") === -1 && str.indexOf("(") === -1) {
        return true
    }

    let index = 0;
    let checker = null;
    let sigleQuoteRegx = /\'/;
    let braceRegx = /(?:\(|\))/;
    let singleQuoteIndex = str.indexOf("'");
    let braceIndex = str.indexOf("(");

    if (singleQuoteIndex !== -1 && braceIndex !== -1) { //当单引号和括号同时存在时，谁先出现以谁为准
        if (singleQuoteIndex < braceIndex) {
            checker = sigleQuoteRegx;
        } else {
            checker = braceRegx;
        }
    } else if (str.indexOf("(") !== -1) {
        index = str.indexOf("(");
        checker = braceRegx;
    } else {
        index = str.indexOf("'");
        checker = sigleQuoteRegx;
    }

    let subStr = str.slice(index);
    let stack = new Stack();

    for (const ch of subStr.split('')) {
        if (checker) {
            if (checker.test(ch)) {
                stack.clear();
            } else {
                stack.push(ch);
            }
        }
    }

    return stack.len === 0
}

Tokenizer.prototype.getMergedArray = function (str) {
    //step1: split str by space
    let array = str.split(/\s/g);
    let len = array.length;
    let result = [];
    let self = this;

    for (let i = 0, j = i - 1; i < len; i++ , j++) { //merge
        if (j !== -1 && result[j] && !this.isFullString(result[j])) {

            do {
                result[j] = `${result[j]} ${array[i]}`
                i++;
            } while (!this.isFullString(result[j]) && i < len)

        } else {
            result.push(array[i]);
        }
    }

    result.forEach(o => o.replace(/(?:^\s+|\s+$)/g, "")); //去掉首尾空格
    //排除：(FUNC_CODE = 'aa') 这一类的情况
    if (str && result[0] === str) {
        str = str.replace(/\(([^\)]+)\)/,RegExp.$1);
        return self.getMergedArray(str);
    }

    return result;
}

module.exports = {
    Tokenizer: Tokenizer
}