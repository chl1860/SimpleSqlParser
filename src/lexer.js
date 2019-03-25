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
    if (len === 0) {
        return null;
    }
    if (1 === len) {
        return nodeList[len - 1];

    } else if (len === 2 || len === -1) {
        throw "The node list's length error";
    }
 
    nodeList[len - 2].left = nodeList[len - 3]
    nodeList[len - 2].left.parent = nodeList[len - 2];
    nodeList[len - 2].right = nodeList[len - 1];
    nodeList[len - 2].right.parent = nodeList[len - 2];

    nodeList.splice(len - 3, 1);
    nodeList.splice(nodeList.length - 1, 1);

    return self.GenerateAstNode(nodeList);
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