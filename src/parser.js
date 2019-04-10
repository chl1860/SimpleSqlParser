var Lexer = require('./lexer').Lexer;

function Parser(str) {
    this.lexer = new Lexer();
    this.array = this.lexer.getMergedArray(str)
    this.list = [];
}

function GenerateFitlter(root) {
    switch (root.value.replace(/(?:^\s+|\s+$)/g, '').toUpperCase()) {
        case 'IS':
        case '=':
        case '>':
        case '<':
        case '>=':
        case '<=':
            return GenerateMathSearchFilter(root);
        case 'IN':
            return GenerateInSearchFilter(root);
        case 'LIKE':
            return GenerateLikeSearchFilter(root);
    }
}

function GenerateMathSearchFilter(root) {
    var left = root.left;
    var right = root.right;
    var opDic = {
        'IS':'eq',
        '=': 'eq',
        '>': 'gt',
        '>=': 'ge',
        '<': 'lt',
        '<=': 'le'
    };

    return {
        groupOp: root.parent ? root.parent.value : 'AND',
        rules: [{
            data: right.value.replace(/\'/g, ''),
            field: left.value,
            op: opDic[root.value.toUpperCase()]
        }]
    };
}

function GenerateInSearchFilter(root) {
    var left = root.left;
    var right = root.right;
    var valList = right.value.replace(/(?:\(|\)|\')/g, '').split(',');

    return {
        groupOp: 'OR',
        rules: valList.map(o => {
            return {
                data: o.replace(/(?:^\s|\s$)/g, ''),
                op: 'eq',
                field: left.value
            };
        })
    };
}

function GenerateLikeSearchFilter(root) {
    var left = root.left;
    var right = root.right;
    var val = right.value.replace(/(?:^\s|\s$)/g, '')
        .replace(/\'/g, '');
    var op = '';
    if (/^\%.+\%$/g.test(val)) {
        op = 'cn';
    } else if (/^%/g.test(val)) {
        op = 'ew';
    } else if (/\%$/g.test(val)) {
        op = 'sw';
    }

    return {
        groupOp: root.parent ? root.parent.value : 'AND',
        rules: [{
            data: right.value.replace(/(?:^\s|\s$|\%|\')/g, ''),
            field: left.value,
            op
        }]
    };
}

//生成 AST

Parser.prototype.generateAstNode = function (nodeList = []) {
    // var nodeList = this.generateTokenizedNodeList();
    var self = this;
    var len = nodeList.length;
    if (!/\barray\b/ig.test(Object.prototype.toString.call(nodeList))) {
        throw 'The parameter of generateAstNode should be array';
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
                    } else {
                        let p = prev;
                        let temp = null
                        while (p) {
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

Parser.prototype.generateAST = function () {
    var self = this;
    var nodeListist = self.lexer.generateTokenizedNodeList(self.array);
    return self.generateAstNode(nodeListist);
}

Parser.prototype.TraverseTreeToGenerateRules = function (root) {
    //遍历到子节点为 MathExpression 时 生成 searchFilter
    //否则分别遍历左子树和右子树
    var self = this;
    if (root) {
        if (root.type === 'MathExpr') {
            self.list.push(GenerateFitlter(root));
        } else {
            self.TraverseTreeToGenerateRules(root.left, root.value);
            self.TraverseTreeToGenerateRules(root.right, root.value);
        }
    }
}

Parser.prototype.parse = function () {
    var ast = this.generateAST();
    this.TraverseTreeToGenerateRules(ast);
    //对 and 和 or 进行分类
    let andFilterList = this.list.filter(o => /\band\b/ig.test(o.groupOp));
    let orFilterList = this.list.filter(o => /\bor\b/ig.test(o.groupOp));
    let andRules = [];
    let orRules = [];

    if (andFilterList.length > 0) {
        andFilterList.forEach(o => {
            andRules = andRules.concat(o.rules);
        });
    }

    if (orFilterList.length > 0) {
        orFilterList.forEach(o => {
            orRules = orRules.concat(o.rules);
        });
    }

    //清理 1=1 的选项
    andRules = andRules.filter(o => !(/^1$/g.test(o.data) && o.op === 'eq' && /^1$/g.test(o.field)));
    var prevOrRules = orRules.filter(o => (/^1$/g.test(o.data) && o.op === 'eq' && /^1$/g.test(o.field)));
    orRules = prevOrRules.length > 0 ? [] : prevOrRules;
    return {
        AndFilters: {
            groupOp: 'AND',
            rules: andRules.length > 0 ? andRules : []
        },
        OrFilters: {
            groupOp: 'OR',
            rules: orRules.length > 0 ? orRules : []
        }
    }
}

module.exports = {
    Parser,
    GenerateMathSearchFilter,
    GenerateInSearchFilter,
    GenerateLikeSearchFilter,
    GenerateFitlter,
}