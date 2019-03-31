var ASTNode = require('./astnode').ASTNode;

var Util = require('./util').Util;

function Lexer(str) {
    this.str = str;
    this.util = new Util(); 
}

Lexer.prototype.getMergedArray = function (str) {
    //step1: split str by space
    let array = str.split(/\s/g);
    let len = array.length;
    let result = [];
    let self = this;

    for (let i = 0, j = i - 1; i < len; i++ , j++) { //merge
        if (j !== -1 && result[j] && !self.util.isFullString(result[j])) {

            do {
                result[j] = `${result[j]} ${array[i]}`
                i++;
            } while (!self.util.isFullString(result[j]) && i < len)

        } else {
            result.push(array[i]);
        }
    }

    result.forEach(o => o.replace(/(?:^\s+|\s+$)/g, "")); //去掉首尾空格
    //排除：(FUNC_CODE = 'aa') 这一类的情况
    if (str && result[0] === str) {
        str = /\(([^\)]*)\)/g.exec(str)[1];
        return self.getMergedArray(str);
    }

    return result;
}

Lexer.prototype.generateTokenizedNodeList = function () {
    var self = this;
    var tokenArray = self.getMergedArray(self.str);
    return tokenArray.map(o => {
        if (self.util.isMathExpr(o)) {
            return new ASTNode("MathExpr", o, null, null, null);
        } else if (self.util.isLogicExpr(o)) {
            return new ASTNode("LogicalExpr", o, null, null, null);
        } else {
            return new ASTNode("Literal", o, null, null, null);
        }
    });
}

module.exports = {
    Lexer
}