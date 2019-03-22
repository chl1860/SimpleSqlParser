var Lexer = require('../src/lexer').Lexer;
var ASTNode = require('../src/astnode').ASTNode;

describe('Lexer test', function () {
    it('tests generate node list methods', function () {
        var sqlStr = "FUNC_CODE = 'AAA' AND REGION_CODE = 'abc'";

        var lexer = new Lexer(sqlStr);
        var nodeList = lexer.generateNodeList();
        var funcNode = new ASTNode("Literal", "FUNC_CODE", null, null);
        var funcEqNode = new ASTNode("MathExpr", "=", null, null);
        var funcValNode = new ASTNode("Literal", "'AAA'", null, null);
        var logicNode = new ASTNode("LogicalExpr", "AND", null, null);
        var regNode = new ASTNode("Literal", "REGION_CODE", null, null);
        var regEqNode = new ASTNode("MathExpr", "=", null, null);
        var reqValNode = new ASTNode("Literal", "'abc'", null, null);

        expect(nodeList).toEqual([funcNode, funcEqNode, funcValNode, logicNode, regNode, regEqNode, reqValNode]);
    });
})