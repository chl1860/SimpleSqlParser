var Stack = require('./stack').Stack;

/**
 * 提供通用的工具方法
 */

function Util(){

}
/**
 * @description 判断是否为计算表达式
 */
Util.prototype.isMathExpr = function isMathExpr(str) {
    var mathTokens = [/\=/ig, /\b(?:In)\b/ig, /\blike\b\s+/ig,/\bis\b/ig];
    return mathTokens.filter(o => o.test(str)).length > 0;
}

/**
 * @description 判断是否为逻辑表达式
 */
Util.prototype.isLogicExpr = function isLogicExpr(str) {
    var logicTokens = [/\bAND\b/ig, /\bOR\b/ig];
    return logicTokens.filter(o => o.test(str)).length > 0;

}

Util.prototype.isFullString = function (str) {//这里只对单引号和括号做区分
    if(!str){
        throw "The parameter of isFullString is invalid";
    }
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

module.exports = {
    Util
};
