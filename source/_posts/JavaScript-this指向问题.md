---

title: JavaScript-this 指向问题
date: 2019-01-02 11:12:37
tags: tags: 基础
categories: TypeScript

---

##### this 特点

JavaScript 中 this 不是固定不变的，它会随着执行环境的改变而改变，所以具有很大的迷惑性。

##### this 指向问题

JavaScript 的 this 指向，简单的来说，我们通常可以理解为 [**谁调用，this 就指向谁**] ,这句话并不严谨，但是可以解释极大多数情况下的 this 指向。

- 示例一
  ```js
  var x = "a";
  function bar() {
    console.log(this.x);
  }
  bar(); // 'a'
  ```
  打印结构为`a`,即这里的 `this` 为全局对象，这里调用的 `bar()`,实际上是 `window.bar()`; `window` 也就是全局对象，所以这种情况符合 [**谁调用，this 就指向谁**] 这句话。
- 示例二
  ```js
  b = "1";
  var a = {
    b: "0",
    bar: function () {
      console.log(this.b);
    },
  };
  a.bar(); //'0'
  ```
  打印结果为 `0`，即这里的 `this` 指向是对象 `a`，`a.bar()`,很明显，这里是对象 `a` 调用的方法 `bar`，所以这里的 `this` 指向对象 `a`，这种情况也符合 [**谁调用，this 就指向谁**] 。
- 示例三

  ```js
  var a = "1";
  function Test() {
    this.a = "0";
  }
  var obj = new Test();
  obj.a; // '0'`
  ```

  打印结果为`0`，即这里的 this 指向的是通过构造函数生成的新对象，这里情况比较特殊一点，涉及到了构造函数的一些隐式结构，当构造函数生产实例对象时，会在构造函数内容隐式的申明一个 `this` 的空对象，然后再末尾 return 出去，赋予生产的新对象，所以这里的 `this` 指向实际上就是新生产的实例对象。

- 示例四
  ```js
  var a = "0";
  var obj = {
    a: "1",
    b: {
      a: "2",
      bar: function () {
        console.log(this.a);
      },
    },
  };
  obj.b.bar(); //'2'
  ```

这里打印结果是 `2`，很明显这里的 `this` 指向的是 `b` 对象，通过大量的实验，不难得出一个补充结论， [**谁 `直接` 调用，`this` 就指向谁**]，如果我们注释掉 b 对象中的 a 申明，打印结果一定会是 undefined。

- 示例五 [`call()`,`apply()`]

  ```js
  var a = {
    typeName: "call",
    bar: function () {
      console.log(this.typeName);
    },
  };
  var f1 = a.bar;
  f1(); // 'undefined'
  f1.call(a); //'call'
  var b = {
    typeName: "apply ",
    bar: function () {
      console.log(this.typeName);
    },
  };
  var f2 = b.bar;
  f2.call(b); //'apply'
  ```

`call()`和 `apply()`能够手动的更改 `this` 的指向，支持接受多个参数，第一个参数是 `this` 的具体指向，后面的参数是函数的需要的参数,不同的是 `apply()`的第二个参数接受一个数组，数组内的值为函数需要的参数。需要注意的是，如果第一个参数为 `null` 的话，则 `this` 指向全局。（

> tips：js 所有的原型链，最终都指向 Object,但是通过 call(null),apply(null)处理的对象，原型链最终指向是 null）
