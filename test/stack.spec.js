var Stack = require('../src/stack').Stack;

describe('Stack test',function(){
    var stack;
    
    it("tests stack init",function(){
        var stack = new Stack();
        expect(stack).toBeInstanceOf(Stack);
    });

    beforeEach(function(){
        stack = new Stack();
    });

    it("tests stack push method",function(){
        stack.push(1);
        stack.push(2);

        var len = stack.len;

        expect(len).toBe(2);
        expect(stack.array[len-1]).toBe(2);
    });

    it("tests stack len after pop method excuted",function(){
        expect(stack.len).toBe(0);
        expect(stack.pop()).toBeUndefined();
        
        stack.push(1);
        stack.push(2);
        stack.push(3);
        
        expect(stack.len).toBe(3);

        stack.pop();
        expect(stack.len).toBe(2);
        

    });

    it("tests stack pop method",function(){
        stack.push(1);
        stack.push(2);
        stack.push(3);

        var item = stack.pop();
        
        expect(item).toBe(3);
    });


    it("tests stack clear method",function(){
        stack.push(1);
        stack.push(2);
        stack.push(3);

        stack.clear();
        expect(stack.len).toBe(0);
    });


});