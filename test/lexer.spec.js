var Lexer = require('../src/lexer').Lexer;
var ASTNode = require('../src/astnode').ASTNode;

describe('Lexer test', function () {

    it('tests split string by space',function(){
        var str1 = 'Abc and "CDE" AND "mn"';
        var array = str1.split(/\s/g);
        
        expect(array).toEqual(['Abc','and','\"CDE\"','AND','\"mn\"']);
    });

    it('tests merged array method',function(){
        var str = "A and b and '(c, d, e)'";
        var str1 = "FUNC_CODE = 'aA'";
        var str2 = "(FUNC_CODE = 'aA')";

        var lexer = new Lexer("");
        var result = lexer.getMergedArray(str);
        var result1 = lexer.getMergedArray(str1);
        var result2 = lexer.getMergedArray(str2);

        expect(result).toEqual(["A","and","b","and","'(c, d, e)'"]);
        expect(result1).toEqual(["FUNC_CODE","=","'aA'"]);
        expect(result2).toEqual(["FUNC_CODE","=","'aA'"]);

    });
    it('tests generate tokenized node list methods', function () {
        var sqlStr = "FUNC_CODE = 'AAA' AND REGION_CODE = 'abc'";

        var lexer = new Lexer();
        var array = lexer.getMergedArray(sqlStr);
        var nodeList = lexer.generateTokenizedNodeList(array);
        var funcNode = new ASTNode("Literal", "FUNC_CODE", null, null, null);
        var funcEqNode = new ASTNode("MathExpr", "=", null, null, null);
        var funcValNode = new ASTNode("Literal", "'AAA'", null, null, null);
        var logicNode = new ASTNode("LogicalExpr", "AND", null, null, null);
        var regNode = new ASTNode("Literal", "REGION_CODE", null, null, null);
        var regEqNode = new ASTNode("MathExpr", "=", null, null, null);
        var reqValNode = new ASTNode("Literal", "'abc'", null, null, null);

        expect(nodeList).toEqual([funcNode, funcEqNode, funcValNode, logicNode, regNode, regEqNode, reqValNode]);
    });
})