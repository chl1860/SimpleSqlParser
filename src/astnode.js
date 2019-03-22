
/**
 * @description AST node
 * @param {*} type 
 * @param {*} value 
 * @param {*} left 
 * @param {*} right 
 */
function ASTNode(type, value,parent,left,right){
    this.type = type;
    this.value = value;
    this.parent = parent;
    this.left = left;
    this.right = right;
}

module.exports = {
    ASTNode
}

