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
Lexer.prototype.GenerateAstNode = function () {
    //var nodeList = this.generateNodeList();
}

Lexer.prototype.generateNodeList = function () {
    return this.tokenArray.map(o => {
        if (isMathExpr(o)) {
            return new ASTNode("MathExpr", o, null, null);
        } else if (isLogicExpr(o)) {
            return new ASTNode("LogicalExpr", o, null, null);
        } else {
            return new ASTNode("Literal", o, null, null);
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