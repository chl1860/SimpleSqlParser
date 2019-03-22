var Tokenizer = require('../src/token').Tokenizer;

describe('Tokenizer test',function(){
    var tokenizer;
    beforeEach(function(){
        tokenizer = new Tokenizer()
    });

    it('tests split string by space',function(){
        var str1 = 'Abc and "CDE" AND "mn"';
        var array = str1.split(/\s/g);
        
        expect(array).toEqual(['Abc','and','\"CDE\"','AND','\"mn\"']);
    });

    it('tests splited item is full string',function(){
        var str1 = "Abc",
            str2 = "Abc'abc'",
            str3 = "Abc'abc",
            str4 = "('ab', 'd')"
            str5 = "('ab', 'd'"
            str6 = "'(ab",
            str7= "'(abc)",
            str8 = "'(abc)'";


        var result1 = tokenizer.isFullString(str1);
        var result2 = tokenizer.isFullString(str2);
        var result3 = tokenizer.isFullString(str3);
        var result4 = tokenizer.isFullString(str4);
        var result5 = tokenizer.isFullString(str5);
        var result6 = tokenizer.isFullString(str6);
        var result7 = tokenizer.isFullString(str7);
        var result8 = tokenizer.isFullString(str8);

        expect(result1).toBe(true);
        expect(result2).toBe(true);
        expect(result3).toBe(false);
        expect(result4).toBe(true);
        expect(result5).toBe(false);
        expect(result6).toBe(false);
        expect(result7).toBe(false);
        expect(result8).toBe(true);
    });

    it('tests merged array method',function(){
        var str = "A and b and '(c, d, e)'";
        var str1 = "FUNC_CODE = 'aA'";

        var result = tokenizer.getMergedArray(str);
        var result1 = tokenizer.getMergedArray(str1);

        expect(result).toEqual(["A","and","b","and","'(c, d, e)'"]);
        expect(result1).toEqual(["FUNC_CODE","=","'aA'"]);

    });
});