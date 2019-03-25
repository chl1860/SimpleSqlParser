var ASTNode = require('./astnode').ASTNode;
var Tokenizer = require('./token').Tokenizer;

function Lexer(str) {
    let tokenizer = new Tokenizer();
    this.tokenArray = tokenizer.getMergedArray(str);
}

/**
 * 根据词法对 str 进行拆分
 * @example "FUNC_CODE='ABC' AND REGION_CODE = 'MN'" => ["FUNC_CODE='ABC'","REGION_CODE = 'MN'"]
 */
Lexer.prototype.GenerateAstNode = function (nodeList) {
    // var nodeList = this.generateNodeList();
    var self = this;
    var len = nodeList.length;
    if (!/\barray\b/ig.test(Object.prototype.toString.call(nodeList))) {
        throw 'The parameter of GenerateAstNode should be array';
    }
    if (len === 0) {
        return null;
    }
    else if (len === 1) {
        return nodeList[len - 1];
    } else {
        //生成树
        return nodeList.reduce((prev, curr, index, array) => {
            if (curr.type === 'MathExpr') {
                if (prev.type === 'Literal') {
                    curr.left = prev;
                    prev.parent = curr;
                    return curr;
                } else if (prev.type === 'LogicalExpr') {
                    curr.left = prev.right;
                    prev.right.parent = curr;
                    prev.right = curr;
                    curr.parent = prev;

                    return prev;
                }

            } else if (curr.type === 'LogicalExpr') {
                curr.left = prev;
                prev.parent = curr;

                return curr;
            } else if (curr.type === 'Literal') {
                if (prev.type === 'LogicalExpr' || prev.type === 'MathExpr') {
                    if (prev.right === null) {
                        prev.right = curr;
                        curr.parent = prev;
                    }else{
                        let p = prev;
                        let temp = null
                        while(p){
                            temp = p;
                            p = p.right;
                        }
                        temp.right = curr;
                        curr.parent = temp;
                    }
                    return prev;
                }
                return curr;
            }
        });
    }
}


Lexer.prototype.generateNodeList = function () {
    return this.tokenArray.map(o => {
        if (isMathExpr(o)) {
            return new ASTNode("MathExpr", o, null, null, null);
        } else if (isLogicExpr(o)) {
            return new ASTNode("LogicalExpr", o, null, null, null);
        } else {
            return new ASTNode("Literal", o, null, null, null);
        }
    });
}

Lexer.prototype.generateAST = function(){
    var nodeListist = this.generateNodeList();
    return  this.GenerateAstNode(nodeListist);
}

function isMathExpr(str) {
    var mathTokens = ['=', 'in', 'like'];
    return mathTokens.filter(o => o === str.toLowerCase()).length > 0;
}

function isLogicExpr(str) {
    var logicTokens = ['AND', 'OR']
    return logicTokens.filter(o => o === str.toUpperCase()).length > 0;

}

module.exports = {
    Lexer
}