/**
 * 为处理流程提供简单的 stack 操作
 */

function Stack() {
    this.array = [];
    this.len = 0;
}

/**
 * 向栈顶推入元素
 */
Stack.prototype.push = function (item) {
    var self = this;
    self.array.push(item);
    self.len++;
}

/**
 * 弹出栈顶元素，修改栈的长度并返回弹出元素
 */
Stack.prototype.pop = function () {
    var self = this;
    if (self.len) {
        self.len--
    }
    return self.array.pop();
}

/**
 * 清空栈,并返回被清空的元素集
 */
Stack.prototype.clear = function () {
    var self = this,
        arr = [];
    while (self.len) {
        arr.push(self.pop());
    }
    return arr;
}



module.exports = {
    Stack
}

