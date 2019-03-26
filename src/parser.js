var Lexer = require('./lexer').Lexer;

function Parser(str) {
    let lexer = new Lexer(str);
    this.ast = lexer.generateAST();
    this.list = [];
}

function GenerateFitlter(root) {
    switch (root.value.replace(/(?:^\s+|\s+$)/g, '').toUpperCase()) {
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
        '=': 'eq',
        '>': 'gt',
        '>=': 'ge',
        '<': 'lt',
        '<=': 'le'
    };

    return {
        groupOpt: root.parent ? root.parent.value : 'And',
        rules: [{
            data: right.value.replace(/\'/g, ''),
            field: left.value,
            op: opDic[root.value]
        }]
    };
}

function GenerateInSearchFilter(root) {
    var left = root.left;
    var right = root.right;
    var valList = right.value.replace(/(?:\(|\)|\')/g, '').split(',');

    return {
        groupOpt: 'Or',
        rules: valList.map(o => {
            return {
                data: o.replace(/(?:^\s|\s$)/g,''),
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
        groupOpt: root.parent ? root.parent.value : 'And',
        rules: [{
            data: right.value.replace(/(?:^\s|\s$|\%|\')/g,''),
            field: left.value,
            op
        }]
    };
}

Parser.prototype.TraverseTreeToGenerateRules = function(root) {
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
    this.TraverseTreeToGenerateRules(this.ast);
    //对 and 和 or 进行分类
    let andFilterList = this.list.filter(o => /\bAnd\b/ig.test(o.groupOpt));
    let orFilterList = this.list.filter(o => /\bor\b/ig.test(o.groupOpt));
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
    orRules = orRules.filter(o => !(/^1$/g.test(o.data) && o.op === 'eq' && /^1$/g.test(o.field)));
    return {
        AndFilters: {
            groupOpt: 'And',
            rules: andRules.length > 0 ? andRules : []
        },
        OrFilters: {
            groupOpt: 'Or',
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