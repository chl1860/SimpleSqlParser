var ParserNm = require('../src/parser')
var ASTNode = require('../src/astnode').ASTNode;

describe('Test parse', function () {
    it('tests GenerateMathSearchFilter method', function () {
        var funcNode = new ASTNode("Literal", "FUNC_CODE", null, null, null);
        var funcEqNode = new ASTNode("MathExpr", "=", null, null, null);
        var funcValNode = new ASTNode("Literal", "'BB'", null, null, null);
        funcEqNode.left = funcNode;
        funcEqNode.right = funcValNode;
        funcNode.parent = funcEqNode;
        funcValNode.parent = funcEqNode;

        var funcNode2 = new ASTNode("Literal", "FUNC_CODE", null, null, null);
        var funcEqNode2 = new ASTNode("MathExpr", ">", null, null, null);
        var funcValNode2 = new ASTNode("Literal", "'BB'", null, null, null);
        funcEqNode2.left = funcNode2;
        funcEqNode2.right = funcValNode2;
        funcNode2.parent = funcEqNode2;
        funcValNode2.parent = funcEqNode2;

        var funcNode3 = new ASTNode("Literal", "FUNC_CODE", null, null, null);
        var funcEqNode3 = new ASTNode("MathExpr", "<", null, null, null);
        var funcValNode3 = new ASTNode("Literal", "'BB'", null, null, null);
        funcEqNode3.left = funcNode2;
        funcEqNode3.right = funcValNode3;
        funcNode3.parent = funcEqNode3;
        funcValNode3.parent = funcEqNode3;

        var funcNode4 = new ASTNode("Literal", "FUNC_CODE", null, null, null);
        var funcEqNode4 = new ASTNode("MathExpr", "<=", null, null, null);
        var funcValNode4 = new ASTNode("Literal", "'BB'", null, null, null);
        funcEqNode4.left = funcNode4;
        funcEqNode4.right = funcValNode4;
        funcNode4.parent = funcEqNode4;
        funcValNode4.parent = funcEqNode4;

        var funcNode5 = new ASTNode("Literal", "FUNC_CODE", null, null, null);
        var funcEqNode5 = new ASTNode("MathExpr", ">=", null, null, null);
        var funcValNode5 = new ASTNode("Literal", "'BB'", null, null, null);
        funcEqNode5.left = funcNode5;
        funcEqNode5.right = funcValNode5;
        funcNode5.parent = funcEqNode5;
        funcValNode5.parent = funcEqNode5;

        var result = ParserNm.GenerateMathSearchFilter(funcEqNode);
        var result2 = ParserNm.GenerateMathSearchFilter(funcEqNode2);
        var result3 = ParserNm.GenerateMathSearchFilter(funcEqNode3);
        var result4 = ParserNm.GenerateMathSearchFilter(funcEqNode4);
        var result5 = ParserNm.GenerateMathSearchFilter(funcEqNode5);

        expect(result).toEqual({
            groupOpt: 'And',
            rules: [{
                data: 'BB',
                op: 'eq',
                field: 'FUNC_CODE'
            }]
        });

        expect(result2).toEqual({
            groupOpt: 'And',
            rules: [{
                data: 'BB',
                op: 'gt',
                field: 'FUNC_CODE'
            }]
        });

        expect(result3).toEqual({
            groupOpt: 'And',
            rules: [{
                data: 'BB',
                op: 'lt',
                field: 'FUNC_CODE'
            }]
        });

        expect(result4).toEqual({
            groupOpt: 'And',
            rules: [{
                data: 'BB',
                op: 'le',
                field: 'FUNC_CODE'
            }]
        });

        expect(result5).toEqual({
            groupOpt: 'And',
            rules: [{
                data: 'BB',
                op: 'ge',
                field: 'FUNC_CODE'
            }]
        });
    });

    it('tests GenerateMathSearchFilter method', function () {
        var inFieldNode = new ASTNode('Literal', 'TT', null, null, null);
        var inValNode = new ASTNode('Literal', "('MMMM', 'Tsss')", null, null, null);
        var inNode = new ASTNode('MathExpr', 'IN', null, null, null);

        inNode.left = inFieldNode;
        inFieldNode.parent = inNode;

        inNode.right = inValNode;
        inValNode.parent = inNode;

        expect(ParserNm.GenerateInSearchFilter(inNode)).toEqual({
            groupOpt: 'Or',
            rules: [
                { data: 'MMMM', op: 'eq', field: 'TT' },
                { data: 'Tsss', op: 'eq', field: 'TT' },
            ]
        })
    });

    it('tests GenerateLikeSearchFilter method', function () {
        var funcNode = new ASTNode("Literal", "FUNC_CODE", null, null, null);
        var funcEqNode = new ASTNode("MathExpr", "like", null, null, null);
        var funcValNode = new ASTNode("Literal", "'%BB%'", null, null, null);
        funcEqNode.left = funcNode;
        funcEqNode.right = funcValNode;
        funcNode.parent = funcEqNode;
        funcValNode.parent = funcEqNode;

        var funcNode1 = new ASTNode("Literal", "FUNC_CODE", null, null, null);
        var funcEqNode1 = new ASTNode("MathExpr", "like", null, null, null);
        var funcValNode1 = new ASTNode("Literal", "'%BB'", null, null, null);
        funcEqNode1.left = funcNode1;
        funcEqNode1.right = funcValNode1;
        funcNode1.parent = funcEqNode1;
        funcValNode1.parent = funcEqNode1;

        var funcNode2 = new ASTNode("Literal", "FUNC_CODE", null, null, null);
        var funcEqNode2 = new ASTNode("MathExpr", "like", null, null, null);
        var funcValNode2 = new ASTNode("Literal", "'BB%'", null, null, null);
        funcEqNode2.left = funcNode2;
        funcEqNode2.right = funcValNode2;
        funcNode2.parent = funcEqNode2;
        funcValNode2.parent = funcEqNode2;

        expect(ParserNm.GenerateLikeSearchFilter(funcEqNode)).toEqual({
            groupOpt: 'And',
            rules: [
                { data: 'BB', op: 'cn', field: 'FUNC_CODE' }
            ]
        });

        expect(ParserNm.GenerateLikeSearchFilter(funcEqNode1)).toEqual({
            groupOpt: 'And',
            rules: [
                { data: 'BB', op: 'ew', field: 'FUNC_CODE' }
            ]
        });

        expect(ParserNm.GenerateLikeSearchFilter(funcEqNode2)).toEqual({
            groupOpt: 'And',
            rules: [
                { data: 'BB', op: 'sw', field: 'FUNC_CODE' }
            ]
        });

    });

    it('tests GenerateFitlter method', function () {
        var funcNode = new ASTNode("Literal", "FUNC_CODE", null, null, null);
        var funcEqNode = new ASTNode("MathExpr", "=", null, null, null);
        var funcValNode = new ASTNode("Literal", "'BB'", null, null, null);
        funcEqNode.left = funcNode;
        funcEqNode.right = funcValNode;
        funcNode.parent = funcEqNode;
        funcValNode.parent = funcEqNode;

        expect(ParserNm.GenerateFitlter(funcEqNode)).toEqual({
            groupOpt: 'And',
            rules: [{
                data: 'BB',
                op: 'eq',
                field: 'FUNC_CODE'
            }]
        });

        var funcNode2 = new ASTNode("Literal", "FUNC_CODE", null, null, null);
        var funcEqNode2 = new ASTNode("MathExpr", ">", null, null, null);
        var funcValNode2 = new ASTNode("Literal", "'BB'", null, null, null);
        funcEqNode2.left = funcNode2;
        funcEqNode2.right = funcValNode2;
        funcNode2.parent = funcEqNode2;
        funcValNode2.parent = funcEqNode2;

        expect(ParserNm.GenerateFitlter(funcEqNode2)).toEqual({
            groupOpt: 'And',
            rules: [{
                data: 'BB',
                op: 'gt',
                field: 'FUNC_CODE'
            }]
        });

        var funcNode3 = new ASTNode("Literal", "FUNC_CODE", null, null, null);
        var funcEqNode3 = new ASTNode("MathExpr", "<", null, null, null);
        var funcValNode3 = new ASTNode("Literal", "'BB'", null, null, null);
        funcEqNode3.left = funcNode3;
        funcEqNode3.right = funcValNode3;
        funcNode3.parent = funcEqNode3;
        funcValNode2.parent = funcEqNode3;

        expect(ParserNm.GenerateFitlter(funcEqNode3)).toEqual({
            groupOpt: 'And',
            rules: [{
                data: 'BB',
                op: 'lt',
                field: 'FUNC_CODE'
            }]
        });

        var funcNode4 = new ASTNode("Literal", "FUNC_CODE", null, null, null);
        var funcEqNode4 = new ASTNode("MathExpr", ">=", null, null, null);
        var funcValNode4 = new ASTNode("Literal", "'BB'", null, null, null);
        funcEqNode4.left = funcNode4;
        funcEqNode4.right = funcValNode4;
        funcNode4.parent = funcEqNode4;
        funcValNode4.parent = funcEqNode4;

        expect(ParserNm.GenerateFitlter(funcEqNode4)).toEqual({
            groupOpt: 'And',
            rules: [{
                data: 'BB',
                op: 'ge',
                field: 'FUNC_CODE'
            }]
        });

        var funcNode5 = new ASTNode("Literal", "FUNC_CODE", null, null, null);
        var funcEqNode5 = new ASTNode("MathExpr", "<=", null, null, null);
        var funcValNode5 = new ASTNode("Literal", "'BB'", null, null, null);
        funcEqNode5.left = funcNode5;
        funcEqNode5.right = funcValNode5;
        funcNode5.parent = funcEqNode5;
        funcValNode5.parent = funcEqNode5;

        expect(ParserNm.GenerateFitlter(funcEqNode5)).toEqual({
            groupOpt: 'And',
            rules: [{
                data: 'BB',
                op: 'le',
                field: 'FUNC_CODE'
            }]
        });

        //like
        var funcNode6 = new ASTNode("Literal", "FUNC_CODE", null, null, null);
        var funcEqNode6 = new ASTNode("MathExpr", "like", null, null, null);
        var funcValNode6 = new ASTNode("Literal", "'%BB%'", null, null, null);
        funcEqNode6.left = funcNode6;
        funcEqNode6.right = funcValNode6;
        funcNode6.parent = funcEqNode6;
        funcValNode6.parent = funcEqNode6;

        var funcNode7 = new ASTNode("Literal", "FUNC_CODE", null, null, null);
        var funcEqNode7 = new ASTNode("MathExpr", "like", null, null, null);
        var funcValNode7 = new ASTNode("Literal", "'%BB'", null, null, null);
        funcEqNode7.left = funcNode7;
        funcEqNode7.right = funcValNode7;
        funcNode7.parent = funcEqNode7;
        funcValNode7.parent = funcEqNode7;

        var funcNode8 = new ASTNode("Literal", "FUNC_CODE", null, null, null);
        var funcEqNode8 = new ASTNode("MathExpr", "like", null, null, null);
        var funcValNode8 = new ASTNode("Literal", "'BB%'", null, null, null);
        funcEqNode8.left = funcNode8;
        funcEqNode8.right = funcValNode8;
        funcNode8.parent = funcEqNode8;
        funcValNode8.parent = funcEqNode8;

        expect(ParserNm.GenerateLikeSearchFilter(funcEqNode6)).toEqual({
            groupOpt: 'And',
            rules: [
                { data: 'BB', op: 'cn', field: 'FUNC_CODE' }
            ]
        });

        expect(ParserNm.GenerateLikeSearchFilter(funcEqNode7)).toEqual({
            groupOpt: 'And',
            rules: [
                { data: 'BB', op: 'ew', field: 'FUNC_CODE' }
            ]
        });

        expect(ParserNm.GenerateLikeSearchFilter(funcEqNode8)).toEqual({
            groupOpt: 'And',
            rules: [
                { data: 'BB', op: 'sw', field: 'FUNC_CODE' }
            ]
        });

    });

    it('tests TraverseTreeToGenerateRules method if condition', function () {
        var funcNode = new ASTNode("Literal", "FUNC_CODE", null, null, null);
        var funcEqNode = new ASTNode("MathExpr", "=", null, null, null);
        var funcValNode = new ASTNode("Literal", "'BB'", null, null, null);
        funcEqNode.left = funcNode;
        funcEqNode.right = funcValNode;
        funcNode.parent = funcEqNode;
        funcValNode.parent = funcEqNode;

        var parser = new ParserNm.Parser('');

        parser.TraverseTreeToGenerateRules(funcEqNode);
        expect(parser.list).toEqual([{
            groupOpt: 'And',
            rules: [{
                data: 'BB',
                op: 'eq',
                field: 'FUNC_CODE'
            }]
        }]);
    });

    it('tests TraverseTreeToGenerateRules method else condition', function () {
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

        var parser = new ParserNm.Parser('');

        parser.TraverseTreeToGenerateRules(andNode);
        expect(parser.list).toEqual([
            {
                groupOpt: 'AND',
                rules: [{
                    data: 'BB',
                    op: 'eq',
                    field: 'FUNC_CODE'
                }]
            },
            {
                groupOpt: 'AND',
                rules: [{
                    data: 'CC',
                    op: 'eq',
                    field: 'REGION_CODE'
                }]
            }
        ])
    });

    it('tests parser constructor', function () {
        var parser = new ParserNm.Parser("FUNC_CODE = 'BB' AND REGION_CODE = 'CC' OR TT IN ('MMMM', 'NNN')");

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
        var inValNode = new ASTNode('Literal', "('MMMM', 'NNN')", null, null, null);
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

        expect(parser.ast).toEqual(orNode);
    });

    it('tests filter of parse method', function () {
        var parser = new ParserNm.Parser("FUNC_CODE = 'BB' AND REGION_CODE = 'CC' OR TT IN ('MMMM', 'NNN')");
        parser.TraverseTreeToGenerateRules(parser.ast);
        var andLen = parser.list.filter(o => /\bAnd\b/ig.test(o.groupOpt)).length;
        var orLen = parser.list.filter(o => /\bor\b/ig.test(o.groupOpt)).length;

        expect(andLen).toBe(2);
        expect(orLen).toBe(1);
    });

    it('tests parse method', function () {
        
        var parser = new ParserNm.Parser("1 = 1 and FUNC_CODE = 'BB' AND REGION_CODE = 'CC' OR TT IN ('MMMM', 'NNN')");
        var obj = parser.parse();
        var len = obj.AndFilters.rules.length;
        expect(len).toBe(2);

    });
});