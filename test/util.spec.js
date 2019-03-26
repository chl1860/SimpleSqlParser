var Util = require('../src/util').Util;

describe('Test Uitl', function () {

    var util;
    beforeEach(function () {
        util = new Util();
    });

    it('tests isMathExpr method', function () {
        var str1 = "A='b'";
        var str2 = "A = 'bcd'";
        var str3 = "A= 'MMM'";
        var str4 = "A in('tt',ll)";
        var str5 = "A in ('tt',ll)";
        var str6 = "Ain('tt')";
        var str7 = "Alike'%b'";
        var str8 = "A like '%b'";

        expect(util.isMathExpr(str1)).toBe(true);
        expect(util.isMathExpr(str2)).toBe(true);
        expect(util.isMathExpr(str3)).toBe(true);
        expect(util.isMathExpr(str4)).toBe(true);
        expect(util.isMathExpr(str5)).toBe(true);
        expect(util.isMathExpr(str6)).toBe(false);
        expect(util.isMathExpr(str7)).toBe(false);
        expect(util.isMathExpr(str8)).toBe(true);
    });

    it('tests isLogicExpr method', function () {
        var str1 = "a and b";
        var str2 = "aand b";
        var str3 = "aandb";
        var str4 = "a or b";
        var str5 = "a orb";
        var str6 = "aorb";
        var str7 = "aor b";

        expect(util.isLogicExpr(str1)).toBe(true);
        expect(util.isLogicExpr(str2)).toBe(false);
        expect(util.isLogicExpr(str3)).toBe(false);
        expect(util.isLogicExpr(str4)).toBe(true);
        expect(util.isLogicExpr(str5)).toBe(false);
        expect(util.isLogicExpr(str6)).toBe(false);
        expect(util.isLogicExpr(str7)).toBe(false);

    });
});