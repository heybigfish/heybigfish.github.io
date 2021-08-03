---
title: JavaScript-构造函数及继承
date: 2021-08-02 18:13:44
tags: 基础
categories: JavaScript
---

##### 函数

JavaScript 中存在 2 种函数，即普通函数和构造函数，两者结构相同，但是用法不同。
为了在形式意义上区分，构造函数习惯上首字母大写，普通函数则首字母小写。

- 普通函数，简单来说就是封装代码块，实现代码块的复用。

- 构造函数
  当你需要大批量的创建对象的时候，就需要用到构造函数，它可以方便创建多个对象的实例，并且创建的对象可以被标识为特定的类型，可以通过继承扩展代码
  结构和普通函数没有区别，习惯上函数名称首字母大写，调用时使用关键字 **new** 进行调用。
  创建一个简单的构造函数
  ```js
  function People(name,sex){
    // 第一个阶段(隐式)
    // var this = {};
    // 第二个阶段
    this.country= 'China';
    this.name = name;
    this.sex = sex;
    // 第三个阶段 (隐式)
    // return this;
    }
    var xiaowang = new People('小王','male');
    var xiaohong = new People('小红','girl');`
  ```

使用 new 操作符调用构造函数时，会经历三个阶段

1. 创建一个新对象：首先在当前形成的私有栈中创建一个对象（创建一个空的堆内存），并且让函数中的执行主体（this）指向这个新的堆内存(新对象);
2. 执行构造函数代码块;
3. 返回新对象;

这里的构造函数 `People` 批量的产生了 `xiaohong` 和 `xiaowang` 两个对象。

有个不太好的地方，那就是对于每一个实例对象，`country` 属性都是一模一样的内容，每生成一个实例，都必须生成相同的属性内存，大量重复的内容，会造成不必要的性能消耗以及内存泄漏。

有没有办法让这些不需要每次都改变的值仅生成，然后所有实例都指向那个内存地址呢？这里就需要考虑使用构造函数的**继承**

##### 继承

- prototype 模式
  `JavaScript` 规定，每一个构造函数都有一个 `prototype` 属性，指向另一个对象(该构造函数生成的实例对象的**proto**对象)。

  这个对象的所有属性和方法，都会被构造函数的实例继承。可以把这些不需要改动的属性挂载到 `prototype` 指向的对象，是不是可以达到继承的目的？

  ```js
  function People(name, sex) {
    this.name = name;
    this.sex = sex;
  }
  People.prototype.country = "China";
  var xiaowang = new People("小王", "male");
  var xiaohong = new People("小红", "girl");
  xiaowang.country; //'China
  xiaohong.country; //'China'
  ```

  这时所有实例的 country 属性其实都是同一个内存地址，指向 prototype 对象，因此就提高了运行效率。
  既然这里的实例对象都是由同一个构造函数制造出来的，Javascript 定义了一些辅助方法，帮助我们找到实例对象的和构造函数的一些联系

  ```

  ```

- isPrototypeOf()
  这个方法帮助我们判断某个 proptotype 对象和某个实例之间的关系
  `console.log(xiaohong.prototype.isPrototypeOf(People)); //true 等同于xiaowang.__proto__.constructor.name`
- hasOwnProperty()
  每个实例对象都有一个 hasOwnProperty()方法，用来判断某一个属性到底是本地属性，还是继承自 prototype 对象的属性
  `console.log(xiaohong.hasOwnProperty(name)); //true console.log(xiaohong.hasOwnProperty(country)); //false`

##### call 或 apply 方法

使用 call 或 apply 方法，将父对象的构造函数绑定在子对象上

```
     function Country(){
         this.country = 'China';
     }
     function People(name,sex){
         Country.apply(this, arguments);
         this.name = name;
         this.sex = sex;
     }
     var xiaowang = new People("小王","男");
     console.log(xiaowang.country);  //'China'

```

##### Prototype 模式改进方法

这个方法与之前相比，忽略了执行和创建 Country 的过程，有了一定的效率优化。

```
      function Country(){};
      Country.prototype.country = 'China';
      function People(name,sex){
          this.name = name;
          this.sex = sex;
      }
      People.prototype = Country.prototype;
      People.prototype.constructor = People;
      //由于复制了Country的prototype属性，所有这时候constructor指向了Country构造函数，为了正确的描述constructor指向，手动修改。
```

存在一个问题，由于 JavaScript 中，对象为引用类型的值，导致 People 和 Country 的 prototype 属性指向了同一个内存地址，修改 People 的 prototype 属性同时也会导致 Country 的 prototype 属性的被动修改。

为了优化这个问题,可以通过 Obiect 的 assign()方法进行深拷贝，同时复制一个新的内存地址，使 People 的修改不会影响 Country 的 prototype 属性。

```
   //People.prototype = Country.prototype; 可以做一下修改
   People.prototype = Object.assign({},Country.prototype);
```

#### 利用空对象作为媒介

利用一个空对象作为媒介，也可以很好的完成继承的功能

```
  var F = function(){};
  F.prototype = Country.prototype;
  People.prototype = new F();
  People.prototype.constructor = People;
```

new F()实例生成了一个新的对象，使 People 的 prototype 和 Country 的 prototype 进行内存地址的隔离，也能很好的处理上一个方法中产生的问题。

基于这个实现过程，现在封装一个函数，便以使用。

```
    function extend(Child,Parent){
        var F = function(){};
        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.prototype.constructor = Child;
    }
```

使用时，直接调用封装好的函数

```
extend( People,Country);
var xiaohong = new People('小红','女');
console.log(xiaohong.country);  //'China'
```
