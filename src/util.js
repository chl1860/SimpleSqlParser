/**
 * 提供通用的工具方法
 */

function Util(){

}
/**
 * @description 判断是否为计算表达式
 */
Util.prototype.isMathExpr = function isMathExpr(str) {
    var mathTokens = [/\=/ig, /\b(?:In)\b/ig, /\blike\b\s+/ig];
    return mathTokens.filter(o => o.test(str)).length > 0;
}

/**
 * @description 判断是否为逻辑表达式
 */
Util.prototype.isLogicExpr = function isLogicExpr(str) {
    var logicTokens = [/\bAND\b/ig, /\bOR\b/ig];
    return logicTokens.filter(o => o.test(str)).length > 0;

}

module.exports = {
    Util
};
