function Lexer(str){
    this.str = str;
}

/**
 * 根据词法对 str 进行拆分
 * @example "FUNC_CODE='ABC' AND REGION_CODE = 'MN'" => ["FUNC_CODE='ABC'","REGION_CODE = 'MN'"]
 */
Lexer.prototype.split = function(){

}

module.exports={
    Lexer
}