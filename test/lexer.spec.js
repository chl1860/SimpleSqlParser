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

    it('tests generate ast node by empty node array', function () {
        var nodeList = [];
        var lexer = new Lexer('');

        var ast = lexer.GenerateAstNode(nodeList);
        expect(ast).toEqual(null);
    });

    it("tests genert ast method's parameter", function () {
        var nodeList = '';
        var lexer = new Lexer('');
        expect(function () { lexer.GenerateAstNode(nodeList); }).toThrow("The parameter of GenerateAstNode should be array");
    });

    it('tests  generate ast node methods', function () {
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

    it('tests generate ast node with logical node', function () {
        var str2 = "FUNC_CODE = 'BB' AND REGION_CODE = 'CC' OR TT IN ('MMMM')"
        var lexer = new Lexer(str2);
        var nodeListist = lexer.generateNodeList();
        var ast = lexer.GenerateAstNode(nodeListist);

        var funcNode = new ASTNode("Literal", "FUNC_CODE", null, null, null);
        var funcEqNode = new ASTNode("MathExpr", "=", null, null, null);
        var funcValNode = new ASTNode("Literal", "'BB'", null, null, null);
        funcEqNode.left = funcNode;
        funcEqNode.right = funcValNode;
        funcNode.parent = funcEqNode;
        funcValNode.parent = funcEqNode;

        var regNode = new ASTNode("Literal", "REGION_CODE", null, null, null);
        var regEqNode = new ASTNode("MathExpr", "=", null, null, null);
        var regValNode = new ASTNode("Literal", "'CC'", null, null, null);
        regEqNode.left = regNode;
        regEqNode.right = regValNode;
        regNode.parent = regEqNode;
        regValNode.parent = regEqNode;

        var andNode = new ASTNode('LogicalExpr', 'AND', funcEqNode, regEqNode, null);
        funcEqNode.parent = andNode;
        regEqNode.parent = andNode;

        var inFieldNode = new ASTNode('Literal', 'TT', null, null, null);
        var inValNode = new ASTNode('Literal', "('MMMM')", null, null, null);
        var inNode = new ASTNode('MathExpr', 'IN', null, null, null);
        var orNode = new ASTNode('LogicalExpr', 'OR', null, null, null);
        orNode.left = andNode;
        orNode.right = inNode;
        andNode.parent = orNode;

        inNode.parent = orNode;
        inNode.left = inFieldNode;
        inFieldNode.parent = inNode;
        
        inNode.right = inValNode;
        inValNode.parent = inNode;

        expect(ast).toEqual(orNode);
    });
})