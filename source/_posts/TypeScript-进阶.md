---
title: TypeScript-进阶
date: 2021-08-02 11:00:32
tags: [TypeScript]
categories: TypeScript
---

#### 类型别名

类型别名用来给一个类型起一个新的名字,使用 `type` 修饰.

```ts
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(name: NameOrResolver): void {
  if (typeof n === "string") {
    return n;
  } else {
    return n();
  }
}
```

类型别名常用于联合类型.

#### 字符串字面量类型

字符串字面量类型用来约束取值只能是某几个字符串中的一个.

```ts
type EventNames = "click" | "scroll" | "mousemove";
function handleEvent(ele: Element, event: EventNames) {
  // do something
}

handleEvent(document.getElementById("hello"), "scroll"); // 没问题
handleEvent(document.getElementById("world"), "dblclick"); // 报错，event 不能为 'dblclick'
```

上例中使用了`type`定了一个字符串字面量类型`EventNames`,它只能取三种字符串中的一种.

> **类型别名**和**字符串字面量类型**都是使用`type`定义的.

#### 元组

数组合并了相同类型的对象,而元组合并了不同类型的对象.
简单的栗子

```ts
let boy: [string, number] = ["tom", 20];
```

可以访问,赋值正确类型的值,添加越界元素时,它的类型会被限制为元组中每个类型的联合类型.

```ts
let boy: [string, number];
boy = ["tom", 20];
boy.push("male"); //success
boy.push(true); //error,Argument of type 'true' is not assignable to parameter of type 'string | number'.
```

因此使用元祖可以确定元素数据类型，但不要超出范围，可以把元祖理解为固定长度，超出范围不能保证其类型。

#### 枚举

枚举类型用于取值被限定在一定范围内的场景,比如一周只能是 7 天.
简单的例子
枚举使用`enum`关键字来定义.

```ts
enum Days {
  Sun,
  Mon,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat,
}
```

枚举成员会被从`0`开始递增的数字进行赋值,同时也会对枚举名进行反向映射.

```ts
enum Days {
  Sun,
  Mon,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat,
}
console.log(Days[0] === "sun"); //true
console.log(Days["Sun"] === 0); //true
```

##### 手动赋值

可以给枚举手动赋值:

```ts
enum Days {
  Sun = 3,
  Mon = 2,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat,
}
console.log(Days["Sun"] === 3); // true
console.log(Days["Mon"] === 2); // true
console.log(Days["Tue"] === 3); // true
console.log(Days["Sat"] === 7); // true
```

未手动赋值的枚举项会接着上一个枚举项递增,递增步长为 **1**。
如果未手动赋值的枚举项与手动赋值重复, `TypeScript` 不会察觉到这一点.

```ts
enum Days {
  Sun = 3,
  Mon = 1,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat,
}

console.log(Days["Sun"] === 3); // true
console.log(Days["Wed"] === 3); // true
console.log(Days[3] === "Sun"); // false
console.log(Days[3] === "Wed"); // true 覆盖掉前一个值.
```

#### 类

传统方法中, `JavaScript` 通过构造函数类实现类的概念,通过原型链实现继承.
`ES6` 中使用 `Class` 实现这些功能.

##### 概念

- 类(Class):定义一件事物的抽象特点,包含它的属性和方法.
- 对象(Object):类的实例,通过`new`生成.
- 面向对象(OOP)的三大特性:封装、继承、多态.
  - 封装: 将对数据的操作细节隐藏起来,只暴露对外的接口.实现黑匣子模型,通过对外提供的接口来访问该对象,同时也保证了外界无法任意更改对象内部的数据.
  - 继承: 子类继承父类,子类除了拥有父类的所有特征外,还有一些更具体的特性.
  - 多态: 由继承而产生了相关的不同的类,对同一个方法可以有不同的响应.
- 存取器: 用以改变属性的读取和赋值行为.
- 修饰器: 修饰器是一些关键字,用于限定成员或者类型的性质.
- 抽象类: 抽象类是供其他类继承的基类,抽象类不允许被实例化.抽象类中的抽象方法必须在子类中被实现.
- 接口: 不同的类之间公有的属性或者方法,可以抽象为一个接口.接口可以被类实现.一个类只能继承自另一个类,但是可以实现多个接口.

##### ES6 中的用法

###### 属性和方法

使用 `Class` 定义类,使用 `constructor` 定义构造函数.
通过 `new` 来生成实例时,会自动调用构造函数.

```ts
class Animal {
  public name;
  constructor(name) {
    this.name = name;
  }
  sayHi() {
    return `My name is ${this.name}`;
  }
}
let cat = new Animal("cherry");
console.log(cat.sayHi());
```

###### 类的继承

使用 `extends` 关键字实现继承,子类中使用 `super` 关键字来调用父类的构造函数和方法.

```ts
class Cat extends Animal {
  constructor(name, color) {
    super(name); // 调用父类的constructor(name)
    this.color = color;
  }
  sayHi() {
    return "cat," + super.sayHi(); // 调用父类的sayHi();
  }
}
```

###### 存取器

使用 `getter` 和 `setter` 可以改变属性的赋值和读取行为:

```ts
class Animal {
  constructor(name) {
    this.name = name;
  }
  get name() {
    return "getter";
  }
  set name(value) {
    console.log("setter: " + value);
  }
}
let a = new Animal("Kitty"); // setter: Kitty
a.name = "Tom"; // setter: Tom
console.log(a.name); // Jack
```

###### 静态方法

使用 `static` 修饰符修饰的方法称为静态方法,他们不需要实例化,而是通过类来直接调用;

```ts
class Animal {
  static isAnimal(a) {
    return a instanceof Animal;
  }
}
let cat = new Animal("jack");
cat.isAnimal(a); // TypeError: a.isAnimal is not a function
Animal.isAnimal(a); // true
```
