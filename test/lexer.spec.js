var Lexer = require('../src/lexer').Lexer;
var ASTNode = require('../src/astnode').ASTNode;

describe('Lexer test', function () {
    it('tests generate node list methods', function () {
        var sqlStr = "FUNC_CODE = 'AAA' AND REGION_CODE = 'abc'";

        var lexer = new Lexer(sqlStr);
        var nodeList = lexer.generateNodeList();
        var funcNode = new ASTNode("Literal", "FUNC_CODE", null, null, null);
        var funcEqNode = new ASTNode("MathExpr", "=", null, null, null);
        var funcValNode = new ASTNode("Literal", "'AAA'", null, null, null);
        var logicNode = new ASTNode("LogicalExpr", "AND", null, null, null);
        var regNode = new ASTNode("Literal", "REGION_CODE", null, null, null);
        var regEqNode = new ASTNode("MathExpr", "=", null, null, null);
        var reqValNode = new ASTNode("Literal", "'abc'", null, null, null);

        expect(nodeList).toEqual([funcNode, funcEqNode, funcValNode, logicNode, regNode, regEqNode, reqValNode]);
    });

    it('tests generate ast node by node array with single node', function () {

        var lexer = new Lexer('');
        var funcNode = new ASTNode("Literal", "FUNC_CODE", null, null, null);
        var nodeList = [funcNode];

        var ast = lexer.GenerateAstNode(nodeList);
        expect(ast).toEqual(nodeList[0])
    });

    it('tests generate ast node by empty node array',function(){
        var nodeList = [];
        var lexer = new Lexer('');

        var ast = lexer.GenerateAstNode(nodeList);
        expect(ast).toEqual(null);
    });

    it('tests generate ast node with length == 2 or length === -1',function(){
        var nodeList = ['',''];
        var lexer = new Lexer('');
        expect(function(){lexer.GenerateAstNode(nodeList);}).toThrow("The node list's length error");
    });

    it('tests generate ast node methods', function () {
        var str1 = "FUNC_CODE = 'AAA'";
        var lexer = new Lexer(str1);
        var nodeListist = lexer.generateNodeList();
        var ast = lexer.GenerateAstNode(nodeListist);

        var funcNode = new ASTNode("Literal", "FUNC_CODE", null, null, null);
        var funcEqNode = new ASTNode("MathExpr", "=", null, null, null);
        var funcValNode = new ASTNode("Literal", "'AAA'", null, null, null);
        funcEqNode.left = funcNode;
        funcEqNode.right = funcValNode;
        funcNode.parent = funcEqNode;
        funcValNode.parent = funcEqNode;

        expect(ast).toEqual(funcEqNode);
    });
})