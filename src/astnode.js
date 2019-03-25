
/**
 * @description AST node
 * @param {*} type 
 * @param {*} value 
 * @param {*} left 
 * @param {*} right 
 */
function ASTNode(type, value,left,right,parent){
    this.type = type;
    this.value = value;
    this.parent = parent;
    this.left = left;
    this.right = right;
    this.parent = parent;
}

module.exports = {
    ASTNode
}

