# Docs
Angular2 Observable和RxJS (https://www.jianshu.com/p/618fc55b1754) .

RxJS文档链接 https://rxjs-dev.firebaseapp.com/ .

ES6 http://caibaojian.com/es6/promise.html

原型链 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain

Angular—OnPush策略怎样影响变更检测过程 https://zhuanlan.zhihu.com/p/54380758?edition=yidianzixun&utm_source=yidianzixun&yidian_docid=0L2jYlyb

观察者模式  https://segmentfault.com/a/1190000015640618

UI   https://mp.weixin.qq.com/s/iuavg_w3uhcjDov4tL-B9Q


JS 继承方式：

1. 原型链继承 2. 构造继承 3. 实例继承 4. 拷贝继承 5. 组合继承 6. 寄生组合继承

大型网站性能优化实战

前端性能优化原理与实践

事件委托以及冒泡原理
简介：事件委托指的是，不在事件的发生地（直接dom）上设置监听函数，而是在其父元素上设置监听函数，通过事件冒泡，父元素可以监听到子元素上事件的触发，通过判断事件发生元素DOM的类型，来做出不同的响应。
举例：最经典的就是ul和li标签的事件监听，比如我们在添加事件时候，采用事件委托机制，不会在li标签上直接添加，而是在ul父元素上添加。
好处：比较合适动态元素的绑定，新添加的子元素也会有监听函数，也可以有事件触发机制。

new 操作符做了哪些事情
用 new 操作符调用构造函数实际上会经历以下 4 个步骤:

1.创建一个新对象;
2.将构造函数的作用域赋给新对象(因此 this 就指向了这个新对象);
3.执行构造函数中的代码(为这个新对象添加属性);
4.返回新对象。
5.将构造函数的prototype关联到实例的__proto__

###数组去重

var array = [1, 1, '1', '1'];

function unique(array) {
    // res用来存储结果
    var res = [];
    for (var i = 0, arrayLen = array.length; i < arrayLen; i++) {
        for (var j = 0, resLen = res.length; j < resLen; j++ ) {
            if (array[i] === res[j]) {
                break;
            }
        }
        // 如果array[i]是唯一的，那么执行完循环，j等于resLen
        if (j === resLen) {
            res.push(array[i])
        }
    }
    return res;
}

console.log(unique(array)); // [1, "1"]

