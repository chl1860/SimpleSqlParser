var ASTNode = require('./astnode')
var Stack = require('./stack').Stack;
var mathTokens = ['='];
var synaxTokens = ['\'', '"', '(', ')'];
var sqlTokens = ['in', 'like'];

function Tokenizer() {
}

function isExists(str) {
    return [...mathTokens, ...sqlTokens, ...synaxTokens].filter(o => o === str).length > 0;
}
function isMathExprOperation(str) {
    return mathTokens.filter(o => o === str).length > 0;
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
    let result = [];

    for (let i = 0,j=i-1; i < array.length; i++,j++) { //merge
        if (j!== -1 && result[j] && !this.isFullString(result[j])) {
           //Todo: !isFullStirng 做合并
        } else {
            result.push(array[i]);
        }
    }
    return result;
}

/**
 * @param {char} ch
 * @returns {type,val,leftNode,rightNode} 
 */
Tokenizer.prototype.GenerateTokenNode = function (ch) {
    while (!isExists(ch)) {
        stack.push(ch);
    }
    if (isMathExprOperation(ch) && stack.len) {
        var exprNode = new ASTNode("MathExpression", 'ch', null, null);
    }
}

module.exports = {
    Tokenizer: Tokenizer
}