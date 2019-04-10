var ASTNode = require('./astnode').ASTNode;

var Util = require('./util').Util;

function Lexer(str) {
    // this.str = str;
    this.util = new Util();
}

Lexer.prototype.getMergedArray = function (str) {
    //step1: split str by space
    let array = str.split(/\s/g);
    let len = array.length;
    let result = [];
    let self = this;

    let i = 0, j = i - 1;
    while (i < len && j < len) { //merge
        if (j !== -1 && result[j] && !self.util.isFullString(result[j])) {

            do {
                result[j] = `${result[j]} ${array[i]}`
                i++;
            } while (!self.util.isFullString(result[j]) && i < len)

        } else {
            result.push(array[i]);
            i++;
            j++;
        }
    }

    result.forEach(o => o.replace(/(?:^\s+|\s+$)/g, "")); //去掉首尾空格
    //排除：(FUNC_CODE = 'aa') 这一类的情况
    if (str && result[0] === str) {
        let newStr = /\(([^\)]*)\)/g.exec(str);
        if(newStr !== null){
        return self.getMergedArray(newStr[1]);
    }
    }

    return result;
}

//Todo: Need debug and update
Lexer.prototype.generateTokenizedNodeList = function (tokenArray = []) {
    var self = this;
    var list = [];
    // var tokenArray = self.getMergedArray(self.str);
    tokenArray.forEach((o,index) => {
        if (self.util.isMathExpr(o) && !/^\(/g.test(o)) {
            list.push(new ASTNode("MathExpr", o, null, null, null));
        } else if (self.util.isLogicExpr(o) && !/^\(/g.test(o)) {
            list.push(new ASTNode("LogicalExpr", o, null, null, null))
        } else {
            if (/^\(/g.test(o)) {
                 if(list.length === 0 || list[index-1].type === 'MathExpr' && !/\bin\b/i.test(list[index-1].value)){
                     self.generateTokenizedNodeList(self.getMergedArray(o));
                     list.reverse();
                 }else{
                     list.push( new ASTNode("Literal", o, null, null, null));
                 }
             } else {
                list.push( new ASTNode("Literal", o, null, null, null));
            }
        }
    });

    return list;
}

module.exports = {
    Lexer
}